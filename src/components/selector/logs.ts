'use client'
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
export const get10MostWords = createSelector([comments], comments => {
  Object.values(
    comments.reduce(
      (acc, data) => {
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
      },
      {} as { [key: string]: { word: string; users: string[]; times: number } },
    ),
  )
    .map(({ word, times, users }) => ({
      word,
      users,
      times: times.toString(),
    }))
    .sort((a, b) => parseInt(b.times) - parseInt(a.times))
    .filter((_, i) => i < 10)
})
