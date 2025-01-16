import { TiktokLiveState } from '@/lib/types/liveInfo'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: TiktokLiveState = {
  roomInfo: undefined,
  liveIntro: undefined,
  linkMicBattle: undefined,
  linkMicArmies: undefined,
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
  },
})

export const { setRoomInfo, setLiveIntro, setMicArmies, setMicBattle } =
  liveInfo.actions
export default liveInfo.reducer
