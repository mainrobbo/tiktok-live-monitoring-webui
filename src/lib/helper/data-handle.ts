import { throttle } from 'lodash'
import { LogData } from '../types/log'
import { addLogs } from '@/store/logsSlice'
import { Dispatch } from '@reduxjs/toolkit'
import { ActivityType } from '../types/common'

export const createBatcher = (dispatch: Dispatch) => {
  let batches: { [key in ActivityType]?: LogData[] } = {}

  const processQueue = throttle(() => {
    const allLogs = Object.values(batches).flat()
    if (allLogs.length > 0) {
      dispatch(addLogs(allLogs))
      batches = {} // Clear all batches
    }
  }, 100)

  return {
    add: (log: LogData) => {
      const type = log.log_type
      if (!batches[type]) {
        batches[type] = []
      }
      batches[type]!.push(log)
      processQueue()
    },
  }
}

export const beforeAddLog = <T extends LogData>(
  data: T,
  batcher: ReturnType<typeof createBatcher>,
) => {
  if (
    data &&
    (data.log_type == ActivityType.MIC_ARMIES ||
      (data.userId && data.uniqueId && data.followInfo && data.userDetails))
  ) {
    batcher.add(data)
  }
}
