'use client'
import { store } from '@/store'
import { Provider } from 'react-redux'

export default function StreamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider store={store}>{children}</Provider>
}
