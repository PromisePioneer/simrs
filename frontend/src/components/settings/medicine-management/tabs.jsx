import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.jsx";
import {useNavigate} from "@tanstack/react-router";
import {usePermission} from "@/hooks/usePermission.js";
import {Lock} from "lucide-react";
import {toast} from "sonner";

export function PermissionTabs({
                                   activeTab,
                                   tabs,
                                   className = "",
                                   tabsListClassName = "",
                                   tabContentClassName = "mt-6",
                                   variant = "underline", // "default" or "underline"
                                   onTabChange = null,
                               }) {
    const navigate = useNavigate();
    const {hasPermission} = usePermission();

    const tabsWithPermissions = tabs.map(tab => ({
        ...tab,
        hasAccess: hasPermission(tab.permission)
    }));

    const handleTabChange = (value) => {
        const selectedTab = tabsWithPermissions.find(tab => tab.key === value);

        if (!selectedTab?.hasAccess) {
            toast.error('Akses Ditolak', {
                description: 'Anda tidak memiliki izin untuk mengakses tab ini.'
            });
            return;
        }

        if (onTabChange) {
            onTabChange(value);
        } else {
            navigate({
                to: '.',
                search: (prev) => ({...prev, tab: value})
            });
        }
    };

    return (
        <div className={className}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList
                    className={
                        variant === "underline"
                            ? `inline-flex h-10 items-center justify-start rounded-none border-b bg-transparent p-0 ${tabsListClassName}`
                            : `grid w-full max-w-lg grid-cols-${tabs.length} ${tabsListClassName}`
                    }
                >
                    {tabsWithPermissions.map(tab => (
                        <TabsTrigger
                            key={tab.key}
                            value={tab.key}
                            disabled={!tab.hasAccess}
                            className={
                                variant === "underline"
                                    ? "relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-teal-500 data-[state=active]:text-teal-500 data-[state=active]:shadow-none hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                    : "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            }
                        >
                            <span className="flex text-base items-center gap-2">
                                {tab.label}
                                {!tab.hasAccess && <Lock className="w-3 h-3"/>}
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabsWithPermissions.map(tab => {
                    const TabComponent = tab.component;
                    return (
                        <TabsContent
                            key={tab.key}
                            value={tab.key}
                            className={tabContentClassName}
                        >
                            {TabComponent && <TabComponent/>}
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}