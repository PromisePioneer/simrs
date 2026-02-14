"use client"

import * as React from "react"
import {
    Search,
    X,
    Loader2,
    AlertCircle
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarRail,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import {useSidebarStore} from "@/store/useSidebarStore.js";
import {useEffect, useMemo, useState} from "react";
import {ChevronRight} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {Link, useLocation} from "@tanstack/react-router";
import {NavUser} from "@/components/sidebar/nav-user.jsx";
import {useAuthStore} from "@/store/authStore.js";
import {Input} from "@/components/ui/input.jsx";
import {Skeleton} from "@/components/ui/skeleton.jsx";

export function AppSidebar({...props}) {
    const {userData} = useAuthStore();
    const {fetchMenu, menuData, transformAllMenuData, loadMenuFromStorage, isLoading} = useSidebarStore();
    const location = useLocation();
    const currentPath = location.pathname;
    const [searchQuery, setSearchQuery] = useState("");
    const [hasError, setHasError] = useState(false);

    // Load menu on component mount
    useEffect(() => {
        const cachedMenu = loadMenuFromStorage();

        fetchMenu().catch(error => {
            console.error('Failed to fetch menu:', error);
            if (!cachedMenu || cachedMenu.length === 0) {
                setHasError(true);
            }
        });
    }, []);

    // Listen for storage events
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'menuData' && e.newValue) {
                loadMenuFromStorage();
                setHasError(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadMenuFromStorage]);

    // Custom event listener
    useEffect(() => {
        const handleMenuUpdate = () => {
            loadMenuFromStorage();
            setHasError(false);
        };

        window.addEventListener('menuUpdated', handleMenuUpdate);
        return () => window.removeEventListener('menuUpdated', handleMenuUpdate);
    }, [loadMenuFromStorage]);

    const isPathActive = (menuUrl, currentPath) => {
        if (!menuUrl || !currentPath) return false;
        if (menuUrl === currentPath) return true;
        return currentPath.startsWith(menuUrl + "/");
    };

    const allMenuItems = useMemo(() => {
        const transformed = transformAllMenuData(menuData, currentPath);

        return transformed.map(item => {
            let items = item.items;
            if (items && typeof items === 'object' && !Array.isArray(items)) {
                items = Object.values(items);
            }

            return {
                ...item,
                items: items && items.length > 0 ? items : null
            };
        });
    }, [menuData, currentPath, transformAllMenuData]);

    const filteredMenuItems = useMemo(() => {
        if (!searchQuery.trim()) {
            return allMenuItems.map(item => {
                const hasActiveChild = item.items?.some(child =>
                    isPathActive(child.url, location.pathname)
                );
                return {
                    ...item,
                    isOpen: hasActiveChild || item.isOpen
                };
            });
        }

        const query = searchQuery.toLowerCase();

        return allMenuItems
            .map(item => {
                const parentMatches = item.title.toLowerCase().includes(query);

                const matchedChildren = item.items
                    ? item.items.filter(child =>
                        child.title.toLowerCase().includes(query)
                    )
                    : null;

                if (parentMatches || (matchedChildren && matchedChildren.length > 0)) {
                    return {
                        ...item,
                        items: parentMatches ? item.items : matchedChildren,
                        isOpen: true
                    };
                }

                return null;
            })
            .filter(Boolean);
    }, [allMenuItems, searchQuery, location.pathname]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#" className="flex items-center gap-2">
                                <div
                                    className="flex aspect-square size-9 items-center justify-center rounded-lg bg-teal-600 text-white">
                                    <span className="text-lg font-bold">
                                        {userData?.tenant?.name?.charAt(0) || 'Z'}
                                    </span>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold text-sm">
                                        {userData?.tenant?.name || 'Zyntera'}
                                    </span>
                                    <span className="truncate text-sm text-muted-foreground">
                                        {userData?.tenant?.plan || 'Administrator'}
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Search Input */}
                <div className="px-3 py-2">
                    <div className="relative group-data-[collapsible=icon]:hidden">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                        <Input
                            type="text"
                            placeholder="Search menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-8 h-9"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4"/>
                            </button>
                        )}
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    {/* Loading State */}
                    {isLoading && (
                        <div className="space-y-2 px-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-10 w-full"/>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {!isLoading && hasError && (
                        <div className="px-4 py-8 text-center">
                            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                            <p className="text-sm font-medium text-foreground mb-1">
                                Failed to load menu
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                                Please refresh the page
                            </p>
                            <button
                                onClick={() => {
                                    setHasError(false);
                                    fetchMenu().catch(() => setHasError(true));
                                }}
                                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State (No Search Results) */}
                    {!isLoading && !hasError && filteredMenuItems.length === 0 && searchQuery && (
                        <div className="px-4 py-8 text-center">
                            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                            <p className="text-sm font-medium text-foreground mb-1">
                                No results found
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Try searching with different keywords
                            </p>
                        </div>
                    )}

                    {/* Empty State (No Menu Items) */}
                    {!isLoading && !hasError && filteredMenuItems.length === 0 && !searchQuery && (
                        <div className="px-4 py-8 text-center">
                            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                            <p className="text-sm font-medium text-foreground mb-1">
                                No menu items
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Contact administrator for access
                            </p>
                        </div>
                    )}

                    {/* Menu Items */}
                    {!isLoading && !hasError && filteredMenuItems.length > 0 && (
                        <SidebarMenu>
                            {filteredMenuItems.map((item) => {
                                const Icon = item.icon;

                                if (item.items && item.items.length > 0) {
                                    return (
                                        <Collapsible
                                            key={item.title}
                                            asChild
                                            defaultOpen={item.isOpen}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        isActive={item.isActive || item.items?.some(child => isPathActive(child.url, location.pathname))}
                                                    >
                                                        {Icon && <Icon/>}
                                                        <span
                                                            className={
                                                                item.isActive
                                                                ||
                                                                item.items?.some(child => isPathActive(child.url, location.pathname)) ? "font-semibold" : ""}
                                                        >
                                                            {item.title}
                                                        </span>
                                                        <ChevronRight
                                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                                        />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.items.map((subItem) => {
                                                            const isSubItemActive = isPathActive(subItem.url, location.pathname);

                                                            return (
                                                                <SidebarMenuSubItem key={subItem.title}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isSubItemActive}
                                                                    >
                                                                        <Link to={subItem.url}>
                                                                            <span
                                                                                className={isSubItemActive ? "font-semibold" : ""}>
                                                                                {subItem.title}
                                                                            </span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                }

                                const isItemActive = isPathActive(item.url, location.pathname);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={isItemActive}
                                        >
                                            <Link to={item.url}>
                                                {Icon && <Icon/>}
                                                <span className={isItemActive ? "font-semibold" : ""}>
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    )}
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={userData}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
}