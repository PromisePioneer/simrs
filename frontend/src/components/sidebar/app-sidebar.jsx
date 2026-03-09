"use client"

import * as React from "react"
import {useState, useEffect, useMemo} from "react"
import {Link, useLocation} from "@tanstack/react-router"
import {useAuthStore} from "@/store/authStore.js"
import {useSidebarStore} from "@/store/useSidebarStore.js"
import {
    Home, FolderOpen, LayoutTemplate, Palette,
    MoreHorizontal, Bell, Search, X, List
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import {NavUser} from "@/components/sidebar/nav-user.jsx"
import {Skeleton} from "@/components/ui/skeleton"
import {cn} from "@/lib/utils"

// ─── Icon map ─────────────────────────────────────────────────────────────
const ICON_MAP = {
    beranda: Home, home: Home,
    proyek: FolderOpen, project: FolderOpen,
    template: List,
    merek: Palette, brand: Palette,
}

const getIcon = (title = "") => {
    const key = title.toLowerCase()
    for (const [k, Icon] of Object.entries(ICON_MAP)) {
        if (key.includes(k)) return Icon
    }
    return List;
}

// ─── Shared Tooltip wrapper ───────────────────────────────────────────────
// Selalu tampil (expanded maupun collapsed), muncul di sisi kanan
function NavTooltip({label, children}) {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} className="text-xs font-medium rounded-lg">
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

// ─── Crown badge ──────────────────────────────────────────────────────────
const CrownBadge = () => (
    <span
        className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-yellow-400 text-[7px] text-yellow-900 font-bold shadow z-10">
        ♛
    </span>
)

// ─── Nav item tanpa children ──────────────────────────────────────────────
function NavItem({item, isActive}) {
    const Icon = item.icon || getIcon(item.title)
    const showCrown = ["merek", "brand"].some(k => item.title?.toLowerCase().includes(k))

    return (
        <SidebarMenuItem>
            <NavTooltip label={item.title}>
                <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                        "relative flex items-center justify-center h-auto py-3 px-1 rounded-xl",
                        isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                >
                    <Link to={item.url || "#"}>
                        {isActive && (
                            <span
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"/>
                        )}
                        <div className="relative">
                            <Icon
                                className={cn(
                                    "h-[22px] w-[22px] transition-transform duration-150 group-hover:scale-110 shrink-0",
                                    isActive && "scale-110"
                                )}
                                strokeWidth={isActive ? 2.2 : 1.7}
                            />
                            {showCrown && <CrownBadge/>}
                        </div>
                    </Link>
                </SidebarMenuButton>
            </NavTooltip>
        </SidebarMenuItem>
    )
}

// ─── Nav item WITH children → flyout ke kanan ────────────────────────────
function NavItemFlyout({item, isActive, currentPath}) {
    const [open, setOpen] = useState(false)
    const Icon = item.icon || getIcon(item.title)
    const showCrown = ["merek", "brand"].some(k => item.title?.toLowerCase().includes(k))

    return (
        <SidebarMenuItem>
            <Popover open={open} onOpenChange={setOpen}>
                <NavTooltip label={item.title}>
                    <PopoverTrigger asChild>
                        <SidebarMenuButton
                            isActive={isActive || open}
                            className={cn(
                                "relative flex items-center justify-center h-auto py-3 px-1 rounded-xl",
                                isActive || open
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                            )}
                        >
                            {(isActive || open) && (
                                <span
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"/>
                            )}
                            <div className="relative">
                                <Icon
                                    className={cn(
                                        "h-[22px] w-[22px] transition-transform duration-150 group-hover:scale-110 shrink-0",
                                        isActive && "scale-110"
                                    )}
                                    strokeWidth={isActive ? 2.2 : 1.7}
                                />
                                {showCrown && <CrownBadge/>}
                            </div>
                        </SidebarMenuButton>
                    </PopoverTrigger>
                </NavTooltip>

                <PopoverContent
                    side="right"
                    align="start"
                    sideOffset={8}
                    className="w-52 p-1.5 rounded-xl shadow-2xl border-border"
                >
                    <p className="px-3 py-1.5 text-[11px] font-semibold  uppercase tracking-wider">
                        {item.title}
                    </p>
                    <div className="space-y-0.5">
                        {item.items.map(sub => {
                            const SubIcon = getIcon(sub.title)
                            const subActive = currentPath === sub.url || currentPath.startsWith(sub.url + "/")
                            return (
                                <Link
                                    key={sub.title}
                                    to={sub.url}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                        subActive
                                            ? "bg-accent text-accent-foreground font-semibold"
                                            : " hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <SubIcon className="h-4 w-4 shrink-0" strokeWidth={1.8}/>
                                    {sub.title}
                                </Link>
                            )
                        })}
                    </div>
                </PopoverContent>
            </Popover>
        </SidebarMenuItem>
    )
}

// ─── Overflow "Lainnya" popover ───────────────────────────────────────────
function MorePopover({items = [], currentPath}) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")

    const filtered = items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <SidebarMenuItem>
            <Popover open={open} onOpenChange={setOpen}>
                <NavTooltip label="Lainnya">
                    <PopoverTrigger asChild>
                        <SidebarMenuButton
                            isActive={open}
                            className={cn(
                                "flex items-center justify-center h-auto py-3 px-1 rounded-xl",
                                open
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                            )}
                        >
                            <MoreHorizontal className="h-[22px] w-[22px] shrink-0" strokeWidth={1.7}/>
                        </SidebarMenuButton>
                    </PopoverTrigger>
                </NavTooltip>

                <PopoverContent
                    side="right"
                    align="end"
                    sideOffset={8}
                    className="w-56 p-2 rounded-xl shadow-2xl border-border"
                >
                    <div className="relative mb-2">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 "/>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari menu..."
                            className="w-full bg-muted text-foreground text-xs rounded-lg py-2 pl-8 pr-7 outline-none focus:ring-1 focus:ring-ring transition"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2  hover:text-foreground transition-colors"
                            >
                                <X className="h-3.5 w-3.5"/>
                            </button>
                        )}
                    </div>

                    <div className="space-y-0.5 max-h-60 overflow-y-auto">
                        {filtered.map(item => {
                            const Icon = getIcon(item.title)
                            const subActive = currentPath === item.url || currentPath.startsWith(item.url + "/")
                            return (
                                <Link
                                    key={item.title}
                                    to={item.url}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                        subActive
                                            ? "bg-accent text-accent-foreground font-semibold"
                                            : " hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8}/>
                                    {item.title}
                                </Link>
                            )
                        })}
                        {filtered.length === 0 && (
                            <p className="text-center text-xs  py-4">Tidak ditemukan</p>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </SidebarMenuItem>
    )
}

// ─── Main AppSidebar ──────────────────────────────────────────────────────
export function AppSidebar({...props}) {
    const {userData} = useAuthStore()
    const {fetchMenu, menuData, transformAllMenuData, loadMenuFromStorage, isLoading} = useSidebarStore()
    const location = useLocation()
    const currentPath = location.pathname

    useEffect(() => {
        loadMenuFromStorage()
        fetchMenu().catch(console.error)
    }, [])

    const allMenuItems = useMemo(() => {
        const transformed = transformAllMenuData(menuData, currentPath)
        return transformed.map(item => {
            let items = item.items
            if (items && typeof items === "object" && !Array.isArray(items)) {
                items = Object.values(items)
            }
            return {...item, items: items?.length > 0 ? items : null}
        })
    }, [menuData])

    const MAX_VISIBLE = 10
    const topItems = allMenuItems.slice(0, MAX_VISIBLE)
    const moreItems = allMenuItems.slice(MAX_VISIBLE).flatMap(item =>
        item.items ? item.items : [item]
    )

    const isActive = (url) => {
        if (!url) return false
        return url === currentPath || currentPath.startsWith(url + "/")
    }

    return (
        <Sidebar
            collapsible="icon"
            className="w-[72px] *:data-[sidebar=sidebar]:w-[72px]"
            {...props}
        >
            {/* ── Header: Logo & Nama Tenant ── */}
            <SidebarHeader className="px-2.5 pb-0 pt-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <NavTooltip label={
                            <div>
                                <p className="font-semibold">{userData?.tenant?.name || "Zyntera"}</p>
                                <p className=" text-[10px]">{userData?.tenant?.plan || "Administrator"}</p>
                            </div>
                        }>
                            <SidebarMenuButton
                                className="flex items-center justify-center h-auto py-2 px-1 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-150"
                            >
                                <div
                                    className="flex aspect-square h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shrink-0">
                                    <span className="text-base font-bold">
                                        {userData?.tenant?.name?.charAt(0)?.toUpperCase() || "Z"}
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </NavTooltip>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarSeparator className="mt-2 mx-auto w-10"/>
            </SidebarHeader>

            {/* ── Content: Nav Items ── */}
            <SidebarContent className="px-2 py-1">
                <SidebarMenu className="gap-0.5">
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <SidebarMenuItem key={i}>
                                <div className="flex items-center justify-center py-3 px-1 w-full">
                                    <Skeleton className="h-[22px] w-[22px] rounded-md"/>
                                </div>
                            </SidebarMenuItem>
                        ))
                    ) : (
                        <>
                            {topItems.map(item => {
                                const hasActiveChild = item.items?.some(c => isActive(c.url))
                                const itemActive = isActive(item.url) || hasActiveChild

                                if (item.items?.length > 0) {
                                    return (
                                        <NavItemFlyout
                                            key={item.title}
                                            item={item}
                                            isActive={itemActive}
                                            currentPath={currentPath}
                                        />
                                    )
                                }

                                return (
                                    <NavItem
                                        key={item.title}
                                        item={item}
                                        isActive={itemActive}
                                    />
                                )
                            })}

                            {moreItems.length > 0 && (
                                <MorePopover items={moreItems} currentPath={currentPath}/>
                            )}
                        </>
                    )}
                </SidebarMenu>
            </SidebarContent>

            {/* ── Footer: Bell + NavUser ── */}
            <SidebarFooter className="px-2 pb-3 pt-0">
                <SidebarSeparator className="mb-2 mx-auto w-10"/>
                <SidebarMenu className="gap-1">
                    <SidebarMenuItem>
                        <NavTooltip label="Notifikasi">
                            <SidebarMenuButton
                                className="relative flex items-center justify-center h-auto py-3 px-1 rounded-xl text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-150"
                            >
                                <div className="relative">
                                    <Bell className="h-[22px] w-[22px] shrink-0" strokeWidth={1.7}/>
                                    <span
                                        className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-destructive border-2 border-sidebar"/>
                                </div>
                            </SidebarMenuButton>
                        </NavTooltip>
                    </SidebarMenuItem>

                    <NavUser user={userData}/>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail/>
        </Sidebar>
    )
}