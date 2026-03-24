import {useEffect, useState} from "react";
import Layout from "@/pages/dashboard/layout.jsx";
import {useAccountingStore} from "@/store/accountingStore.js";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {TableCell, TableRow} from "@/components/ui/table.jsx";
import {PermissionTabs} from "@/components/common/tabs.jsx";
import {
    BookOpen, Plus, Pencil, Trash2, CircleEllipsis,
    TrendingUp, FileText, ArrowLeftRight, Scale, LayoutList, ShieldAlert,
    ChevronRight, Layers,
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import {usePermission} from "@/hooks/usePermission.js";
import {Route} from "@/routes/_protected/accounting/index.jsx";
import {PERMISSIONS} from "@/constants/permissions.js";

// ─── Tab: Chart of Accounts ──────────────────────────────────────────────────
function AccountsTab() {
    const {
        accounts, isLoading, accountSearch, setAccountSearch,
        accountCurrentPage, setAccountCurrentPage,
        accountValue, openAccountModal, setOpenAccountModal,
        openAccountDeleteModal, setOpenAccountDeleteModal,
        fetchAccounts, createAccount, updateAccount, deleteAccount,
        accountCategories, fetchAccountCategories,
    } = useAccountingStore();

    const [form, setForm] = useState({code: "", name: "", account_category_id: "", parent_id: ""});
    const isEdit = !!accountValue?.id;

    useEffect(() => {
        fetchAccounts({perPage: 20});
    }, [accountCurrentPage, accountSearch]);
    useEffect(() => {
        fetchAccountCategories();
    }, []);
    useEffect(() => {
        if (accountValue) {
            setForm({
                code: accountValue.code ?? "",
                name: accountValue.name ?? "",
                account_category_id: accountValue.account_category_id ?? "",
                parent_id: accountValue.parent_id ?? "",
            });
        } else {
            setForm({code: "", name: "", account_category_id: "", parent_id: ""});
        }
    }, [accountValue]);

    const handleSubmit = async () => {
        if (isEdit) await updateAccount(accountValue.id, form);
        else await createAccount(form);
    };

    const columns = [
        {key: "no", label: "No", width: "5%"},
        {key: "code", label: "Kode", width: "12%"},
        {key: "name", label: "Nama Akun"},
        {key: "category", label: "Kategori", width: "20%"},
        {key: "actions", label: "Aksi", width: "10%", align: "right"},
    ];

    const renderRow = (account, index) => (
        <TableRow key={account.id} className="hover:bg-muted/50">
            <TableCell className="text-muted-foreground">{(accounts?.from ?? 0) + index}</TableCell>
            <TableCell><span className="font-mono text-sm">{account.code}</span></TableCell>
            <TableCell>
                <div>
                    <p className="font-medium">{account.name}</p>
                    {account.children?.length > 0 && (
                        <p className="text-xs text-muted-foreground">{account.children.length} sub-akun</p>
                    )}
                </div>
            </TableCell>
            <TableCell>{account.account_category?.name ?? "-"}</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm"><CircleEllipsis className="w-4 h-4"/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => setOpenAccountModal(account.id)}>
                                Edit <DropdownMenuShortcut><Pencil className="w-3 h-3"/></DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenAccountDeleteModal(account.id)}
                                              className="text-destructive focus:text-destructive">
                                Hapus <DropdownMenuShortcut><Trash2 className="w-3 h-3"/></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );

    return (
        <>
            <div className="flex justify-between items-center pb-2">
                <div>
                    <h3 className="text-lg font-semibold">Chart of Accounts</h3>
                    <p className="text-sm text-muted-foreground">Kelola daftar akun keuangan</p>
                </div>
                <Button onClick={() => setOpenAccountModal()} size="sm">
                    <Plus className="w-4 h-4 mr-1"/> Tambah Akun
                </Button>
            </div>

            <DataTable
                columns={columns} data={accounts?.data ?? []} isLoading={isLoading}
                pagination={accounts ? {
                    from: accounts.from, to: accounts.to, total: accounts.total,
                    current_page: accounts.current_page, last_page: accounts.last_page,
                } : null}
                onPageChange={setAccountCurrentPage} currentPage={accountCurrentPage}
                onSearch={setAccountSearch} search={accountSearch}
                searchPlaceholder="Cari kode atau nama akun..."
                emptyStateIcon={BookOpen} emptyStateText="Belum ada akun"
                renderRow={renderRow} showSearch
            />

            {/* Modal Tambah/Edit */}
            <Modal open={openAccountModal} onOpenChange={setOpenAccountModal}
                   title={isEdit ? "Edit Akun" : "Tambah Akun"} onSubmit={handleSubmit}
                   submitText={isEdit ? "Simpan" : "Tambah"} size="lg">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Kode Akun</Label>
                        <Input value={form.code} onChange={e => setForm({...form, code: e.target.value})}
                               placeholder="mis. 1-100" className="mt-1"/>
                    </div>
                    <div>
                        <Label>Nama Akun</Label>
                        <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                               placeholder="mis. Kas Klinik" className="mt-1"/>
                    </div>
                    <div className="col-span-2">
                        <Label>Kategori Akun</Label>
                        <Select value={form.account_category_id}
                                onValueChange={v => setForm({...form, account_category_id: v})}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih kategori"/></SelectTrigger>
                            <SelectContent>
                                {(Array.isArray(accountCategories) ? accountCategories : accountCategories?.data ?? [])
                                    .map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Modal>

            {/* Modal Hapus */}
            <Modal open={openAccountDeleteModal} onOpenChange={setOpenAccountDeleteModal}
                   title="Hapus Akun" type="danger"
                   onSubmit={() => deleteAccount(accountValue?.id)} submitText="Hapus">
                <p className="text-sm">Yakin ingin menghapus akun <strong>{accountValue?.name}</strong>?</p>
            </Modal>
        </>
    );
}

// ─── Tab: Jurnal Entri ────────────────────────────────────────────────────────
// ─── Tab: Jurnal Entri ────────────────────────────────────────────────────────
function JournalTab() {
    const {
        journalEntries, journalLoading, journalFilters, journalCurrentPage,
        setJournalFilters, setJournalCurrentPage, fetchJournalEntries,
        createJournalEntry, accounts, fetchAccounts,
    } = useAccountingStore();

    const [showForm, setShowForm]   = useState(false);
    const [expanded, setExpanded]   = useState(new Set());
    const [entries, setEntries]     = useState([
        {account_id: "", type: "debit",  amount: "", description: ""},
        {account_id: "", type: "credit", amount: "", description: ""},
    ]);
    const [txDate, setTxDate]       = useState(new Date().toISOString().split("T")[0]);
    const [reference, setReference] = useState("");

    const {date_from, date_to, account_id, type: filterType} = journalFilters;
    useEffect(() => { fetchJournalEntries({perPage: 20}); }, [journalCurrentPage, date_from, date_to, account_id, filterType]);
    useEffect(() => { fetchAccounts({perPage: 200}); }, []);

    const flatAccounts = Array.isArray(accounts)
        ? accounts
        : (accounts?.data ?? []).flatMap(a => [a, ...(a.children ?? [])]);

    // Group transaksi by reference → satu baris = satu jurnal
    const groupedJournals = (() => {
        const rows = journalEntries?.data ?? [];
        const map  = new Map();
        rows.forEach(tx => {
            const key = tx.reference ?? tx.id;
            if (!map.has(key)) {
                map.set(key, {reference: key, transaction_date: tx.transaction_date, entries: []});
            }
            map.get(key).entries.push(tx);
        });
        return Array.from(map.values());
    })();

    const toggleExpand = (ref) => setExpanded(prev => {
        const next = new Set(prev);
        next.has(ref) ? next.delete(ref) : next.add(ref);
        return next;
    });

    const addEntry    = () => setEntries([...entries, {account_id: "", type: "debit", amount: "", description: ""}]);
    const removeEntry = (i) => setEntries(entries.filter((_, idx) => idx !== i));
    const updateEntry = (i, field, val) => {
        const updated = [...entries];
        updated[i] = {...updated[i], [field]: val};
        setEntries(updated);
    };

    const totalDebit  = entries.filter(e => e.type === "debit").reduce((s, e)  => s + (parseFloat(e.amount) || 0), 0);
    const totalCredit = entries.filter(e => e.type === "credit").reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    const isBalanced  = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

    const handleSave = async () => {
        const ok = await createJournalEntry({entries, transaction_date: txDate, reference});
        if (ok) {
            setShowForm(false);
            setEntries([
                {account_id: "", type: "debit",  amount: "", description: ""},
                {account_id: "", type: "credit", amount: "", description: ""},
            ]);
            setReference("");
        }
    };

    const fmtDate   = (d) => d ? new Date(d).toLocaleDateString("id-ID", {day: "2-digit", month: "short", year: "numeric"}) : "-";
    const fmtAmount = (n) => "Rp " + Number(n).toLocaleString("id-ID");

    const columns = [
        {key: "expand",  label: "",              width: "4%"},
        {key: "date",    label: "Tanggal",       width: "14%"},
        {key: "ref",     label: "Referensi",     width: "24%"},
        {key: "entries", label: "Entri",         width: "12%"},
        {key: "debit",   label: "Total Debit",   width: "16%"},
        {key: "credit",  label: "Total Kredit",  width: "16%"},
        {key: "status",  label: "Status",        width: "14%"},
    ];

    const renderRow = (journal, index) => {
        const isOpen    = expanded.has(journal.reference);
        const totalD    = journal.entries.filter(e => e.type === "debit").reduce((s, e)  => s + Number(e.amount), 0);
        const totalC    = journal.entries.filter(e => e.type === "credit").reduce((s, e) => s + Number(e.amount), 0);
        const balanced  = Math.abs(totalD - totalC) < 0.01;
        const isOpening = journal.reference === "OPENING-BALANCE";
        const isManual  = journal.reference?.startsWith("MANUAL-");

        return (
            <>
                <TableRow
                    key={journal.reference}
                    className="hover:bg-muted/30 transition-colors cursor-pointer select-none"
                    onClick={() => toggleExpand(journal.reference)}
                >
                    <TableCell className="w-8 pl-4">
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200"
                                      style={{transform: isOpen ? "rotate(90deg)" : "rotate(0deg)"}}/>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                        {fmtDate(journal.transaction_date)}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
                                <FileText className="w-3.5 h-3.5 text-teal-600"/>
                            </div>
                            <div>
                                <p className="font-mono text-xs font-medium">{journal.reference}</p>
                                <p className="text-[10px] text-muted-foreground">
                                    {isOpening ? "Saldo Awal" : isManual ? "Jurnal Manual" : "Jurnal Otomatis"}
                                </p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="gap-1 font-normal text-xs">
                            <ArrowLeftRight className="w-3 h-3"/>
                            {journal.entries.length} entri
                        </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm text-rose-600">{fmtAmount(totalD)}</TableCell>
                    <TableCell className="font-medium text-sm text-teal-600">{fmtAmount(totalC)}</TableCell>
                    <TableCell>
                        <Badge variant={balanced ? "default" : "destructive"}
                               className={balanced ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400" : ""}>
                            {balanced ? "✓ Balance" : "✗ Tidak Balance"}
                        </Badge>
                    </TableCell>
                </TableRow>

                {/* Detail expand */}
                <TableRow key={`${journal.reference}-detail`}>
                    <TableCell colSpan={7} className="!p-0 border-0">
                        <div style={{
                            display: "grid",
                            gridTemplateRows: isOpen ? "1fr" : "0fr",
                            transition: "grid-template-rows 0.25s cubic-bezier(0.4,0,0.2,1)",
                        }}>
                            <div style={{overflow: "hidden"}}>
                                <div style={{
                                    opacity: isOpen ? 1 : 0,
                                    transition: "opacity 0.2s ease",
                                    transitionDelay: isOpen ? "0.05s" : "0s",
                                }}>
                                    <div className="py-3 pl-10 pr-6 bg-muted/20 border-b">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Layers className="w-3.5 h-3.5 text-muted-foreground"/>
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Detail Entri — {journal.reference}
                                            </span>
                                        </div>
                                        <div className="rounded-lg border bg-background overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead>
                                                <tr className="border-b bg-muted/40">
                                                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-[35%]">Akun</th>
                                                    <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground w-[30%]">Keterangan</th>
                                                    <th className="text-right px-4 py-2 text-xs font-medium text-rose-500 w-[17%]">Debit</th>
                                                    <th className="text-right px-4 py-2 text-xs font-medium text-teal-600 w-[18%]">Kredit</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {journal.entries.map((entry, i) => (
                                                    <tr key={entry.id} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                                                        <td className="px-4 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${entry.type === "debit" ? "bg-rose-400" : "bg-teal-400"}`}/>
                                                                <div>
                                                                    <p className="font-medium text-xs">{entry.account?.name ?? "-"}</p>
                                                                    <p className="text-[10px] text-muted-foreground font-mono">{entry.account?.code ?? ""}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                                                            {entry.description || <span className="italic opacity-40">—</span>}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-right font-medium text-xs text-rose-600">
                                                            {entry.type === "debit" ? fmtAmount(entry.amount) : ""}
                                                        </td>
                                                        <td className="px-4 py-2.5 text-right font-medium text-xs text-teal-600">
                                                            {entry.type === "credit" ? fmtAmount(entry.amount) : ""}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                                <tfoot>
                                                <tr className="border-t bg-muted/40">
                                                    <td colSpan={2} className="px-4 py-2 text-xs font-semibold text-muted-foreground">Total</td>
                                                    <td className="px-4 py-2 text-right font-bold text-xs text-rose-600">{fmtAmount(totalD)}</td>
                                                    <td className="px-4 py-2 text-right font-bold text-xs text-teal-600">{fmtAmount(totalC)}</td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    return (
        <>
            <div className="flex justify-between items-center pb-2">
                <div>
                    <h3 className="text-lg font-semibold">Jurnal Entri</h3>
                    <p className="text-sm text-muted-foreground">Catatan transaksi keuangan double-entry</p>
                </div>
                <Button onClick={() => setShowForm(true)} size="sm"
                        className="gap-1.5 bg-teal-600 hover:bg-teal-700 text-white">
                    <Plus className="w-4 h-4"/> Jurnal Manual
                </Button>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-3 mb-4 p-3 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">Dari</label>
                    <Input type="date" value={journalFilters.date_from}
                           onChange={e => setJournalFilters({date_from: e.target.value})}
                           className="h-8 w-36 text-xs"/>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">Sampai</label>
                    <Input type="date" value={journalFilters.date_to}
                           onChange={e => setJournalFilters({date_to: e.target.value})}
                           className="h-8 w-36 text-xs"/>
                </div>
                <Select value={journalFilters.type || "all"}
                        onValueChange={v => setJournalFilters({type: v === "all" ? "" : v})}>
                    <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Semua tipe"/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Tipe</SelectItem>
                        <SelectItem value="debit">Debit</SelectItem>
                        <SelectItem value="credit">Kredit</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => fetchJournalEntries()}>
                    Terapkan Filter
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground"
                        onClick={() => setJournalFilters({date_from: "", date_to: "", type: "", account_id: ""})}>
                    Reset
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={groupedJournals}
                isLoading={journalLoading}
                pagination={journalEntries ? {
                    from: journalEntries.from, to: journalEntries.to, total: journalEntries.total,
                    current_page: journalEntries.current_page, last_page: journalEntries.last_page,
                } : null}
                onPageChange={setJournalCurrentPage}
                currentPage={journalCurrentPage}
                emptyStateIcon={FileText}
                emptyStateText="Belum ada transaksi jurnal"
                renderRow={renderRow}
            />

            {/* Form Jurnal Manual */}
            <Modal open={showForm} onOpenChange={setShowForm} title="Buat Jurnal Manual"
                   onSubmit={handleSave} submitText="Simpan Jurnal" size="lg" isLoading={!isBalanced}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label className="text-sm">Tanggal Transaksi</Label>
                            <Input type="date" value={txDate} onChange={e => setTxDate(e.target.value)} className="mt-1"/>
                        </div>
                        <div>
                            <Label className="text-sm">Referensi <span className="text-muted-foreground font-normal">(opsional)</span></Label>
                            <Input value={reference} onChange={e => setReference(e.target.value)}
                                   placeholder="mis. INV-001" className="mt-1"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm">Entri Jurnal</Label>
                        <div className="rounded-lg border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="bg-muted/50 border-b">
                                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[35%]">Akun</th>
                                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[15%]">Tipe</th>
                                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[22%]">Jumlah</th>
                                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground w-[23%]">Keterangan</th>
                                    <th className="w-[5%]"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {entries.map((entry, i) => (
                                    <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                                        <td className="px-2 py-1.5">
                                            <Select value={entry.account_id} onValueChange={v => updateEntry(i, "account_id", v)}>
                                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Pilih akun"/></SelectTrigger>
                                                <SelectContent>
                                                    {flatAccounts.map(a => (
                                                        <SelectItem key={a.id} value={a.id} className="text-xs">
                                                            {a.code} — {a.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-2 py-1.5">
                                            <Select value={entry.type} onValueChange={v => updateEntry(i, "type", v)}>
                                                <SelectTrigger className="h-8 text-xs"><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="debit"><span className="text-rose-600 font-medium">Debit</span></SelectItem>
                                                    <SelectItem value="credit"><span className="text-teal-600 font-medium">Kredit</span></SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="px-2 py-1.5">
                                            <Input type="number" value={entry.amount}
                                                   onChange={e => updateEntry(i, "amount", e.target.value)}
                                                   placeholder="0" className="h-8 text-xs"/>
                                        </td>
                                        <td className="px-2 py-1.5">
                                            <Input value={entry.description}
                                                   onChange={e => updateEntry(i, "description", e.target.value)}
                                                   placeholder="Keterangan..." className="h-8 text-xs"/>
                                        </td>
                                        <td className="px-2 py-1.5 text-center">
                                            {entries.length > 2 && (
                                                <Button variant="ghost" size="sm" onClick={() => removeEntry(i)}
                                                        className="h-7 w-7 p-0 text-destructive hover:bg-red-50">
                                                    <Trash2 className="w-3 h-3"/>
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <Button variant="outline" size="sm" onClick={addEntry} className="w-full h-8 text-xs border-dashed">
                            <Plus className="w-3 h-3 mr-1"/> Tambah Baris
                        </Button>
                    </div>
                    <div className={`flex justify-between items-center text-sm p-3 rounded-lg border ${
                        isBalanced
                            ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400"
                            : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400"
                    }`}>
                        <span>Debit: <strong>{fmtAmount(totalDebit)}</strong></span>
                        <span>Kredit: <strong>{fmtAmount(totalCredit)}</strong></span>
                        <span className="font-semibold">
                            {isBalanced ? "✓ Balance" : totalDebit === 0 && totalCredit === 0 ? "Isi jumlah" : "✗ Tidak balance"}
                        </span>
                    </div>
                </div>
            </Modal>
        </>
    );
}

function ReportsTab() {
    const {
        reportFilters, setReportFilters,
        incomeStatement, trialBalance, balanceSheet, cashFlow, ledger,
        fetchIncomeStatement, fetchTrialBalance, fetchBalanceSheet, fetchCashFlow, fetchLedger,
        reportLoading,
        accounts, fetchAccounts,
    } = useAccountingStore();

    const [activeReport, setActiveReport] = useState("income-statement");
    const [ledgerAccountId, setLedgerAccountId] = useState("");

    useEffect(() => {
        fetchAccounts({perPage: 200});
    }, []);
    useEffect(() => {
        handleLoad();
    }, [activeReport]);

    const flatAccounts = Array.isArray(accounts)
        ? accounts
        : (accounts?.data ?? []).flatMap(a => [a, ...(a.children ?? [])]);

    const handleLoad = () => {
        const params = reportFilters;
        if (activeReport === "income-statement") fetchIncomeStatement(params);
        if (activeReport === "trial-balance") fetchTrialBalance(params);
        if (activeReport === "balance-sheet") fetchBalanceSheet(params);
        if (activeReport === "cash-flow") fetchCashFlow(params);
        if (activeReport === "ledger") fetchLedger({...params, account_id: ledgerAccountId});
    };

    const fmtRp = (n) => "Rp " + Number(n ?? 0).toLocaleString("id-ID");
    const fmtDate = (d) => d ? new Date(d).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }) : "-";

    const reportTypes = [
        {key: "income-statement", label: "Laba Rugi", icon: TrendingUp},
        {key: "trial-balance", label: "Neraca Saldo", icon: Scale},
        {key: "balance-sheet", label: "Neraca", icon: LayoutList},
        {key: "cash-flow", label: "Arus Kas", icon: ArrowLeftRight},
        {key: "ledger", label: "Buku Besar", icon: BookOpen},
    ];

    return (
        <div className="space-y-4">
            {/* Report type selector */}
            <div className="flex flex-wrap gap-2">
                {reportTypes.map(({key, label, icon: Icon}) => (
                    <button key={key} onClick={() => setActiveReport(key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                activeReport === key
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-background text-muted-foreground border-border hover:border-teal-400 hover:text-teal-600"
                            }`}>
                        <Icon className="w-3.5 h-3.5"/>
                        {label}
                    </button>
                ))}
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-3 items-end p-3 rounded-lg bg-muted/30 border">
                <div>
                    <label className="text-xs text-muted-foreground block mb-1">Dari</label>
                    <Input type="date" value={reportFilters.date_from}
                           onChange={e => setReportFilters({date_from: e.target.value})}
                           className="h-8 w-36 text-xs"/>
                </div>
                <div>
                    <label className="text-xs text-muted-foreground block mb-1">Sampai</label>
                    <Input type="date" value={reportFilters.date_to}
                           onChange={e => setReportFilters({date_to: e.target.value})}
                           className="h-8 w-36 text-xs"/>
                </div>
                {activeReport === "ledger" && (
                    <div>
                        <label className="text-xs text-muted-foreground block mb-1">Akun</label>
                        <Select value={ledgerAccountId || "all"}
                                onValueChange={v => setLedgerAccountId(v === "all" ? "" : v)}>
                            <SelectTrigger className="h-8 w-52 text-xs"><SelectValue
                                placeholder="Semua akun"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Akun</SelectItem>
                                {flatAccounts.map(a => (
                                    <SelectItem key={a.id} value={a.id} className="text-xs">
                                        {a.code} — {a.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <Button size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={handleLoad} disabled={reportLoading}>
                    {reportLoading ? "Memuat..." : "Tampilkan"}
                </Button>
            </div>

            {/* ── Laba Rugi ─────────────────────────────────────────────── */}
            {activeReport === "income-statement" && incomeStatement && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <TrendingUp className="w-4 h-4 text-teal-500"/>
                            Laporan Laba Rugi
                            <span className="ml-auto text-xs font-normal text-muted-foreground">
                                {fmtDate(incomeStatement.period?.from)} — {fmtDate(incomeStatement.period?.to)}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-2">Pendapatan</h4>
                                {incomeStatement.pendapatan?.accounts?.map(r => (
                                    <div key={r.code}
                                         className="flex justify-between text-sm py-1.5 border-b last:border-0">
                                        <span className="text-muted-foreground">{r.code} — {r.name}</span>
                                        <span className="font-medium text-teal-700">{fmtRp(r.balance)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold mt-2 pt-2 border-t-2 text-teal-700">
                                    <span>Total Pendapatan</span>
                                    <span>{fmtRp(incomeStatement.total_pendapatan)}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2">Beban</h4>
                                {incomeStatement.beban?.accounts?.map(e => (
                                    <div key={e.code}
                                         className="flex justify-between text-sm py-1.5 border-b last:border-0">
                                        <span className="text-muted-foreground">{e.code} — {e.name}</span>
                                        <span className="font-medium text-rose-700">{fmtRp(e.balance)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold mt-2 pt-2 border-t-2 text-rose-700">
                                    <span>Total Beban</span>
                                    <span>{fmtRp(incomeStatement.total_beban)}</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`mt-4 p-4 rounded-lg text-center ${incomeStatement.net_income >= 0 ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
                            <p className="text-xs text-muted-foreground mb-1">Laba / Rugi Bersih</p>
                            <p className={`text-2xl font-bold ${incomeStatement.net_income >= 0 ? "text-green-700" : "text-red-700"}`}>
                                {incomeStatement.net_income >= 0 ? "+" : ""}{fmtRp(incomeStatement.net_income)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Neraca Saldo ──────────────────────────────────────────── */}
            {activeReport === "trial-balance" && trialBalance && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Scale className="w-4 h-4 text-teal-500"/>
                            Neraca Saldo
                            <Badge variant={trialBalance.is_balanced ? "default" : "destructive"}
                                   className={`ml-auto text-xs ${trialBalance.is_balanced ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}`}>
                                {trialBalance.is_balanced ? "✓ Balance" : "✗ Tidak Balance"}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b bg-muted/40">
                                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Kode</th>
                                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Nama
                                    Akun
                                </th>
                                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Kategori</th>
                                <th className="text-right px-4 py-2.5 text-xs font-medium text-rose-500">Debit</th>
                                <th className="text-right px-4 py-2.5 text-xs font-medium text-teal-600">Kredit</th>
                                <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Saldo</th>
                            </tr>
                            </thead>
                            <tbody>
                            {trialBalance.rows?.map((r, i) => (
                                <tr key={r.id} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                                    <td className="px-4 py-2 font-mono text-xs">{r.code}</td>
                                    <td className="px-4 py-2 text-sm">{r.name}</td>
                                    <td className="px-4 py-2">
                                        <Badge variant="outline" className="text-xs font-normal">{r.category}</Badge>
                                    </td>
                                    <td className="px-4 py-2 text-right text-xs text-rose-600">{r.debit > 0 ? fmtRp(r.debit) : ""}</td>
                                    <td className="px-4 py-2 text-right text-xs text-teal-600">{r.credit > 0 ? fmtRp(r.credit) : ""}</td>
                                    <td className={`px-4 py-2 text-right text-xs font-semibold ${r.balance >= 0 ? "text-foreground" : "text-rose-600"}`}>
                                        {fmtRp(r.balance)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr className="border-t-2 bg-muted/40 font-bold">
                                <td colSpan={3} className="px-4 py-2.5 text-sm">Total</td>
                                <td className="px-4 py-2.5 text-right text-sm text-rose-600">{fmtRp(trialBalance.total_debit)}</td>
                                <td className="px-4 py-2.5 text-right text-sm text-teal-600">{fmtRp(trialBalance.total_credit)}</td>
                                <td className="px-4 py-2.5"></td>
                            </tr>
                            </tfoot>
                        </table>
                    </CardContent>
                </Card>
            )}

            {/* ── Neraca ────────────────────────────────────────────────── */}
            {activeReport === "balance-sheet" && balanceSheet && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <LayoutList className="w-4 h-4 text-teal-500"/>
                            Neraca
                            <span
                                className="ml-auto text-xs font-normal text-muted-foreground">per {fmtDate(balanceSheet.as_of)}</span>
                            <Badge variant={balanceSheet.is_balanced ? "default" : "destructive"}
                                   className={`text-xs ${balanceSheet.is_balanced ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}`}>
                                {balanceSheet.is_balanced ? "✓ Balance" : "✗ Tidak Balance"}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Aset */}
                            <div>
                                <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">Aset</h4>
                                {balanceSheet.aset?.accounts?.map(a => (
                                    <div key={a.id}
                                         className="flex justify-between text-sm py-1.5 border-b last:border-0">
                                        <span className="text-muted-foreground">{a.code} — {a.name}</span>
                                        <span className="font-medium">{fmtRp(a.balance)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-bold mt-2 pt-2 border-t-2 text-blue-700">
                                    <span>Total Aset</span>
                                    <span>{fmtRp(balanceSheet.total_aset)}</span>
                                </div>
                            </div>
                            {/* Kewajiban + Ekuitas */}
                            <div>
                                <h4 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-3">Kewajiban</h4>
                                {balanceSheet.kewajiban?.accounts?.map(a => (
                                    <div key={a.id}
                                         className="flex justify-between text-sm py-1.5 border-b last:border-0">
                                        <span className="text-muted-foreground">{a.code} — {a.name}</span>
                                        <span className="font-medium">{fmtRp(a.balance)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between font-semibold mt-2 pt-2 border-t text-orange-700">
                                    <span>Total Kewajiban</span>
                                    <span>{fmtRp(balanceSheet.kewajiban?.total)}</span>
                                </div>

                                <h4 className="text-xs font-semibold text-purple-700 uppercase tracking-wider mt-4 mb-3">Ekuitas</h4>
                                {balanceSheet.ekuitas?.accounts?.map(a => (
                                    <div key={a.id}
                                         className="flex justify-between text-sm py-1.5 border-b last:border-0">
                                        <span className="text-muted-foreground">{a.code} — {a.name}</span>
                                        <span className="font-medium">{fmtRp(a.balance)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-sm py-1.5 border-b">
                                    <span className="text-muted-foreground italic">Laba / Rugi Berjalan</span>
                                    <span
                                        className={`font-medium ${balanceSheet.ekuitas?.net_income >= 0 ? "text-green-700" : "text-red-700"}`}>
                                        {fmtRp(balanceSheet.ekuitas?.net_income)}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold mt-2 pt-2 border-t-2 text-purple-700">
                                    <span>Total Kewajiban + Ekuitas</span>
                                    <span>{fmtRp(balanceSheet.total_kewajiban_ekuitas)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Arus Kas ──────────────────────────────────────────────── */}
            {activeReport === "cash-flow" && cashFlow && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ArrowLeftRight className="w-4 h-4 text-teal-500"/>
                            Laporan Arus Kas
                            <span className="ml-auto text-xs font-normal text-muted-foreground">
                                {fmtDate(cashFlow.period?.from)} — {fmtDate(cashFlow.period?.to)}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Saldo awal */}
                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border">
                            <span className="text-sm font-medium">Saldo Awal Kas</span>
                            <span className="font-bold">{fmtRp(cashFlow.saldo_awal_kas)}</span>
                        </div>

                        {[
                            {key: "operasional", label: "Aktivitas Operasional", color: "teal"},
                            {key: "investasi", label: "Aktivitas Investasi", color: "blue"},
                            {key: "pendanaan", label: "Aktivitas Pendanaan", color: "purple"},
                        ].map(({key, label, color}) => {
                            const section = cashFlow[key];
                            if (!section) return null;
                            return (
                                <div key={key} className="rounded-lg border overflow-hidden">
                                    <div className={`px-4 py-2 bg-${color}-50 dark:bg-${color}-950/30 border-b`}>
                                        <h4 className={`text-sm font-semibold text-${color}-700 dark:text-${color}-400`}>{label}</h4>
                                    </div>
                                    <div className="divide-y">
                                        {section.inflow?.map((r, i) => (
                                            <div key={i} className="flex justify-between px-4 py-2 text-sm">
                                                <span className="text-muted-foreground">{r.account} <span
                                                    className="font-mono text-xs">({r.reference})</span></span>
                                                <span className="text-teal-600 font-medium">+{fmtRp(r.amount)}</span>
                                            </div>
                                        ))}
                                        {section.outflow?.map((r, i) => (
                                            <div key={i} className="flex justify-between px-4 py-2 text-sm">
                                                <span className="text-muted-foreground">{r.account} <span
                                                    className="font-mono text-xs">({r.reference})</span></span>
                                                <span className="text-rose-600 font-medium">-{fmtRp(r.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className={`flex justify-between px-4 py-2 border-t bg-${color}-50/50 dark:bg-${color}-950/20`}>
                                        <span className="text-xs font-semibold text-muted-foreground">Net {label}</span>
                                        <span
                                            className={`text-sm font-bold ${section.net >= 0 ? "text-teal-600" : "text-rose-600"}`}>
                                            {section.net >= 0 ? "+" : ""}{fmtRp(section.net)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Saldo akhir */}
                        <div
                            className="flex justify-between items-center p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200">
                            <div>
                                <p className="text-xs text-muted-foreground">Perubahan Bersih Kas</p>
                                <p className={`text-sm font-semibold ${cashFlow.net_change >= 0 ? "text-teal-600" : "text-rose-600"}`}>
                                    {cashFlow.net_change >= 0 ? "+" : ""}{fmtRp(cashFlow.net_change)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">Saldo Akhir Kas</p>
                                <p className="text-lg font-bold text-teal-700">{fmtRp(cashFlow.saldo_akhir_kas)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Buku Besar ────────────────────────────────────────────── */}
            {activeReport === "ledger" && ledger && (
                <div className="space-y-4">
                    {ledger.accounts?.map(acct => (
                        <Card key={acct.account.id}>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-3 text-sm">
                                    <div
                                        className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-4 h-4 text-teal-600"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{acct.account.code} — {acct.account.name}</p>
                                        <p className="text-xs font-normal text-muted-foreground">{acct.account.category} ·
                                            Normal: {acct.account.normal_balance}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <p className="text-xs text-muted-foreground">Saldo Akhir</p>
                                        <p className={`text-base font-bold ${acct.saldo_akhir >= 0 ? "text-foreground" : "text-rose-600"}`}>
                                            {fmtRp(acct.saldo_akhir)}
                                        </p>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full text-xs">
                                    <thead>
                                    <tr className="border-y bg-muted/40">
                                        <th className="text-left px-4 py-2 font-medium text-muted-foreground w-[12%]">Tanggal</th>
                                        <th className="text-left px-4 py-2 font-medium text-muted-foreground w-[18%]">Referensi</th>
                                        <th className="text-left px-4 py-2 font-medium text-muted-foreground">Keterangan</th>
                                        <th className="text-right px-4 py-2 font-medium text-rose-500 w-[16%]">Debit</th>
                                        <th className="text-right px-4 py-2 font-medium text-teal-600 w-[16%]">Kredit</th>
                                        <th className="text-right px-4 py-2 font-medium text-muted-foreground w-[16%]">Saldo</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/* Saldo awal baris */}
                                    <tr className="border-b bg-blue-50/50 dark:bg-blue-950/20">
                                        <td className="px-4 py-2 text-muted-foreground">—</td>
                                        <td className="px-4 py-2 font-mono text-muted-foreground">SALDO-AWAL</td>
                                        <td className="px-4 py-2 italic text-muted-foreground">Saldo awal periode</td>
                                        <td className="px-4 py-2 text-right"></td>
                                        <td className="px-4 py-2 text-right"></td>
                                        <td className="px-4 py-2 text-right font-semibold">{fmtRp(acct.saldo_awal)}</td>
                                    </tr>
                                    {acct.transactions?.map((tx, i) => (
                                        <tr key={tx.id} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                                            <td className="px-4 py-2 text-muted-foreground">{fmtDate(tx.date)}</td>
                                            <td className="px-4 py-2 font-mono">{tx.reference ?? "-"}</td>
                                            <td className="px-4 py-2 text-muted-foreground">{tx.description ||
                                                <span className="italic opacity-40">—</span>}</td>
                                            <td className="px-4 py-2 text-right text-rose-600">{tx.debit > 0 ? fmtRp(tx.debit) : ""}</td>
                                            <td className="px-4 py-2 text-right text-teal-600">{tx.credit > 0 ? fmtRp(tx.credit) : ""}</td>
                                            <td className={`px-4 py-2 text-right font-medium ${tx.running_balance >= 0 ? "" : "text-rose-600"}`}>
                                                {fmtRp(tx.running_balance)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr className="border-t-2 bg-muted/40 font-bold">
                                        <td colSpan={3} className="px-4 py-2">Total</td>
                                        <td className="px-4 py-2 text-right text-rose-600">{fmtRp(acct.total_debit)}</td>
                                        <td className="px-4 py-2 text-right text-teal-600">{fmtRp(acct.total_credit)}</td>
                                        <td className="px-4 py-2 text-right">{fmtRp(acct.saldo_akhir)}</td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </CardContent>
                        </Card>
                    ))}
                    {ledger.accounts?.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                            <p className="text-sm">Tidak ada transaksi pada periode ini</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function AccountingPage() {


    const {hasPermission} = usePermission();
    const search = Route.useSearch();
    const [isInitialized, setIsInitialized] = useState(false);

    const tabs = [
        {
            key: "chart-of-accounts",
            label: "Chart of Accounts",
            permission: PERMISSIONS.ACCOUNTING.VIEW,
            component: AccountsTab
        },
        {
            key: "journal",
            label: "Jurnal Entri",
            permission: PERMISSIONS.JOURNAL_ENTRY.VIEW,
            component: JournalTab
        },
        {
            key: "reports",
            label: "Laporan",
            permission: PERMISSIONS.FINANCIAL_REPORT.VIEW,
            component: ReportsTab
        },
    ];


    const firstAccessibleTab = tabs.find(tab => hasPermission(tab.permission));
    const activeTab = search?.tab || '';

    useEffect(() => {
        if (!search?.tab && firstAccessibleTab) {
            navigate({
                to: '.',
                search: {tab: firstAccessibleTab.key},
                replace: true
            });
        } else {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (search?.tab) {
            setIsInitialized(true);
        }
    }, [search?.tab]);

    useEffect(() => {
        if (activeTab && isInitialized) {
            const currentTab = tabs.find(tab => tab.key === activeTab);
            if (currentTab && !hasPermission(currentTab.permission)) {
                if (firstAccessibleTab) {
                    navigate({
                        to: '.',
                        search: {tab: firstAccessibleTab.key},
                        replace: true
                    });
                }
            }
        }
    }, [activeTab, isInitialized]);

    const hasAnyTabAccess = tabs.some(tab => hasPermission(tab.permission));

    if (!hasAnyTabAccess) {
        return (
            <Layout>
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4"/>
                        <h2 className="text-2xl font-semibold mb-2">Akses Ditolak</h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Anda tidak memiliki izin untuk mengakses halaman manajemen obat.
                            Silakan hubungi administrator untuk mendapatkan akses.
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!activeTab) {
        return (
            <Layout>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-pulse">Loading...</div>
                </div>
            </Layout>
        );
    }


    return (
        <Layout>
            <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-100">
                    <BookOpen className="w-6 h-6 text-teal-600"/>
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-teal-600">Akuntansi</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola Chart of Accounts, jurnal, dan laporan keuangan
                    </p>
                </div>
            </div>

            <PermissionTabs tabs={tabs} gridCols={3} defaultTab="chart-of-accounts"/>
        </Layout>
    );
}

export default AccountingPage;