'use client'
import { ActivityType } from '@/lib/types/common'
import { RootState } from '@/store'
import { LogEntry } from '@/store/logsSlice'
import { createSelector } from '@reduxjs/toolkit'
const DEFAULT_LIMIT = 20
const getLimited = (log: LogEntry[], limit = DEFAULT_LIMIT) =>
  log
    .sort((a, b) => parseInt(b.data.createTime) - parseInt(a.data.createTime))
    .slice(0, limit)
export const comments = ({ logs }: RootState) => logs[ActivityType.COMMENT]
export const views = ({ logs }: RootState) => logs[ActivityType.VIEW]
export const share = ({ logs }: RootState) => logs[ActivityType.SHARE]
export const follow = ({ logs }: RootState) => logs[ActivityType.FOLLOW]
export const gift = ({ logs }: RootState) => logs[ActivityType.GIFT]
export const subscribe = ({ logs }: RootState) => logs[ActivityType.SUBSCRIBE]
export const logs = ({ logs }: RootState) => logs
export const likes = ({ logs }: RootState) => logs[ActivityType.LIKE]
export const getLimitedLikes = createSelector(
  (state: RootState) => state,
  (state: RootState, limit = DEFAULT_LIMIT) => limit,
  (state: RootState, limit = DEFAULT_LIMIT) =>
    getLimited(Array.from(state.logs[ActivityType.LIKE].values()), limit),
)
export const getLimitedComments = createSelector(
  (state: RootState) => state,
  (state: RootState, limit = DEFAULT_LIMIT) => limit,
  (state: RootState, limit = DEFAULT_LIMIT) =>
    getLimited(Array.from(state.logs[ActivityType.COMMENT].values()), limit),
)
export const getLimitedViews = createSelector(
  (state: RootState) => state,
  (state: RootState, limit = DEFAULT_LIMIT) => limit,
  (state: RootState, limit = DEFAULT_LIMIT) =>
    getLimited(Array.from(state.logs[ActivityType.VIEW].values()), limit),
)
export const getLimitedShare = createSelector(
  (state: RootState) => state,
  (state: RootState, limit = DEFAULT_LIMIT) => limit,
  (state: RootState, limit = DEFAULT_LIMIT) =>
    getLimited(Array.from(state.logs[ActivityType.SHARE].values()), limit),
)
export const getLimitedFollow = createSelector(
  (state: RootState) => state,
  (state: RootState, limit = DEFAULT_LIMIT) => limit,
  (state: RootState, limit = DEFAULT_LIMIT) =>
    getLimited(Array.from(state.logs[ActivityType.FOLLOW].values()), limit),
)
export const getLimitedGift = createSelector(
  (state: RootState) => state,
  (state: RootState, limit = DEFAULT_LIMIT) => limit,
  (state: RootState, limit = DEFAULT_LIMIT) =>
    getLimited(Array.from(state.logs[ActivityType.GIFT].values()), limit),
)
export const getLimitedSubscribe = createSelector([subscribe], subscribe =>
  getLimited(Array.from(subscribe.values())),
)

export const getAllLogs = createSelector(
  [gift, follow, comments, likes, views, share, subscribe],
  (gift, follow, comments, likes, views, share, subscribe) => [
    ...Array.from(gift.values()),
    ...Array.from(follow.values()),
    ...Array.from(comments.values()),
    ...Array.from(likes.values()),
    ...Array.from(views.values()),
    ...Array.from(share.values()),
    ...Array.from(subscribe.values()),
  ],
)
export const isLogsExist = createSelector(
  [gift, follow, comments, likes, views, share, subscribe],
  (gift, follow, comments, likes, views, share, subscribe) => {
    return (
      gift.size > 0 ||
      follow.size > 0 ||
      comments.size > 0 ||
      likes.size > 0 ||
      views.size > 0 ||
      share.size > 0 ||
      subscribe.size > 0
    )
  },
)
type UserData = {
  uniqueId: string
  userId: string
  nickname: string
  profilePictureUrl: string
}

export const getMostWordByFilter = createSelector(
  (state: RootState) => state,
  (state: RootState, uniqueId: string) => uniqueId,
  (state: RootState, uniqueId: string, word: string) => word,
  (state: RootState, uniqueId: string, word: string) => {
    if (!uniqueId && !word) return []
    return Array.from(state.logs.comment.values())
      .filter(
        ({ data }) =>
          data.comment.toLowerCase().includes(word.toLowerCase()) &&
          data.uniqueId.includes(uniqueId),
      )
      .map(({ data }) => ({
        comment: data.comment,
        time: data.createTime,
        user: {
          uniqueId: data.uniqueId,
          id: data.userId,
          nickname: data.nickname,
          profilePictureUrl: data.profilePictureUrl,
        },
      }))
      .sort((a, b) => b.comment.split('').length - a.comment.split('').length)
      .slice(0, 10)
  },
)
export const getGiftByGiftName = createSelector(
  (state: RootState) => state,
  (state: RootState, giftName: string) => giftName,
  (state: RootState, giftName: string) => {
    if (!giftName) return []
    return Object.values(
      Array.from(state.logs.gift.values())
        .filter(a => a.data.giftName == giftName)
        .reduce((arr, { data }) => {
          const { uniqueId, repeatCount, diamondCount } = data
          if (!arr[uniqueId]) {
            arr[uniqueId] = {
              repeatCount: repeatCount,
              diamondCount: diamondCount,
              user: {
                uniqueId: data.uniqueId,
                userId: data.userId,
                nickname: data.nickname,
                profilePictureUrl: data.profilePictureUrl,
              },
            }
          }
          arr[uniqueId].repeatCount += repeatCount
          return arr
        }, {} as { [key: string]: { user: UserData; repeatCount: number; diamondCount: number } }),
    )
      .map(({ user, repeatCount, diamondCount }) => ({
        diamondCount,
        user,
        repeatCount,
      }))
      .sort(
        (a, b) =>
          b.diamondCount * b.repeatCount - a.diamondCount * a.repeatCount,
      )
      .slice(0, 10)
  },
)
export const getLikesByUniqueId = createSelector(
  (state: RootState) => state,
  (state: RootState, uniqueId?: string) => uniqueId,
  (state: RootState, uniqueId?: string) => {
    if (!uniqueId) return []
    return Array.from(state.logs.like.values())
      .filter(({ data }) => data.uniqueId.includes(uniqueId))
      .map(({ data }) => ({
        count: data.likeCount,
        time: data.createTime,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  },
)
export const get10MostLikes = createSelector([likes], likes => {
  return Object.values(
    Array.from(likes.values()).reduce(
      (acc, { data }) => {
        const { uniqueId, likeCount } = data
        if (!acc[uniqueId]) {
          acc[uniqueId] = { user: data, times: 0, total: 0 }
        }
        acc[uniqueId].times++
        acc[uniqueId].total += likeCount
        return acc
      },
      {} as {
        [key: string]: { user: UserData; times: number; total: number }
      },
    ),
  )
    .map(({ user, times, total }) => ({
      user,
      times: times.toString(),
      total: total.toString(),
    }))
    .sort((a, b) => parseInt(b.total) - parseInt(a.total))
    .slice(0, 10)
})

export type Most10CommentsOutputType = { user: UserData; times: number }
export const get10MostComment = createSelector([comments], comments => {
  return (
    Object.values(
      Array.from(comments.values()).reduce((acc, { data }) => {
        const { uniqueId } = data
        if (!acc[uniqueId]) {
          acc[uniqueId] = { user: data, times: 0 }
        }
        acc[uniqueId].times++
        return acc
      }, {} as { [key: string]: { user: UserData; times: number } }),
    ) as Most10CommentsOutputType[]
  )
    .map(({ user, times }) => ({
      user,
      times: times,
    }))
    .sort((a, b) => b.times - a.times)
    .slice(0, 10)
})
export type Most10ActivityOutputType = {
  user: UserData
  total: string
  like: string
  comment: string
  share: string
  gift: string
}
export const get10MostActivity = createSelector(
  [comments, likes, views, share, subscribe, follow, gift],
  (comments, likes, views, share, subscribe, follow, gift) => {
    return Object.values(
      [
        ...Array.from(comments.values()),
        ...Array.from(likes.values()),
        ...Array.from(views.values()),
        ...Array.from(share.values()),
        ...Array.from(subscribe.values()),
        ...Array.from(follow.values()),
        ...Array.from(gift.values()),
      ].reduce(
        (acc, { data }) => {
          const { uniqueId, log_type } = data
          if (!acc[uniqueId]) {
            acc[uniqueId] = {
              user: data,
              total: 0,
              like: 0,
              comment: 0,
              share: 0,
              gift: 0,
              view: 0,
              subscribe: 0,
              follow: 0,
            }
          }
          if (log_type == ActivityType.LIKE) acc[uniqueId].like++
          if (log_type == ActivityType.COMMENT) acc[uniqueId].comment++
          if (log_type == ActivityType.SHARE) acc[uniqueId].share++
          if (log_type == ActivityType.GIFT) acc[uniqueId].gift++
          if (log_type == ActivityType.SUBSCRIBE) acc[uniqueId].subscribe++
          if (log_type == ActivityType.VIEW) acc[uniqueId].view++
          if (log_type == ActivityType.FOLLOW) acc[uniqueId].follow++
          acc[uniqueId].total++
          return acc
        },
        {} as {
          [key: string]: {
            user: UserData
            total: number
            like: number
            comment: number
            share: number
            gift: number
            subscribe: number
            view: number
            follow: number
          }
        },
      ),
    )
      .map(({ user, total, like, comment, share, gift }) => ({
        user,
        total: total.toString(),
        like: like.toString(),
        comment: comment.toString(),
        share: share.toString(),
        gift: gift.toString(),
      }))
      .sort((a, b) => parseInt(b.total) - parseInt(a.total))
      .slice(0, 10)
  },
)

export const get10MostWords = createSelector([comments], comments => {
  return Object.values(
    Array.from(comments.values()).reduce((acc, { data }) => {
      const { comment, userId } = data
      comment.split(' ').forEach((word: string) => {
        const lowerCaseWord = word.toLowerCase()
        if (acc[lowerCaseWord]) {
          acc[lowerCaseWord].times += 1
          if (!acc[lowerCaseWord].users.includes(userId))
            acc[lowerCaseWord].users.push(userId)
        } else {
          acc[lowerCaseWord] = {
            word: lowerCaseWord,
            times: 1,
            users: [userId],
          }
        }
      })
      return acc
    }, {} as { [key: string]: { word: string; users: string[]; times: number } }),
  )
    .map(({ word, times, users }) => ({
      word,
      users,
      times: times.toString(),
    }))
    .sort((a, b) => parseInt(b.times) - parseInt(a.times))
    .filter((_, i) => i < 10)
})

export type Most10GiftType = {
  giftName: string
  diamondTotal: number
  repeatTotal: number
  users: UserData['uniqueId'][]
  giftPictureUrl: string
}
export const get10MostGift = createSelector([gift], gift => {
  return (
    Object.values(
      Array.from(gift.values()).reduce((acc, { data }) => {
        const {
          repeatCount,
          giftName,
          diamondCount,
          uniqueId,
          giftPictureUrl,
          giftType,
          repeatEnd,
        } = data
        if (!acc[giftName]) {
          acc[giftName] = {
            giftName: giftName,
            diamondTotal: 0,
            repeatTotal: 0,
            users: [],
            giftPictureUrl: '',
          }
        }
        if (!(giftType == 1 && !repeatEnd)) {
          acc[giftName].diamondTotal += diamondCount * repeatCount
          acc[giftName].repeatTotal += repeatCount
          acc[giftName].giftPictureUrl = giftPictureUrl
          if (!acc[giftName].users.some(user => user === uniqueId)) {
            acc[giftName].users.push(uniqueId)
          }
        }
        return acc
      }, {} as { [key: string]: { giftName: string; diamondTotal: number; repeatTotal: number; users: UserData['uniqueId'][]; giftPictureUrl: string } }),
    ) as Most10GiftType[]
  )
    .map(({ giftName, diamondTotal, repeatTotal, users, giftPictureUrl }) => ({
      giftName,
      diamondTotal,
      repeatTotal,
      users,
      giftPictureUrl,
    }))
    .sort((a, b) => b.diamondTotal - a.diamondTotal)
    .filter((_, i) => i < 10)
})

export type Most10GifterType = {
  totalStreak: number
  totalGift: number
  totalDiamond: number
  user: UserData
}
export const get10MostGifter = createSelector([gift], gift => {
  return (
    Object.values(
      Array.from(gift.values()).reduce((acc, { data }) => {
        const {
          repeatCount,
          giftName,
          diamondCount,
          uniqueId,
          giftPictureUrl,
          isStreak,
          repeatEnd,
          giftType,
        } = data
        if (!acc[uniqueId]) {
          acc[uniqueId] = {
            totalGift: 0,
            totalStreak: 0,
            totalDiamond: 0,
            user: data,
          }
        }
        if (!(giftType == 1 && !repeatEnd)) {
          // Non streak or on streak-end gift
          if (!isStreak) acc[uniqueId].totalStreak++
          acc[uniqueId].totalGift += repeatCount
          acc[uniqueId].totalDiamond += diamondCount * repeatCount
        }
        return acc
      }, {} as { [key: string]: { totalDiamond: number; totalStreak: number; totalGift: number; user: UserData } }),
    ) as Most10GifterType[]
  )
    .map(({ totalDiamond, totalStreak, totalGift, user }) => ({
      totalDiamond,
      totalStreak,
      totalGift,
      user,
    }))
    .sort((a, b) => b.totalDiamond - a.totalDiamond)
    .filter((_, i) => i < 10)
})
