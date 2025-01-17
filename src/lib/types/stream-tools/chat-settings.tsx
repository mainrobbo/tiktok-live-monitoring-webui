export interface ChatSetting {
  fontSize: number
  messageSpacing: number
  backgroundColor: string
  textColor: string
  showUserColors: boolean
  maxMessages: number
  animationSpeed: number
  showTimestamp: boolean
  timestampFormat: '12h' | '24h'
  showAvatar: boolean
  avatarSize: number
  fontFamily: string
  containerWidth: number
  containerHeight: number
  containerPaddingTop: number
  containerPaddingBottom: number
  containerPaddingLeft: number
  containerPaddingRight: number
  messageAlignment: 'left' | 'center' | 'right'
  showBadges: boolean
  showEmotes: boolean
  appearPosition: 'top' | 'bottom'
}

export interface Settings {
  chatSetting: ChatSetting
}
