import { configureStore } from '@reduxjs/toolkit'
import logsReducer from './logsSlice'
import websocketMiddleware from '@/components/websocket/middleware'
import settingReducer from './settingSlice'
import connectionReducer from './connectionSlice'
import preferencesReducer from './preferencesSlice'
import liveInfoReducer from './liveInfoSlice'
import streamToolsReducer from './streamToolsSlice'
import { enableMapSet } from 'immer'

enableMapSet()
export const store = configureStore({
  reducer: {
    logs: logsReducer,
    setting: settingReducer,
    connection: connectionReducer,
    preferences: preferencesReducer,
    liveInfo: liveInfoReducer,
    streamTools: streamToolsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['logs'],
      },
    }).concat(websocketMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
