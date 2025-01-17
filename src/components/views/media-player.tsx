'use client'
import Hls from 'hls.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaLoadingIndicator,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaCaptionsButton,
  MediaAirplayButton,
  MediaPipButton,
  MediaFullscreenButton,
  MediaPosterImage,
} from 'media-chrome/dist/react'
import * as hlsElement from 'hls-video-element/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { InfoIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from '../ui/button'
// https://0gr3uomttgr31hcj3fa3dnmmoqisgammept3145btfi5gncbt.realcrius.com/pull-hls-l1-va01.tiktokcdn.com/game/stream-2998869941814820960_or4/playlist.m3u8?expire=1738188461&session_id=074-20250115220739B7DF93EC740FA2291807&sign=d4273fb0553a836e8f6c0373beea8900&wsSession=0f9d4aa37e1767e0177b8ca9-173697890051887&wsIPSercert=c460a69ebe96a27b511379dff174e084&wsiphost=local&wsBindIP=1
const MEDIA_SERVER = [
  'https://server-tt.zeranel.dev/proxy-stream/',
  'https://media-tt1.zeranel.dev/proxy-stream/',
]
function reverse(str: string) {
  return str.split('').reverse().join('').split(' ').reverse().join(' ')
}
export default function VideoPlayer({ src }: { src: string }) {
  const { username } = useSelector(({ setting }: RootState) => setting)
  const { connected, live } = useSelector(
    ({ connection }: RootState) => connection,
  )
  const [proxyStreamUrl, setProxyStreamUrl] = useState('-1')
  const [hlsLocal, setHLSLocal] = useState<Hls | null>(null)
  const computedSrc = useMemo(() => {
    if (proxyStreamUrl !== '-1') {
      return proxyStreamUrl + reverse(Buffer.from(src).toString('base64')) + '/'
    }
    return src
  }, [proxyStreamUrl, src])
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if ((!connected || !live) && hlsLocal) {
      hlsLocal.stopLoad()
      hlsLocal.detachMedia()
    }
  }, [connected, live])
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.controls = false
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = computedSrc
    } else if (src.includes('.flv')) {
      import('flv.js').then(flvjs => {
        if (flvjs.default.isSupported()) {
          var flvPlayer = flvjs.default.createPlayer({
            type: 'flv',
            url: src,
          })
          flvPlayer.attachMediaElement(video)
          flvPlayer.load()
        }
      })
    } else if (Hls.isSupported()) {
      let hls = hlsLocal
      if (!hlsLocal) {
        hls = new Hls()
        setHLSLocal(hls)
      }
      hls?.loadSource(computedSrc)
      hls?.attachMedia(video)
    } else {
      console.error(
        'This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API',
      )
    }
    // video.onloadedmetadata = function () {
    //   if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
    //     try {
    //       if (document.pictureInPictureElement) {
    //         document.exitPictureInPicture()
    //       }
    //       video.requestPictureInPicture()
    //     } catch (err) {
    //       console.error(err)
    //     }
    //   }
    // }
  }, [computedSrc, videoRef])
  const primaryColor = 'white'
  const chromeStyles = {
    '--media-icon-color': primaryColor,
    '--media-range-thumb-background': primaryColor,
    '--media-range-bar-color': primaryColor,
    color: primaryColor,
    width: '100%',
  }
  return (
    <div className='w-full flex flex-col items-center justify-center gap-2'>
      <div className='px-5 bg-black w-full lg:w-[500px] flex items-center justify-center'>
        <MediaController style={chromeStyles} defaultSubtitles>
          <video
            slot='media'
            ref={videoRef}
            controls={false}
            preload='auto'
            autoPlay
            muted
            className='w-full h-full lg:h-[400px] object-fit flex px-5'
            crossOrigin=''
          />
          <MediaLoadingIndicator
            noautohide
            slot='centered-chrome'
            // style={{ "--media-loading-indicator-icon-height": "200px" }}
          ></MediaLoadingIndicator>
          <div
            ref={el => {
              el?.toggleAttribute('noautohide', true)
            }}
            slot='centered-chrome'
            className='flex flex-col select-none opacity-30 rotate-45'
          >
            <div className='lg:text-4xl font-extrabold'>@{username}</div>
            <div className='text-2xl font-extrabold'>tiktok.zeranel.dev</div>
          </div>
          <MediaControlBar>
            <MediaPlayButton></MediaPlayButton>
            <MediaSeekBackwardButton seekOffset={10}></MediaSeekBackwardButton>
            <MediaSeekForwardButton seekOffset={10}></MediaSeekForwardButton>
            {!src.includes('flv') && <MediaTimeRange></MediaTimeRange>}
            <MediaTimeDisplay showDuration></MediaTimeDisplay>
            <MediaVolumeRange></MediaVolumeRange>
            <MediaPlaybackRateButton></MediaPlaybackRateButton>
            <MediaPipButton></MediaPipButton>
            <MediaFullscreenButton></MediaFullscreenButton>
          </MediaControlBar>
        </MediaController>
      </div>
      {!src.includes('flv') && (
        <div className='flex items-center gap-2'>
          <Select value={proxyStreamUrl} onValueChange={setProxyStreamUrl}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Media Server Proxy' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='-1'>-- No proxy --</SelectItem>
              {MEDIA_SERVER.map((server, index) => (
                <SelectItem key={index} value={server}>
                  Server {index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <HoverCard>
            <HoverCardTrigger asChild>
              <InfoIcon className='opacity-50' size={18} />
            </HoverCardTrigger>
            <HoverCardContent className='w-80'>
              <div className='flex justify-between space-x-4'>
                Use or change proxy if the media streaming not working!
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      )}
    </div>
  )
}
