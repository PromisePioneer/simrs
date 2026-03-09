import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import * as LucideIcons from 'lucide-react';


export const useSidebarStore = create((set, get) => ({
    isLoading: false,
    error: null,
    menuData: null,
    isOpen: true,
    isFetched: false,

    toggleSidebar: () => {
        set((state) => ({isOpen: !state.isOpen}));
    },

    setSidebarOpen: (isOpen) => {
        set({isOpen});
    },

    fetchMenu: async () => {
        if (get().isFetched) return get().menuData;

        set({isLoading: true, error: null, isFetched: true});
        try {
            const response = await apiCall.get("/api/v1/modules");
            const menuData = response.data;

            localStorage.setItem('menuData', JSON.stringify(menuData));

            set({
                menuData,
                isLoading: false,
                error: null,
            });

            return menuData;
        } catch (e) {
            set({error: e, isLoading: false, isFetched: false});
            throw e;
        }
    },

    loadMenuFromStorage: () => {
        try {
            const storedMenu = localStorage.getItem('menuData');
            if (storedMenu) {
                const menuData = JSON.parse(storedMenu);
                set({menuData});
                return menuData;
            }
            return null;
        } catch (e) {
            console.error('Error loading menu from storage:', e);
            return null;
        }
    },

    refreshMenu: async () => {
        set({isFetched: false});
        return await get().fetchMenu();
    },

    clearMenu: () => {
        localStorage.removeItem('menuData');
        set({menuData: null, isFetched: false});
    },

    transformAllMenuData: (menuData, currentPath) => {
        if (!menuData || !Array.isArray(menuData)) return [];

        const transformItem = (item) => {
            const hasChildren = item.children_recursive && item.children_recursive.length > 0;
            return {
                title: item.name,
                url: item.route || '#',
                icon: LucideIcons[item.icon] || LucideIcons.Menu,
                isActive: item.route === currentPath,
                isOpen: false,
                items: hasChildren
                    ? item.children_recursive.map(child => transformItem(child))
                    : null
            };
        };

        return menuData.map(item => transformItem(item));
    },
}));