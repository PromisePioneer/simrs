<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyFinancialReport;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyUsageReport;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PharmacyFinancialReportService
{
    /**
     * Generate daily financial report
     */
    public function generateDailyReport(string $tenantId, ?string $reportDate = null): PharmacyFinancialReport
    {
        $reportDate = $reportDate ? Carbon::parse($reportDate) : now();
        $startDate = $reportDate->clone()->startOfDay();
        $endDate = $reportDate->clone()->endOfDay();

        return $this->generateReport($tenantId, $startDate, $endDate, 'daily');
    }

    /**
     * Generate weekly financial report
     */
    public function generateWeeklyReport(string $tenantId, ?int $week = null, ?int $year = null): PharmacyFinancialReport
    {
        $year = $year ?? now()->year;
        $week = $week ?? now()->isoWeek;

        $startDate = Carbon::now()->setISODate($year, $week, 1)->startOfDay();
        $endDate = $startDate->clone()->endOfWeek();

        return $this->generateReport($tenantId, $startDate, $endDate, 'weekly');
    }

    /**
     * Generate monthly financial report
     */
    public function generateMonthlyReport(string $tenantId, ?string $yearMonth = null): PharmacyFinancialReport
    {
        $yearMonth = $yearMonth ?? now()->format('Y-m');
        $startDate = Carbon::createFromFormat('Y-m', $yearMonth)->startOfMonth();
        $endDate = $startDate->clone()->endOfMonth();

        return $this->generateReport($tenantId, $startDate, $endDate, 'monthly');
    }

    /**
     * Get revenue trend (last N days/weeks/months)
     */
    public function getRevenueTrend(string $tenantId, string $period = 'daily', int $count = 30): array
    {
        $reports = PharmacyFinancialReport::where('tenant_id', $tenantId)
            ->where('report_period', $period)
            ->orderBy('report_date', 'desc')
            ->limit($count)
            ->get()
            ->reverse()
            ->values();

        return [
            'period' => $period,
            'data' => $reports->map(fn($report) => [
                'date' => $report->report_date,
                'total_sales' => $report->total_sales,
                'net_sales' => $report->net_sales,
                'net_profit' => $report->net_profit,
                'net_profit_percentage' => $report->net_profit_percentage,
            ])->toArray(),
            'summary' => [
                'total_revenue' => $reports->sum('total_sales'),
                'average_daily_revenue' => $reports->avg('total_sales'),
                'total_profit' => $reports->sum('net_profit'),
                'average_profit_margin' => $reports->avg('net_profit_percentage'),
            ],
        ];
    }

    /**
     * Get profit analysis
     */
    public function getProfitAnalysis(string $tenantId, string $period = 'monthly', int $months = 12): array
    {
        $startDate = now()->subMonths($months)->startOfMonth();
        $endDate = now()->endOfMonth();

        $reports = PharmacyFinancialReport::where('tenant_id', $tenantId)
            ->whereBetween('report_date', [$startDate, $endDate])
            ->where('report_period', $period)
            ->orderBy('report_date')
            ->get();

        $profitByMonth = [];
        $profitMarginByMonth = [];

        foreach ($reports as $report) {
            $monthKey = $report->report_date->format('Y-m');
            $profitByMonth[$monthKey] = $report->net_profit;
            $profitMarginByMonth[$monthKey] = $report->net_profit_percentage;
        }

        return [
            'period' => $period,
            'profit_by_period' => $profitByMonth,
            'profit_margin_by_period' => $profitMarginByMonth,
            'highest_profit_period' => collect($profitByMonth)->keys()[collect($profitByMonth)->search(max($profitByMonth))],
            'lowest_profit_period' => collect($profitByMonth)->keys()[collect($profitByMonth)->search(min($profitByMonth))],
            'average_profit' => collect($profitByMonth)->avg(),
            'average_margin' => collect($profitMarginByMonth)->avg(),
        ];
    }

    /**
     * Get cost analysis (COGS breakdown)
     */
    public function getCostAnalysis(string $tenantId, string $period = 'monthly', int $count = 12): array
    {
        $reports = PharmacyFinancialReport::where('tenant_id', $tenantId)
            ->where('report_period', $period)
            ->orderBy('report_date', 'desc')
            ->limit($count)
            ->get()
            ->reverse()
            ->values();

        return [
            'period' => $period,
            'cost_details' => $reports->map(fn($report) => [
                'date' => $report->report_date,
                'total_sales' => $report->total_sales,
                'cogs' => $report->total_cost_of_goods_sold,
                'gross_profit' => $report->gross_profit,
                'gross_margin_percentage' => $report->gross_profit_percentage,
                'operating_expenses' => $report->operating_expenses,
                'net_profit' => $report->net_profit,
            ])->toArray(),
            'summary' => [
                'total_revenue' => $reports->sum('total_sales'),
                'total_cogs' => $reports->sum('total_cost_of_goods_sold'),
                'total_gross_profit' => $reports->sum('gross_profit'),
                'average_gross_margin' => $reports->avg('gross_profit_percentage'),
                'total_operating_expenses' => $reports->sum('operating_expenses'),
                'total_net_profit' => $reports->sum('net_profit'),
            ],
        ];
    }

    /**
     * Get margin analysis by medicine
     */
    public function getMarginAnalysisByMedicine(string $tenantId, string $period = 'monthly', int $count = 12): array
    {
        $usageReports = PharmacyUsageReport::where('tenant_id', $tenantId)
            ->where('report_period', $period)
            ->orderBy('report_date', 'desc')
            ->limit($count)
            ->get();

        $medicineMargins = [];

        foreach ($usageReports as $report) {
            $key = $report->medicine_id;
            if (!isset($medicineMargins[$key])) {
                $medicineMargins[$key] = [
                    'medicine_id' => $report->medicine_id,
                    'total_units' => 0,
                    'total_revenue' => 0,
                    'total_cost' => 0,
                    'total_profit' => 0,
                    'average_margin' => 0,
                ];
            }

            $medicineMargins[$key]['total_units'] += $report->total_units_sold;
            $medicineMargins[$key]['total_revenue'] += $report->total_revenue;
            $medicineMargins[$key]['total_cost'] += $report->total_cost;
            $medicineMargins[$key]['total_profit'] += $report->total_profit;
        }

        // Calculate average margin
        foreach ($medicineMargins as &$item) {
            $item['average_margin'] = $item['total_revenue'] > 0
                ? round(($item['total_profit'] / $item['total_revenue']) * 100, 2)
                : 0;
        }

        // Sort by profit descending
        usort($medicineMargins, fn($a, $b) => $b['total_profit'] <=> $a['total_profit']);

        return [
            'period' => $period,
            'medicines' => array_slice($medicineMargins, 0, 50), // Top 50 medicines
            'highest_margin_medicine' => reset($medicineMargins),
        ];
    }

    /**
     * Generate internal financial report object
     */
    private function generateReport(string $tenantId, Carbon $startDate, Carbon $endDate, string $period): PharmacyFinancialReport
    {
        // Get sales data
        $salesData = DB::table('pharmacy_sales as ps')
            ->selectRaw('
                SUM(ps.subtotal) as total_sales,
                SUM(ps.discount_amount) as total_discount,
                SUM(ps.tax_amount) as total_tax,
                SUM(ps.total_amount) as net_sales,
                COUNT(DISTINCT ps.id) as total_transactions,
                SUM(psi.quantity_sold) as total_items_sold
            ')
            ->leftJoin('pharmacy_sales_items as psi', 'ps.id', '=', 'psi.sales_id')
            ->where('ps.tenant_id', $tenantId)
            ->where('ps.status', 'completed')
            ->whereBetween('ps.sales_date', [$startDate, $endDate])
            ->first();

        // Get COGS
        $cogs = $this->calculateCOGS($tenantId, $startDate, $endDate);

        // Calculate gross profit
        $grossProfit = ($salesData->net_sales ?? 0) - $cogs;
        $grossMarginPercentage = $salesData->net_sales > 0
            ? round(($grossProfit / $salesData->net_sales) * 100, 2)
            : 0;

        // Estimate operating expenses (simplified: 15% of sales)
        $operatingExpenses = ($salesData->net_sales ?? 0) * 0.15;

        // Calculate net profit
        $netProfit = $grossProfit - $operatingExpenses;
        $netMarginPercentage = $salesData->net_sales > 0
            ? round(($netProfit / $salesData->net_sales) * 100, 2)
            : 0;

        // Average transaction value
        $avgTransactionValue = ($salesData->total_transactions ?? 0) > 0
            ? ($salesData->net_sales ?? 0) / $salesData->total_transactions
            : 0;

        return PharmacyFinancialReport::create([
            'tenant_id' => $tenantId,
            'report_date' => $startDate->format('Y-m-d'),
            'report_period' => $period,
            'total_sales' => $salesData->total_sales ?? 0,
            'total_discount' => $salesData->total_discount ?? 0,
            'total_tax' => $salesData->total_tax ?? 0,
            'net_sales' => $salesData->net_sales ?? 0,
            'total_cost_of_goods_sold' => $cogs,
            'gross_profit' => $grossProfit,
            'gross_profit_percentage' => $grossMarginPercentage,
            'operating_expenses' => $operatingExpenses,
            'net_profit' => $netProfit,
            'net_profit_percentage' => $netMarginPercentage,
            'total_transactions' => $salesData->total_transactions ?? 0,
            'total_items_sold' => $salesData->total_items_sold ?? 0,
            'average_transaction_value' => $avgTransactionValue,
        ]);
    }

    /**
     * Calculate COGS (Cost of Goods Sold)
     */
    private function calculateCOGS(string $tenantId, Carbon $startDate, Carbon $endDate): float
    {
        return DB::table('pharmacy_sales_items as psi')
            ->join('pharmacy_sales as ps', 'psi.sales_id', '=', 'ps.id')
            ->where('ps.tenant_id', $tenantId)
            ->where('ps.status', 'completed')
            ->whereBetween('ps.sales_date', [$startDate, $endDate])
            ->selectRaw('SUM(psi.quantity_sold * psi.unit_price) as total_cost')
            ->first()
            ->total_cost ?? 0;
    }
}
