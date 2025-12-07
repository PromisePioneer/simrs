"use client"

import * as React from "react"
import {
    Search,
    X
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

export function AppSidebar({...props}) {
    const {userData} = useAuthStore();
    const {fetchMenu, menuData, transformAllMenuData, loadMenuFromStorage} = useSidebarStore();
    const location = useLocation();
    const currentPath = location.pathname;
    const [searchQuery, setSearchQuery] = useState("");

    // Load menu on component mount
    useEffect(() => {
        // First, try to load from localStorage
        const cachedMenu = loadMenuFromStorage();

        // Then fetch fresh data from API
        fetchMenu().catch(error => {
            console.error('Failed to fetch menu:', error);
            // If fetch fails and we have cached data, we're still good
        });
    }, []);

    // Listen for storage events (when other tabs update localStorage)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'menuData' && e.newValue) {
                // Reload menu from localStorage when it changes
                loadMenuFromStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [loadMenuFromStorage]);

    // Custom event listener for same-tab updates
    useEffect(() => {
        const handleMenuUpdate = () => {
            loadMenuFromStorage();
        };

        window.addEventListener('menuUpdated', handleMenuUpdate);

        return () => {
            window.removeEventListener('menuUpdated', handleMenuUpdate);
        };
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
                            <a href="#">
                                <p className="text-2xl font-bold text-teal-500">Zyntera</p>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Search Input */}
                <div className="px-3 py-2">
                    <div className={props.collapsible ? "relative" : "hidden"}>
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
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4"/>
                            </button>
                        )}
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    {filteredMenuItems.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No menu items found
                        </div>
                    ) : (
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
                                            <SidebarMenuItem className="pb-2">
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
                                                                item.items?.some(child => isPathActive(child.url, location.pathname)) ? "font-bold text-teal-600" : ""}
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
                                                                                className={isSubItemActive ? "font-bold text-teal-600" : ""}>
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
                                    <SidebarMenuItem key={item.title} className="pb-2">
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={isItemActive}
                                        >
                                            <Link to={item.url}>
                                                {Icon && <Icon/>}
                                                <span className={isItemActive ? "font-bold" : ""}>
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