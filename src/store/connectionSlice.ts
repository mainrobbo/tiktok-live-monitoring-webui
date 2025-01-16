import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConnectionState {
  connected: boolean;
  live: boolean;
  wsUrl: string;
  proxyUrl?: string;
  proxyTimeout: number;
}

const initialState: ConnectionState = {
  connected: false,
  live: false,
  wsUrl: "",
  proxyUrl: "127.0.0.1:8080",
  proxyTimeout: 10000,
};

const connectionState = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setLive: (state, action: PayloadAction<boolean>) => {
      state.live = action.payload;
    },
    setWSUrl: (state, action: PayloadAction<string>) => {
      state.wsUrl = action.payload;
    },
    setProxyUrl: (state, action: PayloadAction<string>) => {
      state.proxyUrl = action.payload;
    },
    setProxyTimeout: (state, action: PayloadAction<number>) => {
      state.proxyTimeout = action.payload;
    },
  },
});

export const { setConnected, setLive, setWSUrl, setProxyTimeout, setProxyUrl } =
  connectionState.actions;
export default connectionState.reducer;
