import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  username: string
}

const initialState: UserState = {
  username: '',
}

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
  },
})

export const { setUsername } = settingSlice.actions
export default settingSlice.reducer
