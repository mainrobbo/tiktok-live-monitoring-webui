'use client'

import { getLimitedComments } from '@/components/selector/logs'
import { Message, MessagesList } from '@/components/views/tools/chat-overlay'
import { SocketActionType } from '@/lib/types/common'
import { ChatSetting } from '@/lib/types/stream-tools/chat-settings'
import { RootState } from '@/store'
import { LogEntry } from '@/store/logsSlice'
import { debounce, throttle } from 'lodash'
import moment from 'moment'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function convertToChatSetting(settings: { [k: string]: any }): ChatSetting {
  return {
    fontSize: settings.fontSize,
    messageSpacing: settings.fontSize,
    backgroundColor: settings.backgroundColor,
    textColor: settings.textColor,
    showUserColors: settings.showUserColors,
    maxMessages: settings.maxMessages,
    animationSpeed: settings.animationSpeed,
    showTimestamp: settings.showTimestamp,
    timestampFormat: settings.timestampFormat,
    showAvatar: settings.showAvatar,
    avatarSize: settings.avatarSize,
    fontFamily: settings.fontFamily,
    containerWidth: settings.containerWidth,
    containerHeight: settings.containerHeight,
    messageAlignment: settings.messageAlignment,
    showBadges: settings.showBadges,
    showEmotes: settings.showEmotes,
    containerPaddingTop: settings.containerPaddingTop,
    containerPaddingBottom: settings.containerPaddingBottom,
    containerPaddingLeft: settings.containerPaddingLeft,
    containerPaddingRight: settings.containerPaddingRight,
    appearPosition: settings.appearPosition,
  }
}
export default function ChatOverlay() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <ChatOverlayComponent />
    </Suspense>
  )
}
function ChatOverlayComponent() {
  const dispatch = useDispatch()
  const { live } = useSelector((state: RootState) => state.connection)
  const [settings, setSettings] = useState<ChatSetting | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [list, setList] = useState<LogEntry[]>([])
  const logs = useSelector((state: RootState) => getLimitedComments(state))
  const chatsRef = useRef<LogEntry[]>(logs)

  useEffect(() => {
    chatsRef.current = logs
  }, [logs])

  const debouncedUpdateList = useRef(
    debounce(() => {
      console.log('debounced')
      setList([...chatsRef.current])
    }, 200),
  ).current

  useEffect(() => {
    debouncedUpdateList()
    console.log('asking debounce', logs)
    // return () => debouncedUpdateList.cancel()
  }, [logs])
  const params = useSearchParams()
  useEffect(() => {
    const queryParams = Object.fromEntries(new URLSearchParams(params))
    setSettings(convertToChatSetting(queryParams))
    setUsername(queryParams.username)
  }, [])
  useEffect(() => {
    if (settings && username) {
      dispatch({
        type: SocketActionType.START,
        payload: { wsUrl: 'ws://localhost:2608', username },
      })
    }
  }, [settings])
  const formatTimestamp = (timestamp: string): string => {
    // const date = new Date(timestamp)
    // if (settings!.timestampFormat === '24h') {
    //   return date.toLocaleTimeString('en-US', { hour12: false })
    // }
    // return date.toLocaleTimeString('en-US', { hour12: true })
    return moment(moment.unix(parseInt(timestamp) / 1000)).format('HH:mm:ss')
  }

  const transformList = useCallback((): Message[] => {
    return list
      .map(item => {
        const newData: Message = {
          userId: item.data.userId,
          uniqueId: item.data.uniqueId,
          nickname: item.data.nickname,
          profilePictureUrl: item.data.profilePictureUrl,
          followRole: item.data.followRole,
          isModerator: item.data.isModerator,
          isNewGifter: item.data.isNewGifter,
          isSubscriber: item.data.isSubscriber,
          topGifterRank: item.data.topGifterRank,
          gifterLevel: item.data.gifterLevel,
          createTime: item.data.createTime,
          msgId: item.data.msgId,
          emotes: item.data.emotes,
          comment: item.data.comment,
        }
        return newData
      })
      .sort(
        (a, b) => parseInt(a.createTime) - parseInt(b.createTime),
      ) as Message[]
  }, [list])
  return (
    live && (
      <MessagesList
        formatTimestamp={formatTimestamp}
        settings={settings as ChatSetting}
        messages={transformList()}
      />
    )
  )
}
