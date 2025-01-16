'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { Separator } from '@/components/ui/separator'
import BubblePerson from '../bubble-person'
import BubbleTime from '../bubble-time'
import { useSelector } from 'react-redux'
import { LogData } from '@/lib/types/log'
import { views } from '@/components/selector/logs'

export default function ViewList() {
  const [list, setList] = useState<LogData[]>([])
  const logs = useSelector(views)
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
        <CardTitle>Views</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <ScrollArea className='h-[200px] rounded-md py-2 flex flex-col gap-2 w-full'>
          {list.map((data, index) => (
            <div
              key={index}
              className='flex items-start justify-items-start gap-2'
            >
              <BubbleTime time={data.createTime} />
              <div className='flex flex-col items-start shrink'>
                <BubblePerson logsData={data} />
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
