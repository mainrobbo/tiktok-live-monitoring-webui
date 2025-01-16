'use client'
import { debounce } from 'lodash'
import { ActivityType, LogsData } from '@/lib/types/common'
import { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { AppContext } from '../app-context.tsx.bak'
import NumberFlow from '@number-flow/react'

export default function CurrentStatistic() {
  // Render StatComponents for all activity types
  return (
    <div className='flex flex-col w-full px-3 text-xs'>
      {[
        ActivityType.COMMENT,
        ActivityType.GIFT,
        ActivityType.LIKE,
        ActivityType.VIEW,
      ].map(act => (
        <StatComponent key={act} type={act} />
      ))}
    </div>
  )
}

function StatComponent({ type }: { type: ActivityType }) {
  const [count, setCount] = useState(0)

  const data = useMemo(
    () => ({
      [ActivityType.COMMENT]: 'chats',
      [ActivityType.GIFT]: 'gifts',
      [ActivityType.LIKE]: 'likes',
      [ActivityType.VIEW]: 'views',
    }),
    [],
  )

  const ctx = useContext(AppContext)
  const logs = ctx[data[type]] || []

  const logsRef = useRef(logs)
  useEffect(() => {
    logsRef.current = logs
  }, [logs])

  const debouncedSetCount = useMemo(
    () =>
      debounce(() => {
        const count = logsRef.current.filter(
          (log: LogsData) => log.type === type,
        ).length
        setCount(count)
      }, 1000),
    [type],
  )

  useEffect(() => {
    debouncedSetCount()
    return () => debouncedSetCount.cancel()
  }, [logs, debouncedSetCount])

  return (
    <div className='flex items-center w-full justify-between uppercase'>
      <div>{type}</div>
      <NumberFlow
        value={count}
        transformTiming={{
          duration: 500,
          easing: 'ease-out',
        }}
      />
    </div>
  )
}
