'use client'
import ChatOverlay from '@/components/views/tools/chat-overlay'
import { store } from '@/store'
import { Provider } from 'react-redux'

export default function StreamingTools() {
  return (
    <Provider store={store}>
      <ChatOverlay />
    </Provider>
  )
}
