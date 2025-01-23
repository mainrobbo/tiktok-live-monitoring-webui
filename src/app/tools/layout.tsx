import AppLayout from '@/components/app-layout'

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout>{children}</AppLayout>
}
