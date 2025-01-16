import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ActivityType } from '@/lib/types/common'
import { LogData } from '@/lib/types/log'
import moment from 'moment'

export type LogEntry = {
  id: string
  timestamp: number
  data: LogData
}
export type LogsMap = {
  [key in ActivityType]: Map<string, LogEntry>
}

const initialState: LogsMap = {
  [ActivityType.LIKE]: new Map(),
  [ActivityType.COMMENT]: new Map(),
  [ActivityType.SHARE]: new Map(),
  [ActivityType.SOCIAL]: new Map(),
  [ActivityType.VIEW]: new Map(),
  [ActivityType.GIFT]: new Map(),
  [ActivityType.SUBSCRIBE]: new Map(),
  [ActivityType.MIC_ARMIES]: new Map(),
}

const MAX_LOGS_PER_TYPE = 1000

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLogs: {
      reducer: (state, action: PayloadAction<LogEntry[]>) => {
        action.payload.forEach(entry => {
          const logType = entry.data.log_type
          if (logType in state) {
            state[logType].set(entry.data.msgId, entry)

            // Remove oldest entries
            if (state[logType].size > MAX_LOGS_PER_TYPE) {
              const entries = Array.from(state[logType].entries())
              const sortedEntries = entries.sort(
                (a, b) => b[1].timestamp - a[1].timestamp,
              )
              state[logType] = new Map(
                sortedEntries.slice(0, MAX_LOGS_PER_TYPE),
              )
            }
          }
        })
      },

      prepare: (logs: LogData[]) => {
        const entries = logs.map(log => ({
          id: log.msgId,
          timestamp: parseInt(log.createTime) / 1000,
          data: log,
        }))
        return { payload: entries }
      },
    },
    cleanLogs: state => {
      Object.keys(state).forEach(key => {
        state[key as ActivityType].clear()
      })
    },
  },
})

export const { addLogs, cleanLogs } = logsSlice.actions
export default logsSlice.reducer
