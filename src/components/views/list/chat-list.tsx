'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { Separator } from '@/components/ui/separator'
import BubblePerson from '../bubble-person'
import BubbleTime from '../bubble-time'
import { useSelector } from 'react-redux'
import { getLimitedComments } from '@/components/selector/logs'
import { LogEntry } from '@/store/logsSlice'
import { AnimatePresence, motion } from 'framer-motion'

export default function ChatList() {
  const [list, setList] = useState<LogEntry[]>([])
  const logs = useSelector(getLimitedComments)
  const chatsRef = useRef<LogEntry[]>(logs)

  useEffect(() => {
    chatsRef.current = logs
  }, [logs])
  const debouncedUpdateList = useRef(
    debounce(
      () => {
        setList([...chatsRef.current])
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
        <CardTitle>Chats</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <ScrollArea className='h-[200px] rounded-md py-2 flex flex-col gap-2 w-full'>
          <AnimatePresence>
            {list.map(({ data }) => (
              <motion.div
                initial={{ opacity: 0, x: -150 }}
                animate={{ opacity: 100, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.3,
                }}
                key={data.msgId}
                className='chat-bubble-container'
              >
                <BubbleTime time={data.createTime} />
                <div className='flex flex-col'>
                  <BubblePerson logsData={data} />
                  <div className='text-left'>{data.comment}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
