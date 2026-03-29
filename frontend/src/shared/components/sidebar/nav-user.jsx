"use client"

import {
    ChevronsUpDown, CreditCard,
    LogOut, Sparkles, RotateCcw, ArrowUpDown, Crown,
} from "lucide-react"
import {Avatar, AvatarFallback, AvatarImage} from "@shared/components/ui/avatar"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@shared/components/ui/sidebar"
import {useAuthStore} from "@features/auth"
import {toast} from "sonner"
import {useState, useEffect} from "react"
import {Dialog, DialogContent} from "@shared/components/ui/dialog.jsx"
import {Badge} from "@shared/components/ui/badge.jsx"
import SwitchTenant from "@shared/components/tenants/switch-tenant.jsx"
import {useTenantStore} from "@shared/store"
import {useNavigate} from "@tanstack/react-router"
import UpgradePage from "@features/upgrade/pages/index.jsx"

const PLAN_BADGE = {
    free:  {label: "Free",  className: "bg-muted text-muted-foreground"},
    basic: {label: "Basic", className: "bg-primary/10 text-primary"},
    pro:   {label: "Pro",   className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"},
}

export function NavUser({user}) {
    const {isMobile} = useSidebar()
    const {userData, logout} = useAuthStore()
    const {resetTenant} = useTenantStore()
    const navigate = useNavigate()

    const [upgradeOpen, setUpgradeOpen] = useState(false)
    const [openTenantContextModal, setOpenTenantContextModal] = useState(false)

    // Listen event dari apiCall interceptor saat 403 upgrade
    useEffect(() => {
        const handler = () => setUpgradeOpen(true)
        window.addEventListener('open-upgrade-modal', handler)
        return () => window.removeEventListener('open-upgrade-modal', handler)
    }, [])

    const planSlug = userData?.subscription?.plan?.slug ?? "free"
    const planBadge = PLAN_BADGE[planSlug] ?? PLAN_BADGE.free
    const isSuperAdmin = userData?.roles?.some(r =>
        (typeof r === "string" ? r : r?.name) === "Super Admin"
    )

    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Logged out successfully")
            window.location.href = "/auth/login"
        } catch {
            toast.error("Failed to logout")
        }
    }

    if (!user) return null

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.profile_picture} alt={user.name}/>
                                    <AvatarFallback className="rounded-lg">
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4"/>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            {/* User info */}
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user.profile_picture} alt={user.name}/>
                                        <AvatarFallback className="rounded-lg">
                                            {user.name?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>
                                {/* Plan badge — sembunyikan untuk Super Admin */}
                                {!isSuperAdmin && (
                                    <div className="px-2 pb-1.5">
                                        <Badge className={`text-xs ${planBadge.className}`}>
                                            {planSlug === "pro" && <Crown className="w-3 h-3 mr-1"/>}
                                            Paket {planBadge.label}
                                        </Badge>
                                    </div>
                                )}
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator/>

                            {/* Upgrade — hanya untuk non-Super Admin */}
                            {!isSuperAdmin && (
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() => setUpgradeOpen(true)}
                                        className={planSlug === "pro"
                                            ? "text-yellow-600 focus:text-yellow-600"
                                            : "text-primary focus:text-primary"
                                        }
                                    >
                                        <Sparkles className="w-4 h-4"/>
                                        {planSlug === "pro" ? "Kelola Paket" : "Upgrade Paket"}
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            )}

                            <DropdownMenuSeparator/>

                            <DropdownMenuGroup>
                                {!isSuperAdmin && (
                                    <DropdownMenuItem onClick={() => setUpgradeOpen(true)}>
                                        <CreditCard/>
                                        Billing
                                    </DropdownMenuItem>
                                )}
                                {!userData?.meta?.is_switched ? (
                                    <DropdownMenuItem onClick={() => setOpenTenantContextModal(true)}>
                                        <ArrowUpDown/>
                                        Switch Merchant
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={resetTenant}>
                                        <RotateCcw/>
                                        Revert to Super User
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator/>

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-destructive focus:text-destructive"
                            >
                                <LogOut/>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            {/* Upgrade modal */}
            <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
                <DialogContent className="max-w-5xl! w-[95vw] max-h-[90vh] overflow-y-auto p-0">
                    <UpgradePage inModal onClose={() => setUpgradeOpen(false)}/>
                </DialogContent>
            </Dialog>

            {/* Switch tenant modal */}
            <Dialog open={openTenantContextModal} onOpenChange={setOpenTenantContextModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <SwitchTenant/>
                </DialogContent>
            </Dialog>
        </>
    )
}