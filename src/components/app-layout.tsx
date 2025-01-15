import { Toaster } from "sonner";
import AppNavbar from "./app-navbar";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import { AppProvider } from "./app-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppProvider>
                <AppSidebar />
                <main className="w-full h-screen">
                    <AppNavbar />
                    {children}
                </main>
                <Toaster richColors position="top-center" />
            </AppProvider>
        </SidebarProvider>
    )
}