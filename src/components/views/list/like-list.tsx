'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { Separator } from '@/components/ui/separator'
import BubblePerson from '../bubble-person'
import BubbleTime from '../bubble-time'
import { useSelector } from 'react-redux'
import { getLimitedLikes } from '@/components/selector/logs'
import { LogEntry } from '@/store/logsSlice'
import { AnimatePresence, motion } from 'framer-motion'

export default function LikeList() {
  const [list, setList] = useState<LogEntry[]>([])
  const logs = useSelector(getLimitedLikes)
  const logsRef = useRef<LogEntry[]>(logs)
  useEffect(() => {
    logsRef.current = logs
  }, [logs])
  const debouncedUpdateList = useRef(
    debounce(
      () => {
        setList([...logsRef.current])
      },
      500,
      { maxWait: 1000 },
    ),
  ).current
  useEffect(() => {
    debouncedUpdateList() // Call debounced function
    return () => debouncedUpdateList.cancel() // Clean up on unmount
  }, [logs])
  return (
    <Card className='text-sm'>
      <CardHeader>
        <CardTitle>Like</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <ScrollArea className='h-[200px] rounded-md py-2 flex flex-col gap-2 w-full pr-4'>
          <AnimatePresence>
            {list.map(({ data }) => (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 100, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                key={data.msgId}
                className='chat-bubble-container'
              >
                <BubbleTime time={data.createTime} />
                <div className='flex flex-col items-start shrink'>
                  <BubblePerson logsData={data} />
                  <div className='text-left'>
                    Send <b>{data.likeCount} likes</b>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
