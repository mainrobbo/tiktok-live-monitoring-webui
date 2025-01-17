'use client'
import { ArrowRight, LayoutDashboardIcon, WifiIcon } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from './ui/button'
import { useSidebar } from './ui/sidebar'

export default function AppNavbar() {
  const { live, connected } = useSelector(
    ({ connection }: { connection: RootState['connection'] }) => connection,
  )
  const { username } = useSelector(
    ({ setting }: { setting: RootState['setting'] }) => setting,
  )
  const { toggleSidebar } = useSidebar()
  return (
    <div className='sticky top-0 bg-background border-b p-2 z-50'>
      <div className='flex items-center justify-between'>
        <div>
          <Button
            size={'icon'}
            onClick={toggleSidebar}
            className='lg:hidden flex'
          >
            <LayoutDashboardIcon />
          </Button>
        </div>
        <div className='flex items-center gap-2'>
          {live ? (
            <>
              <div className='animate-pulse'>🔴</div>
              <Link href={`https://tiktok.com/@${username}/live`}>
                LIVE NOW
              </Link>
            </>
          ) : (
            <>⚫</>
          )}
        </div>
        <div className='flex items-center' title='Not connected to server'>
          <WifiIcon
            className={connected ? `text-emerald-500` : `text-red-500`}
          />
        </div>
      </div>
    </div>
  )
}
