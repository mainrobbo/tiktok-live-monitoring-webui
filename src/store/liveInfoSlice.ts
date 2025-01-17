import { TiktokLiveState } from '@/lib/types/liveInfo'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: TiktokLiveState = {
  roomInfo: undefined,
  liveIntro: undefined,
  linkMicBattle: undefined,
  linkMicArmies: undefined,
  viewers: 0,
}

const liveInfo = createSlice({
  name: 'tiktok',
  initialState,
  reducers: {
    setRoomInfo: (state, action: PayloadAction<any>) => {
      state.roomInfo = action.payload
    },
    setLiveIntro: (state, action: PayloadAction<any>) => {
      state.liveIntro = action.payload
    },
    setMicBattle: (
      state,
      action: PayloadAction<TiktokLiveState['linkMicBattle']>,
    ) => {
      state.linkMicBattle = action.payload
    },
    setMicArmies: (
      state,
      action: PayloadAction<TiktokLiveState['linkMicArmies']>,
    ) => {
      state.linkMicArmies = action.payload
    },
    setViewers: (state, action: PayloadAction<number>) => {
      state.viewers = action.payload
    },
  },
})

export const {
  setRoomInfo,
  setLiveIntro,
  setMicArmies,
  setMicBattle,
  setViewers,
} = liveInfo.actions
export default liveInfo.reducer
