'use client'
import AppLayout from '@/components/app-layout'
import { isLogsExist } from '@/components/selector/logs'
import EngagementChart from '@/components/views/engagement-chart'
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
  return (
    <AppLayout>
      <Temporary />
    </AppLayout>
  )
}

function Temporary() {
  const { live, connected } = useSelector((state: any) => state.connection)
  const logs = useSelector(isLogsExist)
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-2 w-full justify-items-stretch justify-align-start h-fit p-2'>
      {(live && connected) || logs ? (
        <>
          <RoomInfoComponent />
          <div className='w-full lg:col-span-3 flex items-start flex-col lg:flex-row gap-2'>
            <ExpandableChart />
            <EngagementChart />
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
