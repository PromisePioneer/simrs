<?php

declare(strict_types=1);

namespace Domains\Accounting\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Tenant\TenantContext;
use App\Traits\ApiResponse;
use Domains\Accounting\Infrastructure\Persistence\Models\AccountModel;
use Domains\Accounting\Infrastructure\Persistence\Models\AccountTransactionModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JournalEntryController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/v1/accounting/journal
     * Daftar semua transaksi jurnal dengan filter.
     */
    public function index(Request $request): JsonResponse
    {
        // TenantScope sudah otomatis filter by tenant_id via BaseTenantModel
        // Tidak perlu ->where('tenant_id', ...) manual — itu justru bikin double filter
        // yang konflik saat user switch tenant (session tenant_id != user->tenant_id)
        $query = AccountTransactionModel::with('account.accountCategory')
            ->when($request->account_id, fn($q) => $q->where('account_id', $request->account_id))
            ->when($request->type,       fn($q) => $q->where('type', $request->type))
            ->when($request->date_from,  fn($q) => $q->whereDate('transaction_date', '>=', $request->date_from))
            ->when($request->date_to,    fn($q) => $q->whereDate('transaction_date', '<=', $request->date_to))
            ->when($request->reference,  fn($q) => $q->where('reference', 'like', "%{$request->reference}%"))
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc');

        $transactions = $query->paginate($request->integer('per_page', 20));

        return response()->json($transactions);
    }

    /**
     * POST /api/v1/accounting/journal
     * Entry jurnal manual (debit & credit harus balance).
     */
    public function store(Request $request): JsonResponse
    {
        // Ambil tenant_id dari TenantContext (baca session dulu, fallback ke user->tenant_id)
        $tenantId = TenantContext::getId();

        $request->validate([
            'entries'               => ['required', 'array', 'min:2'],
            'entries.*.account_id'  => ['required', 'uuid', 'exists:accounts,id'],
            'entries.*.type'        => ['required', 'in:debit,credit'],
            'entries.*.amount'      => ['required', 'numeric', 'min:0.01'],
            'entries.*.description' => ['nullable', 'string'],
            'transaction_date'      => ['nullable', 'date'],
            'reference'             => ['nullable', 'string', 'max:100'],
        ]);

        $entries     = $request->entries;
        $totalDebit  = collect($entries)->where('type', 'debit')->sum('amount');
        $totalCredit = collect($entries)->where('type', 'credit')->sum('amount');

        if (abs($totalDebit - $totalCredit) > 0.01) {
            return $this->errorResponse(
                "Jurnal tidak balance. Debit: {$totalDebit}, Kredit: {$totalCredit}",
                422
            );
        }

        $txDate    = $request->transaction_date ?? now()->toDateString();
        $reference = $request->reference ?? 'MANUAL-' . now()->format('YmdHis');
        $created   = [];

        foreach ($entries as $entry) {
            $created[] = AccountTransactionModel::create([
                'tenant_id'        => $tenantId,
                'account_id'       => $entry['account_id'],
                'type'             => $entry['type'],
                'amount'           => $entry['amount'],
                'description'      => $entry['description'] ?? null,
                'reference'        => $reference,
                'transaction_date' => $txDate,
            ]);
        }

        return response()->json(['data' => $created], 201);
    }

    /**
     * GET /api/v1/accounting/journal/summary
     * Ringkasan saldo per akun (untuk neraca & laba-rugi).
     */
    public function summary(Request $request): JsonResponse
    {
        // TenantScope handle filter tenant otomatis
        $accounts = AccountModel::with('accountCategory')
            ->where('is_active', true)
            ->get()
            ->map(function (AccountModel $account) use ($request) {
                $query = $account->transactions()
                    ->when($request->date_from, fn($q) => $q->whereDate('transaction_date', '>=', $request->date_from))
                    ->when($request->date_to,   fn($q) => $q->whereDate('transaction_date', '<=', $request->date_to));

                $totalDebit  = (float) (clone $query)->where('type', 'debit')->sum('amount');
                $totalCredit = (float) (clone $query)->where('type', 'credit')->sum('amount');

                $normalBalance = $account->accountCategory->normal_balance ?? 'debit';
                $balance       = $normalBalance === 'debit'
                    ? $totalDebit - $totalCredit
                    : $totalCredit - $totalDebit;

                return [
                    'id'             => $account->id,
                    'code'           => $account->code,
                    'name'           => $account->name,
                    'category'       => $account->accountCategory->name,
                    'normal_balance' => $normalBalance,
                    'total_debit'    => $totalDebit,
                    'total_credit'   => $totalCredit,
                    'balance'        => $balance,
                ];
            });

        return response()->json(['data' => $accounts]);
    }

    /**
     * GET /api/v1/accounting/journal/income-statement
     * Laporan laba rugi (Pendapatan - Beban).
     */
    public function incomeStatement(Request $request): JsonResponse
    {
        $dateFrom = $request->date_from ?? now()->startOfMonth()->toDateString();
        $dateTo   = $request->date_to   ?? now()->toDateString();

        // TenantScope handle filter tenant otomatis
        $accounts = AccountModel::with('accountCategory')
            ->whereHas('accountCategory', fn($q) => $q->whereIn('name', ['Pendapatan', 'Beban']))
            ->get();

        $revenues     = [];
        $expenses     = [];
        $totalRevenue = 0;
        $totalExpense = 0;

        foreach ($accounts as $account) {
            $debit  = (float) $account->transactions()
                ->whereDate('transaction_date', '>=', $dateFrom)
                ->whereDate('transaction_date', '<=', $dateTo)
                ->where('type', 'debit')->sum('amount');

            $credit = (float) $account->transactions()
                ->whereDate('transaction_date', '>=', $dateFrom)
                ->whereDate('transaction_date', '<=', $dateTo)
                ->where('type', 'credit')->sum('amount');

            $row = [
                'code'    => $account->code,
                'name'    => $account->name,
                'balance' => 0,
            ];

            if ($account->accountCategory->name === 'Pendapatan') {
                $row['balance'] = $credit - $debit;
                $totalRevenue  += $row['balance'];
                $revenues[]     = $row;
            } else {
                $row['balance'] = $debit - $credit;
                $totalExpense  += $row['balance'];
                $expenses[]     = $row;
            }
        }

        return response()->json([
            'data' => [
                'period'        => ['from' => $dateFrom, 'to' => $dateTo],
                'revenues'      => $revenues,
                'expenses'      => $expenses,
                'total_revenue' => $totalRevenue,
                'total_expense' => $totalExpense,
                'net_income'    => $totalRevenue - $totalExpense,
            ],
        ]);
    }
}
