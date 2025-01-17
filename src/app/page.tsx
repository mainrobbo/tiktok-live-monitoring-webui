'use client'
import ExpandableChart from '@/components/views/expandable-chart'
import LandingPage from '@/components/views/landing'
import ChatList from '@/components/views/list/chat-list'
import FollowList from '@/components/views/list/follow-list'
import GiftList from '@/components/views/list/gift-list'
import LikeList from '@/components/views/list/like-list'
import ShareList from '@/components/views/list/share-list'
import ViewList from '@/components/views/list/view-list'
import RoomInfoComponent from '@/components/views/room-info'
import { useSelector } from 'react-redux'

export default function Home() {
  const { live, connected } = useSelector((state: any) => state.connection)
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-2 w-full justify-items-stretch justify-align-start h-fit p-2'>
      {live && connected ? (
        <>
          <RoomInfoComponent />
          <div className='w-full lg:col-span-3'>
            <ExpandableChart />
          </div>
          <ChatList />
          <LikeList />
          <GiftList />
          <ViewList defaultOpen={false} />
          <ShareList defaultOpen={false} />
          <FollowList defaultOpen={false} />
        </>
      ) : (
        <LandingPage />
      )}
    </div>
  )
}
