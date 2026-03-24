import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import Layout from "@/pages/dashboard/layout.jsx";
import { useBillingStore } from "@/store/billingStore.js";
import { usePaymentMethodStore } from "@/store/usePaymentMethodStore.js";
import DataTable from "@/components/common/data-table.jsx";
import Modal from "@/components/common/modal.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { TableCell, TableRow } from "@/components/ui/table.jsx";
import {
    FileText, Pencil, CreditCard, XCircle,
    CircleEllipsis, Eye, Receipt,
} from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

const STATUS_BADGE = {
    draft:     { label: "Draft",       variant: "secondary" },
    issued:    { label: "Diterbitkan", variant: "outline"   },
    paid:      { label: "Lunas",       className: "bg-green-100 text-green-700 border-green-200" },
    cancelled: { label: "Dibatalkan",  className: "bg-slate-100 text-slate-500 border-slate-200" },
};

// ─── Modal Detail Tagihan ─────────────────────────────────────────────────────
function BillDetailModal({ open, onClose, bill }) {
    if (!bill) return null;
    return (
        <Modal open={open} onOpenChange={onClose} title={`Tagihan ${bill.bill_number}`}
            size="lg" hideFooter>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Pasien</p>
                        <p className="font-medium">{bill.patient?.full_name}</p>
                        <p className="text-xs text-muted-foreground">No. RM: {bill.patient?.mrn}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge className={STATUS_BADGE[bill.status]?.className}
                            variant={STATUS_BADGE[bill.status]?.variant}>
                            {STATUS_BADGE[bill.status]?.label}
                        </Badge>
                    </div>
                </div>

                {/* Items */}
                <div>
                    <p className="text-sm font-medium mb-2">Rincian Tagihan</p>
                    <div className="rounded-lg border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-2 pl-3">Deskripsi</th>
                                    <th className="text-right p-2">Qty</th>
                                    <th className="text-right p-2">Harga Satuan</th>
                                    <th className="text-right p-2 pr-3">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bill.items?.map(item => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-2 pl-3">
                                            <p>{item.description}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{item.item_type}</p>
                                        </td>
                                        <td className="text-right p-2">{item.quantity}</td>
                                        <td className="text-right p-2">
                                            Rp {Number(item.unit_price).toLocaleString("id-ID")}
                                        </td>
                                        <td className="text-right p-2 pr-3 font-medium">
                                            Rp {Number(item.subtotal).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals */}
                <div className="space-y-1 text-sm border-t pt-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>Rp {Number(bill.subtotal).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Diskon</span>
                        <span>- Rp {Number(bill.discount).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Pajak (PPN 11%)</span>
                        <span>Rp {Number(bill.tax).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t pt-2">
                        <span>Total</span>
                        <span className="text-teal-600">Rp {Number(bill.total).toLocaleString("id-ID")}</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

// ─── Modal Bayar ──────────────────────────────────────────────────────────────
function PayModal({ open, onClose, bill, onPay }) {
    const { paymentMethods, fetchPaymentMethods } = usePaymentMethodStore();
    const [form, setForm] = useState({ payment_method_id: "", notes: "" });

    useEffect(() => { if (open) fetchPaymentMethods(); }, [open]);

    const handlePay = () => onPay(bill?.id, form);

    if (!bill) return null;
    return (
        <Modal open={open} onOpenChange={onClose}
            title="Proses Pembayaran" onSubmit={handlePay}
            submitText="Konfirmasi Bayar">
            <div className="space-y-4">
                <Card className="bg-teal-50 border-teal-200">
                    <CardContent className="pt-4 pb-3">
                        <p className="text-sm text-muted-foreground">Total yang harus dibayar</p>
                        <p className="text-2xl font-bold text-teal-700">
                            Rp {Number(bill.total).toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{bill.bill_number} — {bill.patient?.full_name}</p>
                    </CardContent>
                </Card>

                <div>
                    <Label>Metode Pembayaran</Label>
                    <Select value={form.payment_method_id}
                        onValueChange={v => setForm({ ...form, payment_method_id: v })}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih metode" /></SelectTrigger>
                        <SelectContent>
                            {(paymentMethods?.data ?? paymentMethods ?? []).map(pm => (
                                <SelectItem key={pm.id} value={pm.id}>{pm.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Catatan</Label>
                    <Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                        placeholder="Opsional" rows={2} className="mt-1" />
                </div>
            </div>
        </Modal>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function OutpatientBillingPage() {
    const {
        outpatientBills, outpatientLoading, outpatientSearch, outpatientCurrentPage,
        outpatientFilters, outpatientBillValue,
        setOutpatientSearch, setOutpatientCurrentPage, setOutpatientFilters,
        setOpenPayOutpatientModal, openPayOutpatientModal,
        fetchOutpatientBills, payOutpatientBill, cancelOutpatientBill, showOutpatientBill,
    } = useBillingStore();

    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    useEffect(() => { fetchOutpatientBills({ perPage: 20 }); }, [outpatientCurrentPage, outpatientSearch, outpatientFilters]);

    const handleViewDetail = async (bill) => {
        await showOutpatientBill(bill.id);
        setSelectedBill(useBillingStore.getState().outpatientBillValue);
        setDetailOpen(true);
    };

    const columns = [
        { key: "no",       label: "No",       width: "5%" },
        { key: "number",   label: "No. Tagihan" },
        { key: "patient",  label: "Pasien" },
        { key: "date",     label: "Tanggal",   width: "12%" },
        { key: "total",    label: "Total",     width: "15%" },
        { key: "status",   label: "Status",    width: "12%" },
        { key: "actions",  label: "Aksi",      width: "10%", align: "right" },
    ];

    const renderRow = (bill, index) => {
        const statusInfo = STATUS_BADGE[bill.status] ?? { label: bill.status, variant: "outline" };
        return (
            <TableRow key={bill.id} className="hover:bg-muted/50">
                <TableCell className="text-muted-foreground">{(outpatientBills?.from ?? 0) + index}</TableCell>
                <TableCell><span className="font-mono text-sm">{bill.bill_number}</span></TableCell>
                <TableCell>
                    <p className="font-medium">{bill.patient?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{bill.patient?.mrn}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                    {bill.created_at ? new Date(bill.created_at).toLocaleDateString("id-ID") : "-"}
                </TableCell>
                <TableCell className="font-semibold text-teal-700">
                    Rp {Number(bill.total).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                    <Badge variant={statusInfo.variant} className={statusInfo.className}>
                        {statusInfo.label}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm"><CircleEllipsis className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => handleViewDetail(bill)}>
                                    Detail <DropdownMenuShortcut><Eye className="w-3 h-3" /></DropdownMenuShortcut>
                                </DropdownMenuItem>
                                {bill.status !== "paid" && bill.status !== "cancelled" && (
                                    <DropdownMenuItem onClick={() => setOpenPayOutpatientModal(bill)}>
                                        Bayar <DropdownMenuShortcut><CreditCard className="w-3 h-3" /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                )}
                                {bill.status !== "paid" && bill.status !== "cancelled" && (
                                    <DropdownMenuItem onClick={() => cancelOutpatientBill(bill.id)}
                                        className="text-destructive focus:text-destructive">
                                        Batalkan <DropdownMenuShortcut><XCircle className="w-3 h-3" /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <Layout>
            <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-100">
                    <Receipt className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-teal-600">Pembayaran Rawat Jalan</h1>
                    <p className="text-sm text-muted-foreground">Kelola tagihan dan pembayaran pasien rawat jalan</p>
                </div>
            </div>

            {/* Filter bar */}
            <div className="flex gap-3 mb-4">
                <Select value={outpatientFilters.status}
                    onValueChange={v => setOutpatientFilters({ status: v === "all" ? "" : v })}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Semua status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="issued">Diterbitkan</SelectItem>
                        <SelectItem value="paid">Lunas</SelectItem>
                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                </Select>
                <Input type="date" value={outpatientFilters.date_from}
                    onChange={e => setOutpatientFilters({ date_from: e.target.value })}
                    className="w-40" />
                <Input type="date" value={outpatientFilters.date_to}
                    onChange={e => setOutpatientFilters({ date_to: e.target.value })}
                    className="w-40" />
                <Button variant="outline" onClick={() => fetchOutpatientBills()}>Filter</Button>
            </div>

            <DataTable
                columns={columns} data={outpatientBills?.data ?? []} isLoading={outpatientLoading}
                pagination={outpatientBills ? {
                    from: outpatientBills.from, to: outpatientBills.to, total: outpatientBills.total,
                    current_page: outpatientBills.current_page, last_page: outpatientBills.last_page,
                } : null}
                onPageChange={setOutpatientCurrentPage} currentPage={outpatientCurrentPage}
                onSearch={setOutpatientSearch} search={outpatientSearch}
                searchPlaceholder="Cari nomor tagihan..."
                emptyStateIcon={FileText} emptyStateText="Belum ada tagihan rawat jalan"
                renderRow={renderRow} showSearch
            />

            <BillDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} bill={selectedBill} />

            <PayModal
                open={openPayOutpatientModal}
                onClose={() => setOpenPayOutpatientModal(null)}
                bill={outpatientBillValue}
                onPay={payOutpatientBill}
            />
        </Layout>
    );
}

export default OutpatientBillingPage;
