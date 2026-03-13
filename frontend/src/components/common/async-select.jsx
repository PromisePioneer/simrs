// @/components/common/async-select.jsx
import {useState, useEffect, useRef, useCallback} from "react";
import {Check, ChevronsUpDown, Loader2, X, Search, Plus} from "lucide-react";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Link} from "@tanstack/react-router";

export function AsyncSelect({
                                fetchFn,
                                value,
                                onChange,
                                multiple = false,
                                placeholder = "Cari...",
                                disabled = false,
                                debounce = 300,
                                minChars = 0,
                                className,
                                defaultLabel = null,
                                emptyAction = null,
                            }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]); // { value, label }[]

    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);
    const labelCache = useRef({});

    // ── Fetch options ──────────────────────────────────────────────────
    const doFetch = useCallback(async (q) => {
        if (q.length < minChars) {
            setOptions([]);
            return;
        }
        setLoading(true);
        try {
            const results = await fetchFn(q);
            // results: [{ value, label }]
            results.forEach(r => {
                labelCache.current[r.value] = r.label;
            });
            setOptions(results);
        } catch (e) {
            setOptions([]);
        } finally {
            setLoading(false);
        }
    }, [fetchFn, minChars]);

    // Debounce search input
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doFetch(search), debounce);
        return () => clearTimeout(debounceRef.current);
    }, [search, doFetch, debounce]);

    // Fetch awal saat dropdown dibuka
    useEffect(() => {
        if (open) {
            doFetch(search);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // Sync selectedItems saat value prop berubah (edit mode)
    useEffect(() => {
        if (!value) {
            setSelectedItems([]);
            return;
        }
        const vals = multiple ? (Array.isArray(value) ? value : [value]) : [value];
        setSelectedItems(
            vals.map(v => ({
                value: v,
                // ✅ Pakai defaultLabel kalau labelCache kosong
                label: labelCache.current[v] ?? defaultLabel ?? v,
            }))
        );
    }, [value, defaultLabel]);

    // Close dropdown saat klik luar
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Handlers ───────────────────────────────────────────────────────
    const toggleOption = (option) => {
        labelCache.current[option.value] = option.label;

        if (!multiple) {
            setSelectedItems([option]);
            onChange(option.value);
            setOpen(false);
            setSearch("");
            return;
        }

        const exists = selectedItems.find(s => s.value === option.value);
        let next;
        if (exists) {
            next = selectedItems.filter(s => s.value !== option.value);
        } else {
            next = [...selectedItems, option];
        }
        setSelectedItems(next);
        onChange(next.map(s => s.value));
    };

    const removeItem = (val, e) => {
        e?.stopPropagation();
        const next = selectedItems.filter(s => s.value !== val);
        setSelectedItems(next);
        onChange(multiple ? next.map(s => s.value) : "");
    };

    const isSelected = (val) => selectedItems.some(s => s.value === val);

    // ── Render ─────────────────────────────────────────────────────────
    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            {/* Trigger */}
            <div
                onClick={() => !disabled && setOpen(v => !v)}
                className={cn(
                    "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm cursor-pointer transition-colors",
                    open && "ring-2 ring-ring border-ring",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                {selectedItems.length === 0 && (
                    <span className="text-muted-foreground flex-1">{placeholder}</span>
                )}

                {multiple ? (
                    <>
                        {selectedItems.map(item => (
                            <Badge
                                key={item.value}
                                variant="secondary"
                                className="flex items-center gap-1 pr-1 text-xs"
                            >
                                {item.label}
                                <button
                                    type="button"
                                    onClick={(e) => removeItem(item.value, e)}
                                    className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                                >
                                    <X className="w-3 h-3"/>
                                </button>
                            </Badge>
                        ))}
                        {selectedItems.length > 0 && <span className="flex-1"/>}
                    </>
                ) : (
                    selectedItems.length > 0 && (
                        <span className="flex-1 truncate">{selectedItems[0].label}</span>
                    )
                )}

                <div className="flex items-center gap-1 ml-auto pl-1">
                    {!multiple && selectedItems.length > 0 && (
                        <button
                            type="button"
                            onClick={(e) => removeItem(selectedItems[0].value, e)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-3.5 h-3.5"/>
                        </button>
                    )}
                    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground"/>
                </div>
            </div>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
                    {/* Search input */}
                    <div className="flex items-center border-b px-3 py-2 gap-2">
                        <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0"/>
                        <input
                            ref={inputRef}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Ketik untuk mencari..."
                            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                        />
                        {loading && <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin"/>}
                    </div>

                    {/* Options list */}
                    <div className="max-h-56 overflow-y-auto py-1">
                        {loading && options.length === 0 && (
                            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground gap-2">
                                <Loader2 className="w-4 h-4 animate-spin"/> Memuat data...
                            </div>
                        )}

                        {!loading && options.length === 0 && (
                            <div className="py-6 text-center space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    {search.length < minChars
                                        ? `Ketik minimal ${minChars} karakter`
                                        : "Tidak ada hasil"}
                                </p>
                                {emptyAction && search.length >= minChars && (
                                    <Link
                                        to={emptyAction.to}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        <Plus className="w-3.5 h-3.5"/>
                                        {emptyAction.label}
                                    </Link>
                                )}
                            </div>
                        )}

                        {options.map(option => (
                            <div
                                key={option.value}
                                onClick={() => toggleOption(option)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                    isSelected(option.value) && "bg-accent/50"
                                )}
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors",
                                    isSelected(option.value)
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-input"
                                )}>
                                    {isSelected(option.value) && <Check className="w-3 h-3"/>}
                                </div>
                                <span className="flex-1 truncate">{option.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}