import {useStockMovementStore} from "@/store/stockMovementStore.js";
import {useEffect, useState, useMemo} from "react";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import {
    ArrowDownCircle, ArrowUpCircle, Search, X, Calendar,
    Warehouse, ClipboardList, TrendingDown, TrendingUp,
    Activity, Layers, MapPin, StickyNote, RefreshCw,
} from "lucide-react";
import {formatDate} from "@/utils/formatDate.js";
import {ListCard} from "@/components/common/list-card.jsx";

/* ─── Helpers ────────────────────────────────────────────────── */
const isOut = (type) => type === "out";

const referenceTypeLabel = (ref) => {
    if (!ref) return "—";
    const map = {
        "App\\Models\\Prescription": "Resep",
        "App\\Models\\PurchaseOrder": "Purchase Order",
        "App\\Models\\StockOpname": "Stok Opname",
        "App\\Models\\Transfer": "Transfer",
    };
    return map[ref] ?? ref.split("\\").pop();
};

const formatStock = (val) => {
    if (val === null || val === undefined) return "—";
    const n = parseFloat(val);
    return isNaN(n) ? val : n.toLocaleString("id-ID");
};

const formatQty = (qty) => {
    const n = parseInt(qty);
    return isNaN(n) ? qty : Math.abs(n).toLocaleString("id-ID");
};

/* ─── Detail Modal ───────────────────────────────────────────── */
function DetailModal({item, onClose}) {
    if (!item) return null;
    const out = isOut(item.type);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{animation: "lc-fadein 0.2s ease"}}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                 style={{animation: "lc-fadein 0.25s cubic-bezier(0.34,1.56,0.64,1)"}}>
                <div
                    className={`h-1.5 w-full bg-gradient-to-r ${out ? "from-red-400 to-rose-500" : "from-emerald-400 to-teal-500"}`}/>
                <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${out ? "bg-red-50 border border-red-100" : "bg-emerald-50 border border-emerald-100"}`}>
                                {out ? <ArrowDownCircle className="w-5 h-5 text-red-500"/> :
                                    <ArrowUpCircle className="w-5 h-5 text-emerald-500"/>}
                            </div>
                            <div>
                                <p className="font-bold text-base text-slate-800">{item.medicine?.name ?? "—"}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{item.medicine?.sku ?? ""}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5"/>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                        {[
                            {
                                label: "Jumlah",
                                value: `${out ? "-" : "+"}${formatQty(item.quantity)}`,
                                color: out ? "text-red-600" : "text-emerald-600"
                            },
                            {label: "Stok Sebelum", value: formatStock(item.stock_before), color: "text-slate-700"},
                            {
                                label: "Stok Sesudah",
                                value: formatStock(item.stock_after),
                                color: parseFloat(item.stock_after) < 0 ? "text-red-500" : "text-slate-700"
                            },
                        ].map(({label, value, color}) => (
                            <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                                <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">{label}</p>
                                <p className={`font-bold text-sm ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2.5">
                        {[
                            {icon: Layers, label: "Batch", value: item.batch?.batch_number ?? "—"},
                            {icon: Calendar, label: "Expired", value: item.batch?.expired_date ?? "—"},
                            {icon: Warehouse, label: "Gudang", value: item.warehouse?.name ?? "—"},
                            {icon: MapPin, label: "Rack", value: item.rack?.name ?? "—"},
                            {icon: ClipboardList, label: "Referensi", value: referenceTypeLabel(item.reference_type)},
                            {icon: StickyNote, label: "Catatan", value: item.notes ?? "—"},
                            {
                                icon: Calendar,
                                label: "Waktu",
                                value: item.created_at ? new Date(item.created_at).toLocaleString("id-ID") : "—"
                            },
                        ].map(({icon: Icon, label, value}) => (
                            <div key={label} className="flex items-start gap-3">
                                <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0"/>
                                <span className="text-slate-500 w-20 shrink-0 text-xs">{label}</span>
                                <span className="text-slate-700 text-xs flex-1">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Summary Bar ────────────────────────────────────────────── */
function SummaryBar({items}) {
    const totalIn = items.filter(i => !isOut(i.type)).reduce((s, i) => s + Math.abs(parseInt(i.quantity) || 0), 0);
    const totalOut = items.filter(i => isOut(i.type)).reduce((s, i) => s + Math.abs(parseInt(i.quantity) || 0), 0);
    const negCount = items.filter(i => parseFloat(i.stock_after) < 0).length;

    return (
        <div className="grid grid-cols-3 gap-3">
            {[
                {
                    icon: TrendingUp,
                    label: "Total Masuk",
                    value: totalIn.toLocaleString("id-ID"),
                    cls: "bg-emerald-50 border-emerald-200",
                    iconCls: "text-emerald-500",
                    valCls: "text-emerald-700"
                },
                {
                    icon: TrendingDown,
                    label: "Total Keluar",
                    value: totalOut.toLocaleString("id-ID"),
                    cls: "bg-red-50 border-red-200",
                    iconCls: "text-red-500",
                    valCls: "text-red-700"
                },
                {
                    icon: Activity,
                    label: "Stok Negatif",
                    value: negCount,
                    cls: negCount > 0 ? "bg-orange-50 border-orange-200" : "bg-slate-50 border-slate-200",
                    iconCls: negCount > 0 ? "text-orange-500" : "text-slate-400",
                    valCls: negCount > 0 ? "text-orange-700" : "text-slate-600"
                },
            ].map(({icon: Icon, label, value, cls, iconCls, valCls}) => (
                <div key={label} className={`rounded-xl border p-3 ${cls}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-3.5 h-3.5 ${iconCls}`}/>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</span>
                    </div>
                    <p className={`font-bold text-lg ${valCls}`}>{value}</p>
                </div>
            ))}
        </div>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
function StockMovementPage() {
    const {fetchMedicineMovementStock, medicineMovementStocks} = useStockMovementStore();
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchMedicineMovementStock({perPage: 20});
    }, []);

    const list = useMemo(() => {
        if (!medicineMovementStocks) return [];
        if (Array.isArray(medicineMovementStocks)) return medicineMovementStocks;
        if (Array.isArray(medicineMovementStocks.data)) return medicineMovementStocks.data;
        if (Array.isArray(medicineMovementStocks.data?.data)) return medicineMovementStocks.data.data;
        return [];
    }, [medicineMovementStocks]);

    const paginationMeta = useMemo(() => {
        if (Array.isArray(medicineMovementStocks)) return null;
        if (medicineMovementStocks?.last_page) return medicineMovementStocks;
        if (medicineMovementStocks?.data?.last_page) return medicineMovementStocks.data;
        return null;
    }, [medicineMovementStocks]);

    const filtered = useMemo(() => list.filter((item) => {
        const q = search.toLowerCase();
        const matchSearch = !q || item.medicine?.name?.toLowerCase().includes(q) || item.medicine?.sku?.toLowerCase().includes(q);
        const matchType = typeFilter === "all" || item.type === typeFilter;
        const matchDate = !dateFilter || item.created_at?.startsWith(dateFilter);
        return matchSearch && matchType && matchDate;
    }), [list, search, typeFilter, dateFilter]);

    const hasFilters = search || typeFilter !== "all" || dateFilter;
    const clearFilters = () => {
        setSearch("");
        setTypeFilter("all");
        setDateFilter("");
    };

    return (
        <>
            {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)}/>}

            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500 shadow-lg shadow-teal-200 shrink-0">
                        <Activity className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-teal-600">Mutasi Stok</h1>
                        <p className="text-sm text-muted-foreground">Riwayat pergerakan stok obat</p>
                    </div>
                </div>

                {list.length > 0 && <SummaryBar items={filtered}/>}

                <Card className="border border-border/60">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Daftar Mutasi</CardTitle>
                                <CardDescription className="text-xs mt-0.5">
                                    {filtered.length} dari {list.length} transaksi ditampilkan
                                </CardDescription>
                            </div>
                            {hasFilters && (
                                <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-slate-500"
                                        onClick={clearFilters}>
                                    <RefreshCw className="w-3 h-3"/> Reset Filter
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input placeholder="Cari nama atau SKU obat…" className="pl-9 pr-8 h-9 text-sm"
                                       value={search} onChange={(e) => setSearch(e.target.value)}/>
                                {search && (
                                    <button onClick={() => setSearch("")}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-teal-600 transition-colors">
                                        <X className="w-4 h-4"/>
                                    </button>
                                )}
                            </div>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full sm:w-[150px] h-9 text-sm">
                                    <SelectValue placeholder="Tipe"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tipe</SelectItem>
                                    <SelectItem value="in"><span className="flex items-center gap-1.5"><ArrowUpCircle
                                        className="w-3.5 h-3.5 text-emerald-500"/> Masuk</span></SelectItem>
                                    <SelectItem value="out"><span className="flex items-center gap-1.5"><ArrowDownCircle
                                        className="w-3.5 h-3.5 text-red-500"/> Keluar</span></SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative">
                                <Calendar
                                    className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none"/>
                                <Input type="date" className="pl-9 h-9 text-sm w-full sm:w-[160px]"
                                       value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}/>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                        {list.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Activity className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                                <p className="text-sm">Belum ada data mutasi stok</p>
                            </div>
                        )}

                        {list.length > 0 && filtered.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Search className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                                <p className="text-sm font-medium">Tidak ada hasil</p>
                                <p className="text-xs mt-1">Coba ubah filter atau kata kunci pencarian</p>
                                <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={clearFilters}>Reset
                                    Filter</Button>
                            </div>
                        )}

                        {/* ── Render pakai ListCard ── */}
                        {filtered.map((item, index) => {
                            const out = isOut(item.type);
                            const isNegStock = parseFloat(item.stock_after) < 0;

                            return (
                                <ListCard
                                    key={item.id}
                                    index={index}

                                    /* accent bar */
                                    accentColor={out ? "from-red-400 to-rose-400" : "from-emerald-400 to-teal-400"}

                                    /* icon */
                                    icon={out
                                        ? <ArrowDownCircle className="w-5 h-5 text-red-500"/>
                                        : <ArrowUpCircle className="w-5 h-5 text-emerald-500"/>
                                    }
                                    iconBg={out ? "bg-red-50 border border-red-100" : "bg-emerald-50 border border-emerald-100"}

                                    /* title */
                                    title={item.medicine?.name ?? "—"}

                                    /* badges */
                                    badges={[
                                        {
                                            label: out ? "Keluar" : "Masuk",
                                            className: out
                                                ? "bg-red-50 text-red-600 border-red-200"
                                                : "bg-emerald-50 text-emerald-700 border-emerald-200",
                                        },
                                        ...(isNegStock ? [{
                                            label: "Stok Negatif",
                                            className: "bg-orange-50 text-orange-600 border-orange-200",
                                        }] : []),
                                    ]}

                                    /* meta */
                                    meta={[
                                        {icon: Layers, label: item.batch?.batch_number ?? "—"},
                                        {icon: Warehouse, label: item.warehouse?.name ?? "—"},
                                        {icon: ClipboardList, label: referenceTypeLabel(item.reference_type)},
                                        {icon: Calendar, label: item.created_at ? formatDate(item.created_at) : "—"},
                                    ]}

                                    /* right — qty + delta */
                                    right={
                                        <div>
                                            <p className={`font-bold text-base ${out ? "text-red-600" : "text-emerald-600"}`}>
                                                {out ? "−" : "+"}{formatQty(item.quantity)}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">
                                                {formatStock(item.stock_before)} →{" "}
                                                <span className={isNegStock ? "text-orange-500 font-medium" : ""}>
                                                    {formatStock(item.stock_after)}
                                                </span>
                                            </p>
                                        </div>
                                    }

                                    /* click → open modal */
                                    onClick={() => setSelectedItem(item)}

                                    /* detail slot — ditampilkan saat expand */
                                    detail={
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                            {[
                                                {icon: Layers, label: "Batch", value: item.batch?.batch_number ?? "—"},
                                                {
                                                    icon: Calendar,
                                                    label: "Expired",
                                                    value: item.batch?.expired_date ?? "—"
                                                },
                                                {icon: Warehouse, label: "Gudang", value: item.warehouse?.name ?? "—"},
                                                {icon: MapPin, label: "Rack", value: item.rack?.name ?? "—"},
                                                {
                                                    icon: ClipboardList,
                                                    label: "Referensi",
                                                    value: referenceTypeLabel(item.reference_type)
                                                },
                                                {icon: StickyNote, label: "Catatan", value: item.notes ?? "—"},
                                            ].map(({icon: Icon, label, value}) => (
                                                <div key={label} className="flex items-start gap-2">
                                                    <Icon className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0"/>
                                                    <span className="text-muted-foreground w-20 shrink-0">{label}</span>
                                                    <span className="text-slate-700 font-medium">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                />
                            );
                        })}

                        {/* Pagination */}
                        {paginationMeta?.last_page > 1 && (
                            <div
                                className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
                                <span>Halaman {paginationMeta.current_page} dari {paginationMeta.last_page}</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-7 text-xs"
                                            disabled={!paginationMeta.prev_page_url}>Sebelumnya</Button>
                                    <Button variant="outline" size="sm" className="h-7 text-xs"
                                            disabled={!paginationMeta.next_page_url}>Berikutnya</Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default StockMovementPage;