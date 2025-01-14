import { Toaster } from "sonner";
import AppContextProvider from "./app-context";
import AppNavbar from "./app-navbar";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppContextProvider>
                <AppSidebar />
                <main className="w-full h-screen">
                    <AppNavbar />
                    {children}
                </main>
                <Toaster richColors position="top-center" />
            </AppContextProvider>
        </SidebarProvider>
    )
}