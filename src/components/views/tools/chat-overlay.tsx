'use client'
import { ChatSetting as Settings } from '@/lib/types/stream-tools/chat-settings'
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  RefObject,
} from 'react'
import { ClipboardIcon } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setChatSetting } from '@/store/streamToolsSlice'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { debounce, throttle, update } from 'lodash'
import { Separator } from '@/components/ui/separator'
import ColorPicker from './color-picker'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
export type Message = {
  userId: string
  uniqueId: string
  nickname: string
  profilePictureUrl: string
  followRole: number
  isModerator: boolean
  isNewGifter: boolean
  isSubscriber: boolean
  topGifterRank: number | null
  gifterLevel: number
  createTime: string
  msgId: string
  emotes: string[]
  comment: string
}

interface MessageItemProps {
  msg: Message
  settings: Settings
  formatTimestamp: (timestamp: string) => string
  id: number
  isRef?: RefObject<HTMLDivElement | null>
}

interface MessagesListProps {
  messages: Message[]
  settings: Settings
  formatTimestamp: (timestamp: string) => string
}

const fontFamilies = [
  'Inter',
  'Arial',
  'Helvetica',
  'Verdana',
  'Times New Roman',
  'Georgia',
  'Roboto',
  'Open Sans',
  'system-ui',
] as const

// Helper function to get user role badge
const getUserBadges = (msg: Message): string[] => {
  const badges: string[] = []
  if (msg.isModerator) badges.push('👑 Mod')
  if (msg.isSubscriber) badges.push('⭐ Sub')
  if (msg.isNewGifter) badges.push('🎁 Gifter')
  if (msg.topGifterRank) badges.push(`🏆 Top ${msg.topGifterRank}`)
  if (msg.gifterLevel > 0) badges.push(`💝 Level ${msg.gifterLevel}`)
  return badges
}

const ChatOverlay: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      userId: '123',
      uniqueId: 'user123',
      nickname: 'JohnDoe',
      profilePictureUrl:
        'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7332118809300860933~c5_100x100.webp?lk3s=a5d48078&nonce=37073&refresh_token=3739e5688dbf2780f9b42cab40830757&x-expires=1737259200&x-signature=4QU3qQcCYZ%2FJr8tOFyIrEJ4ojoE%3D&shp=a5d48078&shcp=fdd36af4',
      followRole: 1,
      isModerator: true,
      isNewGifter: false,
      isSubscriber: true,
      topGifterRank: 1,
      gifterLevel: 3,
      createTime: new Date().toISOString(),
      msgId: '1',
      emotes: ['😊', '❤️'],
      comment: 'Hello everyone! 😊 ❤️',
    },
    {
      userId: '456',
      uniqueId: 'user456',
      nickname: 'StreamFan',
      profilePictureUrl:
        'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7332118809300860933~c5_100x100.webp?lk3s=a5d48078&nonce=90818&refresh_token=5bec535d656ef6ef6d256c0c57eda9db&x-expires=1737259200&x-signature=4QU3qQcCYZ%2FJr8tOFyIrEJ4ojoE%3D&shp=a5d48078&shcp=fdd36af4',
      followRole: 0,
      isModerator: false,
      isNewGifter: true,
      isSubscriber: false,
      topGifterRank: null,
      gifterLevel: 1,
      createTime: new Date().toISOString(),
      msgId: '2',
      emotes: ['🎉'],
      comment: 'Great stream today! 🎉',
    },
  ])

  const [settings, setSettings] = useState<Settings>({
    fontSize: 16,
    messageSpacing: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    textColor: '#ffffff',
    showUserColors: true,
    maxMessages: 5,
    animationSpeed: 0.3,
    showTimestamp: true,
    timestampFormat: '24h',
    showAvatar: true,
    avatarSize: 32,
    fontFamily: 'Inter',
    containerWidth: 400,
    containerHeight: 300,
    messageAlignment: 'left',
    showBadges: true,
    showEmotes: true,
    containerPaddingTop: 2,
    containerPaddingBottom: 2,
    containerPaddingLeft: 2,
    containerPaddingRight: 2,
    appearPosition: 'bottom',
  })
  const chatSetting = useSelector(
    (state: RootState) => state.streamTools.chatSetting,
  )
  const { avatarSize } = chatSetting
  const [asize, setAsize] = useState([5])
  const dispatch = useDispatch()

  useEffect(() => {
    setSettings(prev => ({ ...prev, ...chatSetting }))
  }, [chatSetting])

  const addMessageExample = () => {
    setMessages(prev => [
      ...prev,
      {
        userId: '456',
        uniqueId: 'user456',
        nickname: 'StreamFan',
        profilePictureUrl:
          'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7332118809300860933~c5_100x100.webp?lk3s=a5d48078&nonce=90818&refresh_token=5bec535d656ef6ef6d256c0c57eda9db&x-expires=1737259200&x-signature=4QU3qQcCYZ%2FJr8tOFyIrEJ4ojoE%3D&shp=a5d48078&shcp=fdd36af4',
        followRole: 0,
        isModerator: false,
        isNewGifter: true,
        isSubscriber: false,
        topGifterRank: null,
        gifterLevel: 1,
        createTime: new Date().toISOString(),
        msgId: Math.random().toString(),
        emotes: ['🎉'],
        comment: 'Great stream today! 🎉',
      },
    ])
  }
  // Simulate new messages with the new Message type
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newMessage: Message = {
  //       userId: Math.random().toString(),
  //       uniqueId: `user${Math.random()}`,
  //       nickname: `User${Math.floor(Math.random() * 100)}`,
  //       profilePictureUrl:
  //         'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/7332118809300860933~c5_100x100.webp?lk3s=a5d48078&nonce=19717&refresh_token=7f6242dde6e72406a6a0e39aca37d2f8&x-expires=1737259200&x-signature=4QU3qQcCYZ%2FJr8tOFyIrEJ4ojoE%3D&shp=a5d48078&shcp=fdd36af4',
  //       followRole: Math.floor(Math.random() * 3),
  //       isModerator: Math.random() > 0.8,
  //       isNewGifter: Math.random() > 0.8,
  //       isSubscriber: Math.random() > 0.5,
  //       topGifterRank:
  //         Math.random() > 0.8 ? Math.floor(Math.random() * 10) + 1 : null,
  //       gifterLevel: Math.floor(Math.random() * 5),
  //       createTime: new Date().toISOString(),
  //       msgId: Date.now().toString(),
  //       emotes: ['😊', '❤️', '🎉'].slice(0, Math.floor(Math.random() * 3)),
  //       comment: `Sample message ${Math.floor(Math.random() * 1000)} 😊`,
  //     }

  //     setMessages(prev =>
  //       settings.appearPosition == 'bottom'
  //         ? [...prev.slice(-settings.maxMessages + 1), newMessage]
  //         : [newMessage, ...prev.slice(0, settings.maxMessages - 1)],
  //     )
  //   }, 3000)

  //   return () => clearInterval(interval)
  // }, [settings.maxMessages, settings.appearPosition])

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    if (settings.timestampFormat === '24h') {
      return date.toLocaleTimeString('en-US', { hour12: false })
    }
    return date.toLocaleTimeString('en-US', { hour12: true })
  }

  return (
    <div className='flex gap-8 p-8 flex-col lg:flex-row w-full'>
      <div className='flex-shrink-0 lg:w-1/3'>
        <SettingsPanel addMessageExample={addMessageExample} />
      </div>
      <div className='flex-grow flex items-start justify-center'>
        <MessagesList
          messages={messages}
          settings={settings}
          formatTimestamp={formatTimestamp}
        />
      </div>
    </div>
  )
}
const MessageItem: React.FC<MessageItemProps> = ({
  msg,
  settings,
  formatTimestamp,
  id,
  isRef,
}) => {
  return (
    <motion.div
      ref={isRef ? isRef : null}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 100 }}
      transition={{
        duration: (settings.animationSpeed / 10) * id,
      }}
      viewport={{ once: true }}
      className='flex items-start p-2'
      style={{
        marginBottom: `${settings.messageSpacing}px`,
        //   animation: `fadeIn ${settings.animationSpeed}s ease-in-out`,
        fontSize: `${settings.fontSize}px`,
        color: settings.textColor,
        fontFamily: settings.fontFamily,
        justifyContent:
          settings.messageAlignment === 'right'
            ? 'flex-end'
            : settings.messageAlignment === 'center'
            ? 'center'
            : 'flex-start',
      }}
    >
      {settings.showAvatar && (
        <img
          src={msg.profilePictureUrl}
          alt={msg.nickname}
          className='rounded-full mr-2'
          style={{
            width: `${settings.avatarSize}px`,
            height: `${settings.avatarSize}px`,
          }}
        />
      )}
      <div>
        <div className='flex flex-wrap items-center gap-2'>
          <span
            className='font-bold'
            style={{
              color: settings.showUserColors
                ? msg.isModerator
                  ? '#ff4444'
                  : msg.isSubscriber
                  ? '#33cc33'
                  : settings.textColor
                : settings.textColor,
            }}
          >
            {msg.nickname}
          </span>
          {settings.showBadges &&
            getUserBadges(msg).map((badge, index) => (
              <span
                key={index}
                className='text-xs px-1 bg-opacity-50 bg-black rounded'
              >
                {badge}
              </span>
            ))}
          {settings.showTimestamp && (
            <span className='text-xs opacity-75'>
              {formatTimestamp(msg.createTime)}
            </span>
          )}
        </div>
        <div>
          {settings.showEmotes
            ? msg.comment
            : msg.comment.replace(/[😊❤️🎉]/g, '')}
        </div>
      </div>
    </motion.div>
  )
}

export const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  settings,
  formatTimestamp,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  return (
    <div
      className='overflow-hidden rounded-lg'
      style={{
        backgroundColor: settings.backgroundColor,
        width: `${settings.containerWidth}px`,
        height: `${settings.containerHeight}px`,
        paddingTop: `${settings.containerPaddingTop}px`,
        paddingBottom: `${settings.containerPaddingBottom}px`,
        paddingLeft: `${settings.containerPaddingLeft}px`,
        paddingRight: `${settings.containerPaddingRight}px`,
        overflowY: 'hidden',
      }}
    >
      <AnimatePresence>
        {messages.map((msg, i) => {
          let setref =
            (settings.appearPosition === 'bottom' &&
              i === messages.length - 1) ||
            (settings.appearPosition === 'top' && i === 0)
              ? bottomRef
              : undefined
          return (
            <MessageItem
              key={msg.msgId}
              msg={msg}
              settings={settings}
              formatTimestamp={formatTimestamp}
              id={i}
              isRef={setref}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}
type SettingsPanel = {
  addMessageExample: () => void
}
const SettingsPanel: React.FC<SettingsPanel> = ({ addMessageExample }) => {
  const [settings, setSettings] = useState<Settings>({
    fontSize: 16,
    messageSpacing: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    textColor: '#ffffff',
    showUserColors: true,
    maxMessages: 5,
    animationSpeed: 0.3,
    showTimestamp: true,
    timestampFormat: '24h',
    showAvatar: true,
    avatarSize: 32,
    fontFamily: 'Inter',
    containerWidth: 400,
    containerHeight: 300,
    messageAlignment: 'left',
    showBadges: true,
    showEmotes: true,
    containerPaddingTop: 2,
    containerPaddingBottom: 2,
    containerPaddingLeft: 2,
    containerPaddingRight: 2,
    appearPosition: 'bottom',
  })
  const [color, setColor] = useState('#aabbcc')

  const dispatch = useDispatch()
  const updateToAtas = useCallback(
    debounce(() => {
      console.log('debounced')
      dispatch(setChatSetting({ ...settings }))
    }, 300),
    [settings],
  )
  useEffect(() => {
    console.log('new input')
    updateToAtas()

    return () => updateToAtas.cancel()
  }, [settings])
  const createUrlSearchParams = (data: any) => {
    return new URLSearchParams(
      Object.entries(data)
        .map(([key, val]) => `${key}=${val}`)
        .join('&'),
    ).toString()
  }
  const copyToClipboard = (text: string) => {
    if (window.navigator) {
      navigator.clipboard.writeText(text)
      toast('Copied to clipboard')
    }
  }
  const [username, setUsername] = useState('')
  const [hostname, setHostname] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname)
    }
  }, [])
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Chat Overlay Settings</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 flex items-start gap-5'>
        <div className='flex flex-col gap-2 w-full'>
          <Input
            placeholder='Username'
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <div className='grid gap-4 sm:grid-cols-2 justify-items-stretch'>
            <div>
              Left
              <Input
                type='number'
                value={settings.containerPaddingLeft}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    containerPaddingLeft: parseInt(e.target.value),
                  }))
                }
                className='text-xs w-full'
              />
            </div>
            <div>
              Right
              <Input
                type='number'
                className='text-xs w-full'
                value={settings.containerPaddingRight}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    containerPaddingRight: parseInt(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              Top
              <Input
                type='number'
                className='text-xs w-full'
                value={settings.containerPaddingTop}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    containerPaddingTop: parseInt(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              Bottom
              <Input
                type='number'
                className='text-xs w-full'
                value={settings.containerPaddingBottom}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    containerPaddingBottom: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div>
            <Label>Container Width: {settings.containerWidth}px</Label>
            <Slider
              value={[settings.containerWidth]}
              className='w-full h-4 data-[disabled=true]:opacity-30'
              onValueChange={e =>
                setSettings(prev => ({ ...prev, containerWidth: e[0] }))
              }
              min={200}
              max={800}
              step={5}
            />
          </div>
          <div>
            <Label>Container Height: {settings.containerHeight}px</Label>
            <Slider
              value={[settings.containerHeight]}
              className='w-full h-4 data-[disabled=true]:opacity-30'
              onValueChange={e =>
                setSettings(prev => ({ ...prev, containerHeight: e[0] }))
              }
              min={200}
              max={600}
              step={5}
            />
          </div>
          <Separator />
          <div className='flex flex-col gap-1'>
            <Label>Background Opacity</Label>
            <ColorPicker
              onChange={e =>
                setSettings(prev => ({
                  ...prev,
                  backgroundColor: e,
                }))
              }
              options={{ result: 'rgba' }}
            />
          </div>
          <Separator />
          <div>
            <Label>Font Family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={value =>
                setSettings(prev => ({ ...prev, fontFamily: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select font' />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map(font => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              className='w-full h-4 data-[disabled=true]:opacity-30'
              onValueChange={e =>
                setSettings(prev => ({ ...prev, fontSize: e[0] }))
              }
              max={20}
              step={1}
            />
          </div>
          {/* <div>
            <Label>Message Alignment</Label>
            <Select
              value={settings.messageAlignment}
              onValueChange={(value: 'left' | 'center' | 'right') =>
                setSettings(prev => ({ ...prev, messageAlignment: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select alignment' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='left'>Left</SelectItem>
                <SelectItem value='center'>Center</SelectItem>
                <SelectItem value='right'>Right</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <Separator />
          <div className='flex items-center justify-between'>
            <Label>Show Avatar</Label>
            <Switch
              checked={settings.showAvatar}
              onCheckedChange={checked =>
                setSettings(prev => ({ ...prev, showAvatar: checked }))
              }
            />
          </div>
          <div>
            <Label>Avatar Size: {settings.avatarSize}px</Label>
            <Slider
              value={[settings.avatarSize]}
              data-disabled={!settings.showAvatar}
              className='w-full h-4 data-[disabled=true]:opacity-30'
              onValueChange={e =>
                settings.showAvatar
                  ? setSettings(prev => ({ ...prev, avatarSize: e[0] }))
                  : null
              }
              max={100}
              step={5}
            />
          </div>

          <div>
            <Label>Animation Speed: {settings.animationSpeed}s</Label>
            <Slider
              value={[settings.animationSpeed]}
              className='w-full h-4'
              onValueChange={e =>
                setSettings(prev => ({ ...prev, animationSpeed: e[0] }))
              }
              max={3}
              step={0.1}
            />
          </div>
        </div>
        <div className='flex flex-col gap-3 w-full'>
          <div>
            <Label>Max Messages</Label>
            <input
              type='number'
              min='1'
              max='10'
              value={settings.maxMessages}
              onChange={e =>
                setSettings(prev => ({
                  ...prev,
                  maxMessages: parseInt(e.target.value),
                }))
              }
              className='w-full p-1 border rounded'
            />
          </div>
          <div>
            <Label>Message Position</Label>
            <Select
              value={settings.appearPosition}
              disabled={!settings.appearPosition}
              onValueChange={(value: 'top' | 'bottom') =>
                setSettings(prev => ({ ...prev, appearPosition: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select time format' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='bottom'>Bottom</SelectItem>
                <SelectItem value='top'>top</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center justify-between'>
            <Label>Show User Colors</Label>
            <Switch
              checked={settings.showUserColors}
              onCheckedChange={checked =>
                setSettings(prev => ({
                  ...prev,
                  showUserColors: checked,
                }))
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label>Show Timestamp</Label>
            <Switch
              checked={settings.showTimestamp}
              onCheckedChange={checked =>
                setSettings(prev => ({
                  ...prev,
                  showTimestamp: checked,
                }))
              }
            />
          </div>

          <div>
            <Label>Time Format</Label>
            <Select
              value={settings.timestampFormat}
              disabled={!settings.showTimestamp}
              onValueChange={(value: '12h' | '24h') =>
                setSettings(prev => ({ ...prev, timestampFormat: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select time format' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='24h'>24-hour</SelectItem>
                <SelectItem value='12h'>12-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center justify-between'>
            <Label>Show Badges</Label>
            <Switch
              checked={settings.showBadges}
              onCheckedChange={checked =>
                setSettings(prev => ({
                  ...prev,
                  showBadges: checked,
                }))
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label>Show Emotes</Label>
            <Switch
              checked={settings.showEmotes}
              onCheckedChange={checked =>
                setSettings(prev => ({
                  ...prev,
                  showEmotes: checked,
                }))
              }
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className='flex flex-col w-full gap-2'>
          <div className='flex items-center gap-1 w-full'>
            <Input
              readOnly
              value={`${hostname}/stream/overlays/chat?${createUrlSearchParams(
                settings,
              )}&username=${username}`}
              className='w-full'
            />
            <Button
              onClick={() =>
                copyToClipboard(
                  `${hostname}/stream/overlays/chat?${createUrlSearchParams(
                    settings,
                  )}&username=${username}`,
                )
              }
            >
              <ClipboardIcon />
              Copy URL
            </Button>
          </div>
          <Separator />
          {/* <Button onClick={addMessageExample}>Test</Button> */}
        </div>
      </CardFooter>
    </Card>
  )
}
export default ChatOverlay
