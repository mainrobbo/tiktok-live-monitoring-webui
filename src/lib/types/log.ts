import { ActivityType } from './common'

type FollowInfo = {
  followingCount: number
  followerCount: number
  followStatus: number
  pushStatus: number
}
export type UserDetails = {
  createTime: string
  bioDescription: string
  profilePictureUrls: string[]
}
export type UserBadge = {
  type: string
  privilegeId: string
  level: number
  badgeSceneType: number
}
export type UserInfo = {
  userId: string
  secUid: string
  uniqueId: string
  nickname: string
  profilePictureUrl: string
  followRole: number
  userBadges: UserBadge[]
  userSceneTypes: number[]
  userDetails: UserDetails
  followInfo: FollowInfo
  isModerator: boolean
  isNewGifter: boolean
  isSubscriber: boolean
  topGifterRank: number | null
  gifterLevel: number
  teamMemberLevel: number
}
export type BaseLog = UserInfo & {
  msgId: string
  createTime: string
  log_type: ActivityType
  displayType: string
}
export type CommentLog = BaseLog & {
  emotes: string[]
  comment: string
}

export type LikeLog = BaseLog & {
  likeCount: number
  totalLikeCount: number
  label: string
}
export type ViewLog = BaseLog & {
  isRejoin: boolean
}
export type SubscribeLog = BaseLog & {
  subMonth: number
  oldSubscribeStatus: number
  subscribingStatus: number
}
type Gift = {
  gift_id: number
  repeat_count: number
  repeat_end: number
  gift_type: number
}
export type GiftLog = BaseLog & {
  diamondCount: number
  repeatCount: number
  giftId: number
  giftName: string
  giftType: number
  describe: string
  repeatEnd: boolean
  gift: Gift
  giftPictureUrl: string
  receiverUserId: string
  timestamp: number
  groupId: string
  isStreak: boolean
}

export type LogData = CommentLog & LikeLog & ViewLog & GiftLog & SubscribeLog
