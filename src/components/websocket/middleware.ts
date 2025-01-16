import { Middleware } from '@reduxjs/toolkit'
import { ActivityType, SocketActionType } from '@/lib/types/common'
import io, { Socket } from 'socket.io-client'
import { setConnected, setLive } from '@/store/connectionSlice'
import { toast } from 'sonner'
import { CommentLog } from '@/lib/types/log'
import { setLiveIntro, setMicBattle, setRoomInfo } from '@/store/liveInfoSlice'
import { RootState } from '@/store'
import { beforeAddLog, createBatcher } from '@/lib/helper/data-handle'
import { cleanLogs } from '@/store/logsSlice'

let socket: Socket | null = null
const websocketMiddleware: Middleware<{}, any> = store => {
  const batcher = createBatcher(store.dispatch)
  const viewUserIds = new Set<string>()
  return next => (action: any) => {
    const state = store.getState() as RootState
    const { dispatch } = store
    const username = state.setting.username
    const wsUrl = state.connection.wsUrl

    const isRejoin = (userId: string): boolean => {
      return viewUserIds.has(userId)
    }

    switch (action.type) {
      case SocketActionType.START:
        if (socket === null || !socket.connected) {
          /** Clean before start */
          dispatch(cleanLogs())
          viewUserIds.clear()

          if (!socket?.io.opts.hostname?.includes(wsUrl)) {
            socket?.close()
            socket = null
          }
          socket = io(wsUrl, {
            transports: ['websocket'],
            forceNew: true,
            reconnection: true,
            autoConnect: true,
          })
          localStorage.setItem('ZERATIKTOK:wsUrl', wsUrl)
        }
        socket.emit('listenToUsername', JSON.stringify({ username }))
        socket.on('connect', () => {
          dispatch(setConnected(true))
          toast.success('Connected to server')
          localStorage.setItem('ZERATIKTOK:username', username)
        })
        socket.on('disconnect', () => {
          dispatch(setConnected(false))
          dispatch(setLive(false))
        })

        //* Connection
        socket.on('data-connection', data => {
          try {
            data = JSON.parse(data)
            dispatch(setLive(data.isConnected))
          } catch (err) {
            console.log('data-connection', err)
          }
        })
        socket.on('data-islive', data => {
          try {
            data = JSON.parse(data)
            if (data?.message) {
              toast.warning(data.message)
            }
          } catch (err) {
          } finally {
            dispatch(setLive(false))
          }
        })

        //* Room info
        socket.on('data-roomInfo', data => {
          try {
            data = JSON.parse(data)
            dispatch(setLive(true))
            dispatch(setRoomInfo(data))
          } catch (err) {
            console.error('data-roomInfo', data, err)
          }
        })
        socket.on('data-liveIntro', data => {
          try {
            data = JSON.parse(data)
            dispatch(setLiveIntro(data))
          } catch (err) {
            console.error('data-roomInfo', data, err)
          }
        })
        //* Listening data
        socket.on('data-chat', data => {
          try {
            data = JSON.parse(data) as CommentLog
            if (data.comment) {
              const type = ActivityType.COMMENT
              beforeAddLog({ ...data, log_type: type }, batcher)
            }
            //TODO if (isNotifySound && showComment) SoundNotify({ type: "comment" });
          } catch (err) {
            console.log('data-chat', err)
          }
        })
        socket.on('data-like', data => {
          try {
            data = JSON.parse(data)
            if (data.likeCount) {
              const type = ActivityType.LIKE
              beforeAddLog({ ...data, log_type: type }, batcher)
            }
          } catch (err) {
            console.error('data-like', err)
          }
        })
        socket.on('data-gift', data => {
          try {
            data = JSON.parse(data)
            if (data.giftType) {
              const type = ActivityType.GIFT
              beforeAddLog(
                {
                  ...data,
                  log_type: type,
                  isStreak: data.giftType === 1,
                },
                batcher,
              )
            }
          } catch (err) {
            console.error('data-gift', err)
          }
        })
        socket.on('data-share', data => {
          try {
            data = JSON.parse(data)
            const type = ActivityType.SHARE
            beforeAddLog({ ...data, log_type: type }, batcher)
          } catch (err) {
            console.error('data-share', err)
          }
        })
        socket.on('data-social', data => {
          try {
            data = JSON.parse(data)
            const type = ActivityType.SOCIAL
            beforeAddLog({ ...data, log_type: type }, batcher)
          } catch (err) {
            console.error('data-social', err)
          }
        })
        socket.on('data-member', data => {
          try {
            data = JSON.parse(data)
            const userId = data.userId
            const isUserRejoin = isRejoin(userId)
            viewUserIds.add(userId)

            const type = ActivityType.VIEW
            beforeAddLog(
              { ...data, log_type: type, isRejoin: isUserRejoin },
              batcher,
            )
          } catch (err) {
            console.error('data-member', err)
          }
        })
        socket.on('data-subscribe', data => {
          try {
            data = JSON.parse(data)
            const type = ActivityType.SUBSCRIBE
            beforeAddLog({ ...data, log_type: type }, batcher)
          } catch (err) {
            console.error('data-subscribe', err)
          }
        })

        // * Listening micBattle
        socket.on('data-micBattle', data => {
          try {
            data = JSON.parse(data)
            dispatch(setMicBattle(data))
          } catch (err) {
            console.error('data-micBattle', err)
          }
        })
        socket.on('data-micArmies', data => {
          try {
            data = JSON.parse(data)
            const type = ActivityType.SUBSCRIBE
            beforeAddLog({ ...data, log_type: type }, batcher)
          } catch (err) {
            console.error('data-micArmies', err)
          }
        })
        socket.on('data-debug', data => {
          try {
            data = JSON.parse(data)
            console.log('data-debug', data)
          } catch (err) {
            console.log('error data-debug', data)
          }
        })
        break
      case SocketActionType.STOP:
        if (socket && socket.connected) {
          socket.disconnect()
          console.log('Socket connection closed')
        }
        break
      case SocketActionType.RECONNECT:
        if (socket) socket.connect()
        break
      default:
        break
    }

    return next(action)
  }
}

export default websocketMiddleware
