import { LogEntry } from '@/store/logsSlice'
import moment from 'moment'
import { ActivityType } from '../types/common'

type ItemWithKey<T> = {
  [key: string]: any
} & T

export function removeDuplicates<T>(
  array: ItemWithKey<T>[],
  key: keyof T,
): ItemWithKey<T>[] {
  const seen = new Set()
  return array.filter(item => {
    const keyValue = item[key]
    if (seen.has(keyValue)) {
      return false
    } else {
      seen.add(keyValue)
      return true
    }
  })
}

export const getMinutesData = (data: LogEntry[], period = 3) => {
  return data
    .sort((a, b) => parseInt(a.data.createTime) - parseInt(b.data.createTime))
    .reduce((result, current) => {
      const {
        createTime: t,
        log_type,
        likeCount,
        repeatEnd,
        giftType,
        repeatCount,
        currentViewers,
        isStreak,
      } = current.data

      const timestamp = moment.unix(parseInt(t) / 1000)
      const bucketStartTime = timestamp
        .startOf('minute')
        .subtract(timestamp.minute() % period, 'minutes')
        .format('HH:mm')

      if (!result[bucketStartTime]) {
        result[bucketStartTime] = {
          like: 0,
          comment: 0,
          share: 0,
          follow: 0,
          view: 0,
          gift: 0,
          currentViewers: 0,
          subscribe: 0,
          mic_armies: 0,
          rawTime: t,
          totalActivities: 0,
        }
      }
      if (log_type == ActivityType.LIKE) {
        result[bucketStartTime].like++
        result[bucketStartTime].totalActivities++
      }
      if (log_type == ActivityType.COMMENT) {
        result[bucketStartTime].comment++
        result[bucketStartTime].totalActivities++
      }
      if (log_type == ActivityType.SHARE) {
        result[bucketStartTime].share++
        result[bucketStartTime].totalActivities++
      }
      if (log_type == ActivityType.FOLLOW) {
        result[bucketStartTime].follow++
        result[bucketStartTime].totalActivities++
      }
      if (log_type == ActivityType.VIEW) {
        result[bucketStartTime].totalActivities++

        result[bucketStartTime].view++
      }
      if (log_type == ActivityType.SUBSCRIBE) {
        result[bucketStartTime].totalActivities++

        result[bucketStartTime].subscribe++
      }
      if (log_type == ActivityType.GIFT && !(giftType == 1 && !repeatEnd)) {
        result[bucketStartTime].totalActivities++

        result[bucketStartTime].gift++
      }
      if (log_type == ActivityType.MIC_ARMIES) {
        result[bucketStartTime].totalActivities++

        result[bucketStartTime].mic_armies++
      }
      result[bucketStartTime].currentViewers = currentViewers

      return result
    }, {} as { [key: string]: any })
}
export const simplifyNumber = (value: number) => {
  let pembilangan = ''
  if (value >= 1_000_000) {
    pembilangan = 'M'
    value = value / 1_000_000
  } else if (value >= 10_000) {
    pembilangan = 'K'
    value = value / 1_000
  }
  return { value, pembilangan }
}
