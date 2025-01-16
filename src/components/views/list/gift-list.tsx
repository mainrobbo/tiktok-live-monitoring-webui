'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { Separator } from '@/components/ui/separator'
import BubblePerson from '../bubble-person'
import BubbleTime from '../bubble-time'
import { useSelector } from 'react-redux'
import { getLimitedGift } from '@/components/selector/logs'
import { LogEntry } from '@/store/logsSlice'
import { AnimatePresence, motion } from 'framer-motion'

export default function GiftList() {
  const [list, setList] = useState<LogEntry[]>([])
  const logs = useSelector(getLimitedGift)
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
                      style={{
                        backgroundImage: `url("${data.giftPictureUrl}")`,
                      }}
                    ></div>
                    {data.giftName} x{data.repeatCount}
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
