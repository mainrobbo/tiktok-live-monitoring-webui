'use client'
import { ActivityType } from '@/lib/types/common'
import { RootState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'

export const comments = ({ logs }: RootState) => logs.comment
export const likes = ({ logs }: RootState) => logs.like
export const views = ({ logs }: RootState) => logs.view
export const share = ({ logs }: RootState) => logs.share
export const social = ({ logs }: RootState) => logs.social
export const gift = ({ logs }: RootState) => logs.gift
export const subscribe = ({ logs }: RootState) => logs.subscribe
export const logs = ({ logs }: RootState) => logs
export const getLimitedLikes = createSelector([likes], likes =>
  likes.slice(0, 25),
)
export const getLimitedComments = createSelector([comments], comments =>
  comments.slice(0, 25),
)
export const getLimitedViews = createSelector([views], views =>
  views.slice(0, 25),
)
export const getLimitedShare = createSelector([share], share =>
  share.slice(0, 25),
)
export const getLimitedSocial = createSelector([social], social =>
  social.slice(0, 25),
)
export const getLimitedGift = createSelector([gift], gift => gift.slice(0, 25))
export const getLimitedSubscribe = createSelector([subscribe], subscribe =>
  subscribe.slice(0, 25),
)
export const getAllLogs = createSelector(
  [gift, social, comments, likes, views, share, subscribe],
  (gift, social, comments, likes, views, share, subscribe) => [
    ...gift,
    ...social,
    ...comments,
    ...likes,
    ...views,
    ...share,
    ...subscribe,
  ],
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
    return state.logs.comment
      .filter(
        d =>
          d.comment.toLowerCase().includes(word.toLowerCase()) &&
          d.uniqueId.includes(uniqueId),
      )
      .map(data => ({
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
export const getLikesByUniqueId = createSelector(
  (state: RootState) => state,
  (state: RootState, uniqueId?: string) => uniqueId,
  (state: RootState, uniqueId?: string) => {
    if (!uniqueId) return []
    return state.logs.like
      .filter(like => like.uniqueId.includes(uniqueId))
      .map(data => ({
        count: data.likeCount,
        time: data.createTime,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  },
)
export const get10MostLikes = createSelector([likes], likes => {
  return Object.values(
    likes.reduce(
      (acc, user) => {
        const { uniqueId, likeCount } = user
        if (!acc[uniqueId]) {
          acc[uniqueId] = { user: user, times: 0, total: 0 }
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
      comments.reduce((acc, user) => {
        const { uniqueId } = user
        if (!acc[uniqueId]) {
          acc[uniqueId] = { user: user, times: 0 }
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
  [comments, likes, views, share, subscribe, social, gift],
  (comments, likes, views, share, subscribe, social, gift) => {
    return Object.values(
      [
        ...comments,
        ...likes,
        ...views,
        ...share,
        ...subscribe,
        ...social,
        ...gift,
      ].reduce(
        (acc, user) => {
          const { uniqueId, log_type } = user
          if (!acc[uniqueId]) {
            acc[uniqueId] = {
              user: user,
              total: 0,
              like: 0,
              comment: 0,
              share: 0,
              gift: 0,
              view: 0,
              subscribe: 0,
              social: 0,
            }
          }
          if (log_type == ActivityType.LIKE) acc[uniqueId].like++
          if (log_type == ActivityType.COMMENT) acc[uniqueId].comment++
          if (log_type == ActivityType.SHARE) acc[uniqueId].share++
          if (log_type == ActivityType.GIFT) acc[uniqueId].gift++
          if (log_type == ActivityType.SUBSCRIBE) acc[uniqueId].subscribe++
          if (log_type == ActivityType.VIEW) acc[uniqueId].view++
          if (log_type == ActivityType.SOCIAL) acc[uniqueId].social++
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
            social: number
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
    comments.reduce((acc, data) => {
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
