import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ActivityType } from '@/lib/types/common'
import { LogData } from '@/lib/types/log'

const MAX_LOGS_PER_TYPE = 1000

export type LogsState = {
  [key in ActivityType]: LogData[]
}

const initialState: LogsState = {
  [ActivityType.LIKE]: [],
  [ActivityType.COMMENT]: [],
  [ActivityType.SHARE]: [],
  [ActivityType.SOCIAL]: [],
  [ActivityType.VIEW]: [],
  [ActivityType.GIFT]: [],
  [ActivityType.SUBSCRIBE]: [],
  [ActivityType.MIC_ARMIES]: [],
}

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLogs(state, action: PayloadAction<LogData[]>) {
      action.payload.forEach(log => {
        const logType = log.log_type
        if (logType in state) {
          state[logType] = [...state[logType], log]
          if (state[logType].length > MAX_LOGS_PER_TYPE) {
            state[logType] = state[logType].slice(-MAX_LOGS_PER_TYPE)
          }
        }
      })
    },
    cleanLogs: state => {
      Object.keys(state).forEach(key => {
        ;(state[key as keyof LogsState] as LogData[]) = []
      })
    },
    clearOldest: (
      state,
      action: PayloadAction<{ type: ActivityType; count: number }>,
    ) => {
      const { type, count } = action.payload
      if (type in state) {
        state[type] = state[type].slice(count)
      }
    },
  },
})

export const { addLogs, cleanLogs, clearOldest } = logsSlice.actions
export default logsSlice.reducer
