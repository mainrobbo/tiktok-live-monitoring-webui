"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "./ui/separator"
import { BellRingIcon, ChartBarBigIcon, } from "lucide-react"
import ExportButton from "./button/export-button"
import { AppSettingPopover } from "./app-settings"
import ConnectButton from "./button/connect-button"
import PreferencesButton from "./button/preferences-button"
import CleanButton from "./button/clean-button"
import { UsernameInput } from "./input"
import DisconnectButton from "./button/disconnect-button"

export function AppSidebar() {

    return (
        <Sidebar>
            <SidebarHeader>
                <h1 className="text-xl text-center">
                    Advanced Tiktok Live
                </h1>
                <Separator />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <UsernameInput />
                    <div className="flex items-center mt-2 gap-1">
                        <ConnectButton />
                        <DisconnectButton />
                        <CleanButton />
                        <AppSettingPopover />
                    </div>
                    <PreferencesButton />
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton disabled>
                                    <BellRingIcon />Stream Overlay
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton disabled>
                                    <ChartBarBigIcon />Streaming Graph
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center">
                    {/* <Button size={"icon"}><DownloadIcon /></Button> */}
                    <ExportButton />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
