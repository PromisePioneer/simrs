<?php

declare(strict_types=1);

namespace Domains\Accounting\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Tenant\TenantContext;
use Domains\Accounting\Infrastructure\Persistence\Models\AccountCategoryModel;
use Domains\Accounting\Infrastructure\Persistence\Models\AccountModel;
use Domains\Accounting\Infrastructure\Persistence\Models\AccountTransactionModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    // ─── Helper: hitung saldo akun dalam rentang tanggal ──────────────────────
    private function accountBalance(AccountModel $account, ?string $dateFrom, ?string $dateTo): array
    {
        $q = $account->transactions();
        if ($dateFrom) $q->whereDate('transaction_date', '>=', $dateFrom);
        if ($dateTo)   $q->whereDate('transaction_date', '<=', $dateTo);

        $debit  = (float) (clone $q)->where('type', 'debit')->sum('amount');
        $credit = (float) (clone $q)->where('type', 'credit')->sum('amount');

        $normalBalance = $account->accountCategory->normal_balance ?? 'debit';
        $balance       = $normalBalance === 'debit' ? $debit - $credit : $credit - $debit;

        return compact('debit', 'credit', 'balance', 'normalBalance');
    }

    // ─── Helper: saldo sebelum tanggal (untuk saldo awal buku besar) ──────────
    private function balanceBefore(AccountModel $account, string $dateFrom): float
    {
        $q      = $account->transactions()->whereDate('transaction_date', '<', $dateFrom);
        $debit  = (float) (clone $q)->where('type', 'debit')->sum('amount');
        $credit = (float) (clone $q)->where('type', 'credit')->sum('amount');

        $normalBalance = $account->accountCategory->normal_balance ?? 'debit';
        return $normalBalance === 'debit' ? $debit - $credit : $credit - $debit;
    }

    /**
     * GET /api/v1/accounting/reports/trial-balance
     * Neraca Saldo — semua akun dengan saldo normal.
     */
    public function trialBalance(Request $request): JsonResponse
    {
        $dateFrom = $request->date_from;
        $dateTo   = $request->date_to;

        $accounts = AccountModel::with('accountCategory')
            ->where('is_active', true)
            ->orderBy('code')
            ->get();

        $rows         = [];
        $totalDebit   = 0;
        $totalCredit  = 0;

        foreach ($accounts as $account) {
            $b = $this->accountBalance($account, $dateFrom, $dateTo);

            // Skip akun yang sama sekali tidak punya transaksi
            if ($b['debit'] == 0 && $b['credit'] == 0) continue;

            $rows[] = [
                'id'             => $account->id,
                'code'           => $account->code,
                'name'           => $account->name,
                'category'       => $account->accountCategory->name,
                'normal_balance' => $b['normalBalance'],
                'debit'          => $b['debit'],
                'credit'         => $b['credit'],
                'balance'        => $b['balance'],
            ];

            if ($b['normalBalance'] === 'debit') {
                $totalDebit += $b['balance'] > 0 ? $b['balance'] : 0;
            } else {
                $totalCredit += $b['balance'] > 0 ? $b['balance'] : 0;
            }
        }

        return response()->json([
            'data' => [
                'period'       => ['from' => $dateFrom, 'to' => $dateTo],
                'rows'         => $rows,
                'total_debit'  => $totalDebit,
                'total_credit' => $totalCredit,
                'is_balanced'  => abs($totalDebit - $totalCredit) < 0.01,
            ],
        ]);
    }

    /**
     * GET /api/v1/accounting/reports/balance-sheet
     * Neraca (Balance Sheet) — Aset = Kewajiban + Ekuitas.
     */
    public function balanceSheet(Request $request): JsonResponse
    {
        $dateTo = $request->date_to ?? now()->toDateString();

        $categories = AccountCategoryModel::with(['accounts' => function ($q) {
            $q->where('is_active', true)->orderBy('code');
        }])->get()->keyBy('name');

        $buildSection = function (string $catName) use ($categories, $dateTo): array {
            $cat      = $categories->get($catName);
            if (!$cat) return ['accounts' => [], 'total' => 0];

            $accounts = [];
            $total    = 0;

            foreach ($cat->accounts as $account) {
                $b = $this->accountBalance($account, null, $dateTo);
                if ($b['balance'] == 0) continue;
                $accounts[] = [
                    'id'      => $account->id,
                    'code'    => $account->code,
                    'name'    => $account->name,
                    'balance' => $b['balance'],
                ];
                $total += $b['balance'];
            }

            return compact('accounts', 'total');
        };

        $aset       = $buildSection('Aset');
        $kewajiban  = $buildSection('Kewajiban');
        $ekuitas    = $buildSection('Ekuitas');

        // Laba berjalan (dari Pendapatan - Beban) masuk ke ekuitas
        $pendapatanCat = $categories->get('Pendapatan');
        $bebanCat      = $categories->get('Beban');
        $netIncome     = 0;

        if ($pendapatanCat) {
            foreach ($pendapatanCat->accounts as $a) {
                $netIncome += $this->accountBalance($a, null, $dateTo)['balance'];
            }
        }
        if ($bebanCat) {
            foreach ($bebanCat->accounts as $a) {
                $netIncome -= $this->accountBalance($a, null, $dateTo)['balance'];
            }
        }

        $totalEkuitas = $ekuitas['total'] + $netIncome;

        return response()->json([
            'data' => [
                'as_of'      => $dateTo,
                'aset'       => $aset,
                'kewajiban'  => $kewajiban,
                'ekuitas'    => [
                    'accounts'   => $ekuitas['accounts'],
                    'net_income' => $netIncome,
                    'total'      => $totalEkuitas,
                ],
                'total_aset'            => $aset['total'],
                'total_kewajiban_ekuitas' => $kewajiban['total'] + $totalEkuitas,
                'is_balanced'           => abs($aset['total'] - ($kewajiban['total'] + $totalEkuitas)) < 1,
            ],
        ]);
    }

    /**
     * GET /api/v1/accounting/reports/cash-flow
     * Laporan Arus Kas — operasional, investasi, pendanaan.
     */
    public function cashFlow(Request $request): JsonResponse
    {
        $dateFrom = $request->date_from ?? now()->startOfMonth()->toDateString();
        $dateTo   = $request->date_to   ?? now()->toDateString();

        // Ambil semua transaksi kas/bank dalam periode
        $kasAccounts = AccountModel::with('accountCategory')
            ->where('is_active', true)
            ->whereIn('code', ['1-100', '1-110', '1-120'])   // Kas & Bank
            ->get();

        // Hitung saldo awal & akhir kas
        $saldoAwalKas  = 0;
        $saldoAkhirKas = 0;
        foreach ($kasAccounts as $a) {
            $saldoAwalKas  += $this->balanceBefore($a, $dateFrom);
            $saldoAkhirKas += $this->accountBalance($a, null, $dateTo)['balance'];
        }

        // Ambil semua transaksi dalam periode untuk klasifikasi
        $transactions = AccountTransactionModel::with('account.accountCategory')
            ->whereDate('transaction_date', '>=', $dateFrom)
            ->whereDate('transaction_date', '<=', $dateTo)
            ->orderBy('transaction_date')
            ->get();

        // Klasifikasi arus kas berdasarkan kategori akun lawan
        $operasional = ['inflow' => [], 'outflow' => []];
        $investasi   = ['inflow' => [], 'outflow' => []];
        $pendanaan   = ['inflow' => [], 'outflow' => []];

        $kasCodeSet = $kasAccounts->pluck('code')->toArray();

        // Group by reference untuk identifikasi pasangan debit-credit
        $byRef = $transactions->groupBy('reference');

        foreach ($byRef as $ref => $group) {
            $kasEntries    = $group->filter(fn($t) => in_array($t->account?->code, $kasCodeSet));
            $nonKasEntries = $group->filter(fn($t) => !in_array($t->account?->code, $kasCodeSet));

            if ($kasEntries->isEmpty()) continue;

            $kasDebit  = $kasEntries->where('type', 'debit')->sum('amount');
            $kasCredit = $kasEntries->where('type', 'credit')->sum('amount');
            $netKas    = $kasDebit - $kasCredit;

            // Tentukan klasifikasi dari akun lawan
            $lawan    = $nonKasEntries->first();
            $catName  = $lawan?->account?->accountCategory?->name ?? '';
            $accCode  = $lawan?->account?->code ?? '';
            $accName  = $lawan?->account?->name ?? $ref;

            $row = [
                'reference'  => $ref,
                'date'       => $group->first()->transaction_date?->toDateString(),
                'account'    => $accName,
                'amount'     => abs($netKas),
            ];

            // Klasifikasi
            $isInvestasi = in_array(substr($accCode, 0, 3), ['1-6', '1-7']); // Peralatan, Akumulasi
            $isPendanaan = in_array(substr($accCode, 0, 3), ['2-5', '3-1']);  // Hutang Bank, Modal

            if ($isInvestasi) {
                $netKas > 0
                    ? $investasi['inflow'][]  = $row
                    : $investasi['outflow'][] = $row;
            } elseif ($isPendanaan) {
                $netKas > 0
                    ? $pendanaan['inflow'][]  = $row
                    : $pendanaan['outflow'][] = $row;
            } else {
                $netKas > 0
                    ? $operasional['inflow'][]  = $row
                    : $operasional['outflow'][] = $row;
            }
        }

        $sumSection = function (array $section): array {
            $in  = collect($section['inflow'])->sum('amount');
            $out = collect($section['outflow'])->sum('amount');
            return array_merge($section, [
                'total_inflow'  => $in,
                'total_outflow' => $out,
                'net'           => $in - $out,
            ]);
        };

        $op  = $sumSection($operasional);
        $inv = $sumSection($investasi);
        $pen = $sumSection($pendanaan);

        $netChange = $op['net'] + $inv['net'] + $pen['net'];

        return response()->json([
            'data' => [
                'period'          => ['from' => $dateFrom, 'to' => $dateTo],
                'saldo_awal_kas'  => $saldoAwalKas,
                'operasional'     => $op,
                'investasi'       => $inv,
                'pendanaan'       => $pen,
                'net_change'      => $netChange,
                'saldo_akhir_kas' => $saldoAwalKas + $netChange,
            ],
        ]);
    }

    /**
     * GET /api/v1/accounting/reports/ledger?account_id=xxx
     * Buku Besar — riwayat transaksi per akun dengan running balance.
     */
    public function ledger(Request $request): JsonResponse
    {
        $dateFrom  = $request->date_from ?? now()->startOfMonth()->toDateString();
        $dateTo    = $request->date_to   ?? now()->toDateString();
        $accountId = $request->account_id;

        $query = AccountModel::with('accountCategory')
            ->where('is_active', true)
            ->orderBy('code');

        if ($accountId) {
            $query->where('id', $accountId);
        }

        $accounts = $query->get();
        $result   = [];

        foreach ($accounts as $account) {
            $transactions = $account->transactions()
                ->whereDate('transaction_date', '>=', $dateFrom)
                ->whereDate('transaction_date', '<=', $dateTo)
                ->orderBy('transaction_date')
                ->orderBy('created_at')
                ->get();

            if ($transactions->isEmpty() && !$accountId) continue;

            $normalBalance  = $account->accountCategory->normal_balance ?? 'debit';
            $saldoAwal      = $this->balanceBefore($account, $dateFrom);
            $runningBalance = $saldoAwal;

            $rows = [];
            foreach ($transactions as $tx) {
                if ($normalBalance === 'debit') {
                    $runningBalance += $tx->type === 'debit' ? $tx->amount : -$tx->amount;
                } else {
                    $runningBalance += $tx->type === 'credit' ? $tx->amount : -$tx->amount;
                }

                $rows[] = [
                    'id'              => $tx->id,
                    'date'            => $tx->transaction_date?->toDateString(),
                    'reference'       => $tx->reference,
                    'description'     => $tx->description,
                    'debit'           => $tx->type === 'debit'  ? (float) $tx->amount : 0,
                    'credit'          => $tx->type === 'credit' ? (float) $tx->amount : 0,
                    'running_balance' => $runningBalance,
                ];
            }

            $totalDebit  = collect($rows)->sum('debit');
            $totalCredit = collect($rows)->sum('credit');

            $result[] = [
                'account' => [
                    'id'             => $account->id,
                    'code'           => $account->code,
                    'name'           => $account->name,
                    'category'       => $account->accountCategory->name,
                    'normal_balance' => $normalBalance,
                ],
                'saldo_awal'   => $saldoAwal,
                'saldo_akhir'  => $runningBalance,
                'total_debit'  => $totalDebit,
                'total_credit' => $totalCredit,
                'transactions' => $rows,
            ];
        }

        return response()->json([
            'data' => [
                'period'   => ['from' => $dateFrom, 'to' => $dateTo],
                'accounts' => $result,
            ],
        ]);
    }

    /**
     * GET /api/v1/accounting/reports/income-statement
     * Laporan Laba Rugi.
     */
    public function incomeStatement(Request $request): JsonResponse
    {
        $dateFrom = $request->date_from ?? now()->startOfMonth()->toDateString();
        $dateTo   = $request->date_to   ?? now()->toDateString();

        $categories = AccountCategoryModel::with(['accounts' => function ($q) {
            $q->where('is_active', true)->orderBy('code');
        }])->whereIn('name', ['Pendapatan', 'Beban'])->get()->keyBy('name');

        $buildSection = function (string $catName) use ($categories, $dateFrom, $dateTo): array {
            $cat = $categories->get($catName);
            if (!$cat) return ['accounts' => [], 'total' => 0];

            $accounts = [];
            $total    = 0;
            foreach ($cat->accounts as $account) {
                $b = $this->accountBalance($account, $dateFrom, $dateTo);
                $accounts[] = [
                    'id'      => $account->id,
                    'code'    => $account->code,
                    'name'    => $account->name,
                    'balance' => $b['balance'],
                ];
                $total += $b['balance'];
            }
            return compact('accounts', 'total');
        };

        $pendapatan = $buildSection('Pendapatan');
        $beban      = $buildSection('Beban');
        $netIncome  = $pendapatan['total'] - $beban['total'];

        return response()->json([
            'data' => [
                'period'         => ['from' => $dateFrom, 'to' => $dateTo],
                'pendapatan'     => $pendapatan,
                'beban'          => $beban,
                'total_pendapatan' => $pendapatan['total'],
                'total_beban'    => $beban['total'],
                'net_income'     => $netIncome,
            ],
        ]);
    }
}
