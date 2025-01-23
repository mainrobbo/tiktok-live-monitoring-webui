'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Separator } from './ui/separator'
import { BellRingIcon, MonitorCogIcon } from 'lucide-react'
import ExportButton from './button/export-button'
import { AppSettingPopover } from './app-settings'
import ConnectButton from './button/connect-button'
import PreferencesButton from './button/preferences-button'
import CleanButton from './button/clean-button'
import { UsernameInput } from './input'
import DisconnectButton from './button/disconnect-button'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function AppSidebar() {
  const [displayTemporary, setDisplayTemporary] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (pathname == '/') setDisplayTemporary(true)
  }, [])
  return (
    <Sidebar collapsible='offcanvas'>
      <SidebarHeader>
        <h1 className='text-xl text-center'>Advanced Tiktok Live</h1>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {displayTemporary && <UsernameInput />}
          {displayTemporary && (
            <div className='flex items-center mt-2 gap-1'>
              <ConnectButton />
              <DisconnectButton />
              <CleanButton />
              <AppSettingPopover />
            </div>
          )}
          <PreferencesButton />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <MonitorCogIcon />
                  Monitoring
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => router.push('/tools/chatOverlay')}
                >
                  <BellRingIcon />
                  Stream Overlay
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className='flex items-center'>
          {/* <Button size={"icon"}><DownloadIcon /></Button> */}
          <ExportButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
