import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ConnectionState = 'connecting' | 'connected' | 'idle'
interface Connection {
  connected: boolean
  live: boolean
  wsUrl: string
  proxyUrl?: string
  proxyTimeout: number
  state: ConnectionState
}

const initialState: Connection = {
  connected: false,
  live: false,
  wsUrl: '',
  proxyUrl: '127.0.0.1:8080',
  proxyTimeout: 10000,
  state: 'idle',
}

const connectionState = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload
    },
    setLive: (state, action: PayloadAction<boolean>) => {
      state.live = action.payload
    },
    setWSUrl: (state, action: PayloadAction<string>) => {
      state.wsUrl = action.payload
    },
    setProxyUrl: (state, action: PayloadAction<string>) => {
      state.proxyUrl = action.payload
    },
    setProxyTimeout: (state, action: PayloadAction<number>) => {
      state.proxyTimeout = action.payload
    },
    setState: (state, action: PayloadAction<ConnectionState>) => {
      state.state = action.payload
    },
  },
})

export const {
  setConnected,
  setLive,
  setWSUrl,
  setProxyTimeout,
  setProxyUrl,
  setState,
} = connectionState.actions
export default connectionState.reducer
