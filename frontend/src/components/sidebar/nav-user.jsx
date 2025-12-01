"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Sparkles,
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
    DialogTitle,
} from "@/components/ui/dialog.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Check} from "lucide-react";

export function NavUser({user}) {
    const {isMobile} = useSidebar()
    const {logout} = useAuthStore();
    const [pricingOpen, setPricingOpen] = useState(false);

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

    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "forever",
            description: "For small teams trying out Slack for an unlimited period of time",
            features: [
                "90 days of message history",
                "10 integrations with other apps",
                "1-on-1 video calls",
                "File sharing and storage",
            ],
            buttonText: "Get Started",
            buttonVariant: "outline"
        },
        {
            name: "Pro",
            price: "$7.25",
            period: "per month",
            description: "For small to medium-sized businesses looking to boost productivity",
            features: [
                "Unlimited message history",
                "Unlimited integrations",
                "Group video calls with screen sharing",
                "Priority 24/7 support",
                "Advanced security and compliance",
            ],
            buttonText: "Start Free Trial",
            buttonVariant: "default",
            popular: true
        },
        {
            name: "Business+",
            price: "$12.50",
            period: "per month",
            description: "For larger businesses that need enhanced security and dedicated support",
            features: [
                "Everything in Pro, plus:",
                "99.99% guaranteed uptime SLA",
                "Data exports for all messages",
                "SAML-based single sign-on (SSO)",
                "24/7 support with 4-hour response time",
            ],
            buttonText: "Start Free Trial",
            buttonVariant: "outline"
        }
    ];

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
                                <DropdownMenuItem>
                                    <Bell/>
                                    Notifications
                                </DropdownMenuItem>
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
                <DialogContent className="!max-w-[1200px] w-[95vw] max-h-[90vh] overflow-y-auto p-8">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-center">Choose the right plan for your
                            team</DialogTitle>
                        <DialogDescription className="text-center text-base pt-2">
                            All plans include a free trial. Cancel anytime.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-lg border-2 p-6 flex flex-col ${
                                    plan.popular
                                        ? 'border-teal-600 shadow-lg'
                                        : 'border-gray-200'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span
                                            className="bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-gray-500 text-sm">/ {plan.period}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 min-h-[48px]">{plan.description}</p>
                                </div>

                                <ul className="space-y-3 mb-6 flex-grow">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5"/>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={plan.buttonVariant}
                                    className={`w-full ${
                                        plan.buttonVariant === 'default'
                                            ? 'bg-teal-600 hover:bg-teal-700'
                                            : 'border-2 hover:bg-gray-50'
                                    }`}
                                >
                                    {plan.buttonText}
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-center text-sm text-gray-600">
                            Need more than 100 users? <a href="#" className="text-teal-600 hover:underline font-medium">Contact
                            sales</a> for Enterprise pricing
                        </p>
                    </div>

                    <DialogFooter className="sm:justify-center">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}