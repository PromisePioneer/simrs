import {create} from "zustand/react";
import apiCall from "@/services/apiCall.js";
import {
    House,
    SquareTerminal,
    Database,
    CalendarDays,
    Contact,
    Clipboard,
    ShoppingCart,
    Hospital,
    File,
    Settings
} from "lucide-react";

const iconMap = {
    '<House />': House,
    '<Database />': Database,
    '<CalendarDays />': CalendarDays,
    '<Contact />': Contact,
    '<Clipboard />': Clipboard,
    '<ShoppingCart />': ShoppingCart,
    '<Hospital />': Hospital,
    '<File />': File,
    '<Settings />': Settings,
};

export const useSidebarStore = create((set, get) => ({
    loading: false,
    isLoading: false,
    error: null,
    menuData: [],
    fetchMenu: async () => {
        const cached = localStorage.getItem('menuData');
        if (cached) {
            set({menuData: JSON.parse(cached), isLoading: false});
            return JSON.parse(cached);
        }

        set({isLoading: true});
        try {
            const response = await apiCall.get('/api/v1/modules');
            set({menuData: response.data, isLoading: false});
            localStorage.setItem('menuData', JSON.stringify(response.data));
            return response.data;
        } catch (e) {
            console.error(e);
            set({isLoading: false, error: e});
        }
    },
    getIconFromSvg: (iconString) => {
        if (!iconString) return SquareTerminal;
        if (iconMap[iconString]) {
            return iconMap[iconString];
        }

        return SquareTerminal;
    },
    transformAllMenuData: (menuData, currentPath) => {
        if (!menuData || !Array.isArray(menuData)) return [];

        return menuData.map(item => {
            const hasChildren = item.children_recursive && item.children_recursive.length > 0;
            const children = hasChildren ? item.children_recursive.map(child => ({
                title: child.name,
                url: child.route || "#",
            })) : null;

            const isCurrentPage = item.route === currentPath;
            const hasActiveChild = children?.some(child => child.url === currentPath);

            return {
                title: item.name,
                url: item.route || "#",
                icon: get().getIconFromSvg(item.icon),
                isActive: isCurrentPage,
                isOpen: hasActiveChild || isCurrentPage,
                items: children
            };
        });
    }
}));