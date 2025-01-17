'use client'
import { memo, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import VideoPlayer from './media-player'
import GameTagRoomInfo from './room-info/game-tag'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { getLiveInfo } from '../selector/liveInfo'
import { RoomInfo } from '@/lib/types/liveInfo'

const getStreamingUrl = (roomInfo: RoomInfo) => {
  if (
    !roomInfo?.stream_url?.hls_pull_url &&
    !roomInfo?.stream_url?.flv_pull_url
  )
    return false
  if (roomInfo?.stream_url?.hls_pull_url != '')
    return roomInfo?.stream_url?.hls_pull_url
  if (roomInfo?.stream_url?.flv_pull_url?.HD1 != '')
    return roomInfo?.stream_url?.flv_pull_url?.HD1
  if (roomInfo?.stream_url?.flv_pull_url?.SD1 != '')
    return roomInfo?.stream_url?.flv_pull_url?.SD1
  return false
}

const RoomInfoComponent = memo(() => {
  const { roomInfo } = useSelector(getLiveInfo)
  if (!roomInfo?.hashtag?.title) return <></>
  return (
    <div className='flex flex-col lg:flex-row items-start w-full lg:col-span-3 gap-2'>
      <Card className=''>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            {roomInfo.hashtag?.title && (
              <Button
                variant={'outline'}
                onClick={() =>
                  window.open(
                    `https://tiktok.com/live/${roomInfo.hashtag?.title?.toLowerCase()}`,
                    '_blank',
                  )
                }
                className='opacity-60 tracking-wide font-semibold uppercase'
              >
                #{roomInfo.hashtag?.title?.toLowerCase()}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getStreamingUrl(roomInfo) && (
            <div className='flex flex-col w-fit justify-center gap-2 items-center'>
              <Suspense fallback={<div>Loading...</div>}>
                <VideoPlayer src={getStreamingUrl(roomInfo) as string} />
              </Suspense>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className='w-full h-full'>
        <CardHeader>
          <CardTitle>
            <span className='font-medium tracking-wide text-muted-foreground'>
              Title:
            </span>{' '}
            {roomInfo?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {roomInfo?.game_tag && (
            <div className='flex items-start'>
              <GameTagRoomInfo
                tags={roomInfo?.game_tag}
                hashtag={roomInfo?.hashtag?.title?.toLowerCase()}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
})
export default RoomInfoComponent
