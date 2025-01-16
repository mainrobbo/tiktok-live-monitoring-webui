'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { ActivityType } from '@/lib/types/common'
import { Separator } from '@/components/ui/separator'
import BubblePerson from '../bubble-person'
import BubbleTime from '../bubble-time'
import { LogData } from '@/lib/types/log'
import { useSelector } from 'react-redux'
import { gift } from '@/components/selector/logs'

export default function GiftList() {
  const [list, setList] = useState<LogData[]>([])
  const logs = useSelector(gift)
  const logsRef = useRef<LogData[]>(logs)

  useEffect(() => {
    logsRef.current = logs
  }, [logs])
  const debouncedUpdateList = useRef(
    debounce(() => {
      setList([...logsRef.current])
    }, 300),
  ).current
  useEffect(() => {
    debouncedUpdateList()
    return () => debouncedUpdateList.cancel()
  }, [logs])
  return (
    <Card className='text-sm'>
      <CardHeader>
        <CardTitle>Gifts</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <ScrollArea className='h-[200px] rounded-md p-4 flex flex-col gap-2 w-full'>
          {list.map((data, index) => (
            <div
              key={index}
              className='flex items-start justify-items-start gap-2'
            >
              <BubbleTime time={data.createTime} />
              <div className='flex flex-col items-start shrink'>
                <BubblePerson logsData={data} />
                <div
                  className='text-left w-full break-words flex items-center gap-1'
                  title={
                    typeof data.diamondCount !== 'undefined'
                      ? `${data.diamondCount} each - Total ${
                          data.diamondCount * data.repeatCount
                        }`
                      : ''
                  }
                >
                  {data.isStreak ? 'Sending gift ' : 'Has sent gift '}
                  <div
                    className='w-4 h-4 bg-cover bg-center'
                    style={{ backgroundImage: `url("${data.giftPictureUrl}")` }}
                  ></div>
                  {data.giftName} x{data.repeatCount}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
