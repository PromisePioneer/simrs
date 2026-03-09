/**
 * ListCard — Generic card component untuk semua list page
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  accent bar (accentColor)                                   │
 * ├──────────┬──────────────────────────────┬───────────────────┤
 * │  icon    │  title + badges + meta       │  headerActions    │
 * │  (slot)  │                              │  (always visible) │
 * ├──────────┴──────────────────────────────┴───────────────────┤
 * │  actions (kiri) ─────────────── right (kanan)               │
 * ├─────────────────────────────────────────────────────────────┤
 * │  detail (collapsible) — toggle via klik card                │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Klik card → toggle expand/collapse detail
 * Klik tombol (headerActions / actions) → tidak trigger expand
 */

import {useState} from "react";
import {Card, CardContent} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Badge} from "@/components/ui/badge.jsx";
import {ChevronDown} from "lucide-react";

/* ─── Collapse ───────────────────────────────────────────────── */
function Collapse({open, children}) {
    return (
        <div style={{
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: "grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}>
            <div style={{overflow: "hidden"}}>
                <div style={{
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0)" : "translateY(-6px)",
                    transition: "opacity 0.25s ease, transform 0.25s ease",
                    transitionDelay: open ? "0.05s" : "0s",
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

/* ─── ListCard ───────────────────────────────────────────────── */
export function ListCard({
                             accentColor = "from-teal-400 to-teal-500",
                             icon,
                             iconBg = "bg-teal-50 border border-teal-100",
                             title,
                             subtitle,
                             badges = [],
                             meta = [],
                             headerActions = [],
                             actions = [],
                             right,
                             detail,
                             defaultExpanded = false,
                             onClick,         // kalau diisi, klik card panggil ini SELAIN toggle expand
                             index = 0,
                             className = "",
                         }) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const hasDetail  = !!detail;
    const hasBottom  = actions.length > 0 || !!right;

    // Klik card → toggle expand (jika ada detail) + panggil onClick opsional
    const handleCardClick = () => {
        if (hasDetail) setExpanded((prev) => !prev);
        onClick?.();
    };

    // Tombol tidak boleh bubble ke card
    const stopProp = (e) => e.stopPropagation();

    return (
        <div
            style={{animation: "lc-fadein 0.3s ease both", animationDelay: `${index * 60}ms`}}
            onClick={handleCardClick}
            className={hasDetail ? "group cursor-pointer" : "group"}
        >
            <Card className={`overflow-hidden border border-border/60 transition-all duration-200
                ${hasDetail ? "hover:border-slate-300 hover:shadow-md" : ""}
                ${expanded ? "border-teal-200 shadow-md" : ""}
                ${className}`}
            >
                {/* Accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${accentColor}`}/>

                <CardContent className="p-5">

                    {/* ── Main row ── */}
                    <div className="flex gap-4 items-start">
                        {/* Icon — rotate chevron sebagai visual cue expand */}
                        {icon && (
                            <div className={`relative flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110 ${iconBg}`}>
                                {icon}
                            </div>
                        )}

                        {/* Center */}
                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                {typeof title === "string"
                                    ? <h3 className="font-semibold text-base truncate">{title}</h3>
                                    : title
                                }
                                {badges.map((badge, i) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className={`gap-1 text-[11px] px-2 py-0.5 shrink-0 ${badge.className ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
                                    >
                                        {badge.icon && <badge.icon className="w-3 h-3"/>}
                                        {badge.label}
                                    </Badge>
                                ))}
                            </div>

                            {subtitle && (
                                <p className="text-xs text-muted-foreground">{subtitle}</p>
                            )}

                            {meta.length > 0 && (
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-0.5">
                                    {meta.map((m, i) => (
                                        <span key={i} className="flex items-center gap-1">
                                            {m.icon && <m.icon className="w-3 h-3"/>}
                                            {m.label}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Header actions (Cetak, dll) + expand indicator */}
                        <div className="flex items-center gap-2 shrink-0" onClick={stopProp}>
                            {headerActions.map((action, i) => {
                                const ActionIcon = action.icon;
                                return (
                                    <Button
                                        key={i}
                                        size="sm"
                                        variant={action.variant ?? "outline"}
                                        className={`gap-1.5 text-xs h-8 active:scale-95 transition-all ${action.className ?? ""}`}
                                        onClick={action.onClick}
                                        disabled={action.disabled}
                                    >
                                        {ActionIcon && <ActionIcon className="w-3.5 h-3.5"/>}
                                        {action.label}
                                    </Button>
                                );
                            })}

                            {/* Expand indicator — hanya tampil jika ada detail */}
                            {hasDetail && (
                                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-400">
                                    <ChevronDown
                                        className="w-4 h-4"
                                        style={{
                                            transition: "transform 0.3s ease",
                                            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Bottom row: workflow actions kiri + right kanan ── */}
                    {hasBottom && (
                        <div className="flex items-center justify-between gap-2 mt-4" onClick={stopProp}>
                            <div className="flex flex-wrap gap-2">
                                {actions.map((action, i) => {
                                    const ActionIcon = action.icon;
                                    return (
                                        <Button
                                            key={i}
                                            size="sm"
                                            variant={action.variant ?? "default"}
                                            className={`gap-1.5 text-xs h-8 active:scale-95 transition-all ${action.className ?? ""}`}
                                            onClick={action.onClick}
                                            disabled={action.disabled}
                                        >
                                            {ActionIcon && <ActionIcon className="w-3.5 h-3.5"/>}
                                            {action.label}
                                        </Button>
                                    );
                                })}
                            </div>
                            {right && <div className="shrink-0">{right}</div>}
                        </div>
                    )}

                    {/* ── Collapsible detail ── */}
                    {hasDetail && (
                        <Collapse open={expanded}>
                            <div className="mt-4 pt-4 border-t border-dashed">
                                {detail}
                            </div>
                        </Collapse>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

/* ─── Keyframes ──────────────────────────────────────────────── */
typeof document !== "undefined" && (() => {
    const id = "__lc-anim__";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
        @keyframes lc-fadein {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(s);
})();