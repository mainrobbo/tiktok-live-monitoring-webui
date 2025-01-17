import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatSetting, Settings } from '@/lib/types/stream-tools/chat-settings'
const initialState: Settings = {
  chatSetting: {
    fontSize: 16,
    messageSpacing: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    textColor: '#ffffff',
    showUserColors: true,
    maxMessages: 5,
    animationSpeed: 0.3,
    showTimestamp: true,
    timestampFormat: '24h',
    showAvatar: true,
    avatarSize: 32,
    fontFamily: 'Inter',
    containerWidth: 400,
    containerHeight: 300,
    messageAlignment: 'left',
    showBadges: true,
    showEmotes: true,
    containerPaddingTop: 2,
    containerPaddingBottom: 2,
    containerPaddingLeft: 2,
    containerPaddingRight: 2,
    appearPosition: 'bottom',
  },
}
const chatSettingState = createSlice({
  name: 'streamTools',
  initialState,
  reducers: {
    setChatSetting: (state, action: PayloadAction<Partial<ChatSetting>>) => {
      const preferences = action.payload

      if (state.chatSetting) {
        for (const [key, val] of Object.entries(preferences)) {
          if (key in state.chatSetting) {
            ;(state.chatSetting[key as keyof ChatSetting] as any) = val
          }
        }
      }
    },
  },
})

export const { setChatSetting } = chatSettingState.actions
export default chatSettingState.reducer
