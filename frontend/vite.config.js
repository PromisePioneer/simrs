import path from "node:path";
import {fileURLToPath} from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {tanstackRouter} from "@tanstack/router-plugin/vite";
import {defineConfig} from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        tanstackRouter({
            routesDirectory: "./src/routes",
            generatedRouteTree: "./src/routeTree.gen.ts",
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            // Alias utama — tetap ada agar import lama tidak langsung pecah
            "@": path.resolve(__dirname, "./src"),
            // Alias baru untuk feature-based architecture
            "@shared": path.resolve(__dirname, "./src/shared"),
            "@features": path.resolve(__dirname, "./src/features"),
        },
    },
});
