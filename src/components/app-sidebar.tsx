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
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { BellRingIcon, ChartBarBigIcon, ChevronDown, TrashIcon, } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useContext } from "react"
import { AppContext } from "./app-context"
import ExportButton from "./button/export-button"
import { AppSettingPopover } from "./app-settings"
import CurrentStatistic from "./views/current-stats"
import ConnectButton from "./button/connect-button"
import PreferencesButton from "./button/preferences-button"
import CleanButton from "./button/clean-button"

export function AppSidebar() {
    const {
        username, setUsername,
        isConnectedToServer,
        handleDisconnectButtonClick
    } = useContext(AppContext);

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
                    <Input
                        placeholder="@Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isConnectedToServer}
                    />
                    <div className="flex items-center mt-2 gap-1">
                        <ConnectButton />
                        <Button
                            disabled={!isConnectedToServer}
                            onClick={handleDisconnectButtonClick}
                            variant={"destructive"}
                            size={"sm"}>
                            Stop
                        </Button>
                        <CleanButton />
                        <AppSettingPopover />
                    </div>
                    <PreferencesButton />
                </SidebarGroup>
                <Collapsible defaultOpen={true} className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger>
                                Statistic
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <CurrentStatistic />
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
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
