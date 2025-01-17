'use client'
import { Toaster } from 'sonner'
import AppNavbar from './app-navbar'
import { AppSidebar } from './app-sidebar'
import { SidebarProvider } from './ui/sidebar'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ThemeProvider } from 'next-themes'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme='dark' attribute='class'>
      <Provider store={store}>
        <SidebarProvider>
          <AppSidebar />
          <main className='w-full h-screen'>
            <AppNavbar />
            {children}
          </main>
          <Toaster richColors position='top-center' />
        </SidebarProvider>
      </Provider>
    </ThemeProvider>
  )
}
