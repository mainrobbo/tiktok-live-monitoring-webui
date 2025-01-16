import { PreferencesState } from '@/lib/types/common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const initialState: PreferencesState = {
  show_gift_level_badge: true,
  show_mod_badge: true,
  show_relation_status: true,
  show_relative_timestamp: false,
}

const preferencesState = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setPreferences: (
      state,
      action: PayloadAction<Partial<PreferencesState>>,
    ) => {
      const preferences = action.payload
      for (const [key, val] of Object.entries(preferences)) {
        if (key in state) {
          state[key as keyof PreferencesState] = val
        }
      }
    },
  },
})

export const { setPreferences } = preferencesState.actions
export default preferencesState.reducer
