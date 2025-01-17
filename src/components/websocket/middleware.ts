import { Middleware } from '@reduxjs/toolkit'
import { ActivityType, SocketActionType } from '@/lib/types/common'
import io, { Socket } from 'socket.io-client'
import { setState, setConnected, setLive } from '@/store/connectionSlice'
import { toast } from 'sonner'
import { CommentLog } from '@/lib/types/log'
import {
  setLiveIntro,
  setMicBattle,
  setRoomInfo,
  setViewers,
} from '@/store/liveInfoSlice'
import { RootState } from '@/store'
import { beforeAddLog, createBatcher } from '@/lib/helper/data-handle'
import { cleanLogs } from '@/store/logsSlice'

let socket: Socket | null = null
let previousUsername = ''
let currentViewers = 0
const websocketMiddleware: Middleware<{}, any> = store => {
  const batcher = createBatcher(store.dispatch)
  const viewUserIds = new Set<string>()
  return next => (action: any) => {
    const state = store.getState() as RootState
    const { dispatch } = store
    const isRejoin = (userId: string): boolean => {
      return viewUserIds.has(userId)
    }
    switch (action.type) {
      case SocketActionType.START:
        const { wsUrl, username } = action.payload
        console.log('retrieving socket', wsUrl, username)
        dispatch(setState('connecting'))
        localStorage.setItem('ZERATIKTOK:username', username)
        /** Clean before start */
        if (previousUsername != username) {
          dispatch(cleanLogs())
          viewUserIds.clear()
        }
        if (socket === null || !socket.connected) {
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
        previousUsername = username
        socket.on('connect', () => {
          dispatch(setConnected(true))
          toast.success('Connected to server', {
            position: 'bottom-right',
          })
        })
        socket.on('disconnect', () => {
          // Only if disconnected from server.
          toast.warning('Disconnected from server', {
            position: 'bottom-right',
            action: {
              label: 'Reconnect',
              onClick: () => socket?.connect(),
            },
          })
          // Cleanup state
          dispatch(setConnected(false))
          dispatch(setLive(false))
          dispatch(setState('idle'))
        })

        //* Connection
        socket.on('data-connection', data => {
          try {
            data = JSON.parse(data)

            dispatch(setLive(data.isConnected))

            // Handle if connection backend-to-tiktok
            if (data.isConnected) {
              dispatch(setState('connected'))
              toast.success('Connected to tiktok')
            } else {
              dispatch(setState('idle'))
              if (data?.message) {
                toast.warning(data.message)
              } else {
                toast.warning('Disconnected from tiktok', {
                  action: {
                    label: 'Reconnect',
                    onClick: () => {
                      dispatch(setState('connecting'))
                      socket?.emit(
                        'listenToUsername',
                        JSON.stringify({ username }),
                      )
                    },
                  },
                })
              }
            }
          } catch (err) {
            console.log('data-connection', err)
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
        socket.on('data-viewer', data => {
          try {
            data = JSON.parse(data)
            dispatch(setViewers(data.viewerCount))
            currentViewers = data.viewerCount
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
              beforeAddLog({ ...data, log_type: type, currentViewers }, batcher)
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
              beforeAddLog({ ...data, log_type: type, currentViewers }, batcher)
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
                  isStreak: data.giftType === 1 && !data.repeatEnd,
                  currentViewers,
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
            beforeAddLog({ ...data, log_type: type, currentViewers }, batcher)
          } catch (err) {
            console.error('data-share', err)
          }
        })
        /**
         * ! Deprecated:
         * data-social = data-follow / data-share
        socket.on('data-social', data => {
          try {
            data = JSON.parse(data)
            const type = ActivityType.SHARE
            // beforeAddLog({ ...data, log_type: type, currentViewers }, batcher)
          } catch (err) {
            console.error('data-share', err)
          }
        }) 
          */
        socket.on('data-follow', data => {
          try {
            data = JSON.parse(data)
            const type = ActivityType.FOLLOW
            beforeAddLog({ ...data, log_type: type, currentViewers }, batcher)
          } catch (err) {
            console.error('data-follow', err)
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
              {
                ...data,
                log_type: type,
                isRejoin: isUserRejoin,
                currentViewers,
              },
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
            beforeAddLog({ ...data, log_type: type, currentViewers }, batcher)
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
            beforeAddLog({ ...data, log_type: type, currentViewers }, batcher)
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
          socket.emit('stopListen')
          console.log(
            'Asking top stop listening',
            'Socket connection:',
            socket.connected,
          )
        }
        dispatch(setState('idle'))
        dispatch(setLive(false))
        batcher.forceProcess()
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
