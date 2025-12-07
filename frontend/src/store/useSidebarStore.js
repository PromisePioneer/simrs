import {create} from "zustand";
import apiCall from "@/services/apiCall.js";
import * as LucideIcons from 'lucide-react';


export const useSidebarStore = create((set, get) => ({
    isLoading: false,
    error: null,
    menuData: null,
    isOpen: true,

    // Toggle sidebar
    toggleSidebar: () => {
        set((state) => ({isOpen: !state.isOpen}));
    },

    // Set sidebar state
    setSidebarOpen: (isOpen) => {
        set({isOpen});
    },

    // Fetch menu from API
    fetchMenu: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await apiCall.get("/api/v1/modules");
            const menuData = response.data;

            // Save to localStorage
            localStorage.setItem('menuData', JSON.stringify(menuData));

            set({
                menuData: menuData,
                isLoading: false,
                error: null
            });

            return menuData;
        } catch (e) {
            set({
                error: e,
                isLoading: false
            });
            throw e;
        }
    },

    // Load menu from localStorage
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


    // Refresh menu (fetch new data and update localStorage)
    refreshMenu: async () => {
        return await get().fetchMenu();
    },

    // Clear menu data
    clearMenu: () => {
        localStorage.removeItem('menuData');
        set({menuData: null});
    },

    // Transform menu data for display
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