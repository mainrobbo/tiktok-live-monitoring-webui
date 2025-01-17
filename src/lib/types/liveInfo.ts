import { UserInfo } from './log'

export type GameTag = {
  bundle_id: string
  full_name: string
  game_category: any[]
  hashtag_id: number[]
  hashtag_list: any[]
  id: number
  is_new_game: boolean
  landscape: number
  package_name: string
  short_name: string
  show_name: string
}
export type RoomInfo = {
  title?: string
  stream_url?: {
    flv_pull_url?: {
      HD1: string
      SD1: string
      SD2: string
    }
    hls_pull_url?: string
  }
  game_tag?: GameTag[]
  hashtag?: {
    title: string
  }
}
type liveIntro = {
  id?: {
    high: number
    low: number
    unsigned: boolean
  }
  description?: string
} & UserInfo

type Armies = UserInfo
type BattleArmies = {
  hostUserId: string
  participants: Armies[]
  points: number
}
type MicArmies = {
  battleStatus: number
  battleArmies: BattleArmies[]
}
type MicBattle = {
  battleUsers: Armies[]
}

export interface TiktokLiveState {
  roomInfo?: RoomInfo
  liveIntro?: liveIntro
  linkMicBattle?: MicBattle
  linkMicArmies?: MicArmies
  viewers: number
}
