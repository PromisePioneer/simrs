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
import {useSidebarStore} from "@/store/sidebarStore.js";
import {useEffect, useMemo, useState} from "react";
import {ChevronRight} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {Link, useLocation} from "react-router-dom";
import {NavUser} from "@/components/sidebar/nav-user.jsx";
import {useAuthStore} from "@/store/authStore.js";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import {Input} from "@/components/ui/input.jsx";

export function AppSidebar({...props}) {
    const {userData} = useAuthStore();
    const {fetchMenu, menuData, transformAllMenuData} = useSidebarStore();
    const location = useLocation();
    const currentPath = location.pathname;
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchMenu();
    }, [fetchMenu]);

    const allMenuItems = useMemo(() => {
        return transformAllMenuData(menuData, currentPath);
    }, [menuData, currentPath]);

    const filteredMenuItems = useMemo(() => {
        if (!searchQuery.trim()) {
            return allMenuItems;
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
    }, [allMenuItems, searchQuery]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-xl font-bold text-teal-500">Zyntera</p>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Search Input */}
                <div className="px-3 py-2">
                    <div className="relative">
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
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        isActive={item.isActive || item.items?.some(child => child.url === location.pathname)}
                                                    >
                                                        {Icon && <Icon/>}
                                                        <span
                                                            className={
                                                                item.isActive
                                                                ||
                                                                item.items?.some(child => child.url === location.pathname) ? "font-bold text-teal-600" : ""}
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
                                                            const isSubItemActive = location.pathname === subItem.url;

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

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={item.isActive}
                                        >
                                            <Link to={item.url}>
                                                {Icon && <Icon/>}
                                                <span className={item.isActive ? "font-bold" : ""}>
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