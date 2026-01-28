"use client"

import {
    BadgeCheck,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
    RotateCcw,
    ArrowUpDown,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {useAuthStore} from "@/store/authStore.js";
import {toast} from "sonner";
import {useState} from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger,
} from "@/components/ui/dialog.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Check} from "lucide-react";
import Pricing from "@/components/pricing/pricing.jsx";
import SwitchTenant from "@/components/tenants/switch-tenant.jsx";
import {useTenantStore} from "@/store/useTenantStore.js";
import {useRoleStore} from "@/store/useRoleStore.js";

export function NavUser({user}) {
    const {isMobile} = useSidebar()
    const {userData, logout} = useAuthStore();
    const [pricingOpen, setPricingOpen] = useState(false);
    const [openTenantContextModal, setOpenTenantContextModal] = useState(false);

    const {resetTenant} = useTenantStore();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            window.location.href = '/auth/login';
        } catch (error) {
            console.log(error);
            toast.error("Failed to logout");
        }
    };

    if (!user) {
        return (
            <div className="px-4 py-3 text-xs text-muted-foreground">
                Loading user...
            </div>
        );
    }

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
                                    <AvatarImage src={user.avatar} alt={user.name}/>
                                    <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
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
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user.avatar} alt={user.name}/>
                                        <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user.name}</span>
                                        <span className="truncate text-xs">{user.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setPricingOpen(true)}>
                                    <Sparkles/>
                                    Pricing
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <BadgeCheck/>
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard/>
                                    Billing
                                </DropdownMenuItem>
                                {
                                    !userData.meta?.is_switched ? (
                                        <DropdownMenuItem onClick={() => setOpenTenantContextModal(true)}>
                                            <ArrowUpDown/>
                                            Switch Merchant (For Testing Purpose)
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onClick={resetTenant}>
                                            <RotateCcw/>
                                            Revert to Super User
                                        </DropdownMenuItem>
                                    )
                                }
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={handleLogout}
                                              className="text-destructive focus:text-destructive">
                                <LogOut/>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
            <Dialog open={pricingOpen} onOpenChange={setPricingOpen}>
                <DialogContent className="max-w-[1200px]! w-[95vw] max-h-[90vh] overflow-y-auto p-8">
                    <Pricing/>
                </DialogContent>
            </Dialog>


            <Dialog open={openTenantContextModal} onOpenChange={setOpenTenantContextModal}>
                <form>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Ganti Merchant</DialogTitle>
                            <DialogDescription>
                                Ganti Merchant
                            </DialogDescription>
                        </DialogHeader>
                        <SwitchTenant/>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    )
}