'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { Separator } from '@/components/ui/separator'
import BubblePerson from '../bubble-person'
import BubbleTime from '../bubble-time'
import { useSelector } from 'react-redux'
import { getLimitedFollow } from '@/components/selector/logs'
import { LogEntry } from '@/store/logsSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { RootState } from '@/store'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
export default function FollowList({ defaultOpen = true }) {
  const [list, setList] = useState<LogEntry[]>([])
  const logs = useSelector((state: RootState) => getLimitedFollow(state))
  const chatsRef = useRef<LogEntry[]>(logs)
  const [expanded, setIsExpanded] = useState(defaultOpen)

  useEffect(() => {
    chatsRef.current = logs
  }, [logs])

  const debouncedUpdateList = useRef(
    debounce(
      () => {
        setList([...chatsRef.current])
      },
      300,
      { maxWait: 1000 },
    ),
  ).current

  useEffect(() => {
    debouncedUpdateList()
    return () => debouncedUpdateList.cancel()
  }, [logs])

  return (
    <Card className='text-sm h-fit transition-all w-full'>
      <CardHeader
        className='cursor-pointer select-none'
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <CardTitle>New Follower</CardTitle>
      </CardHeader>
      {expanded && <Separator />}
      <motion.div transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <AnimatePresence>
          <Collapsible
            open={expanded}
            onOpenChange={setIsExpanded}
            className='shadow-innerCustom'
          >
            <CollapsibleContent className='space-y-2 w-full'>
              <CardContent className='p-0 pl-2 pb-1'>
                <ScrollArea className='h-[250px] rounded-md flex flex-col gap-2 w-full'>
                  {list.map(({ data }, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -150 }}
                      animate={{ opacity: 100, x: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2 * index,
                      }}
                      key={data.msgId}
                      className='chat-bubble-container'
                    >
                      <BubbleTime time={data.createTime} />
                      <div className='flex flex-col items-start justify-start'>
                        <BubblePerson logsData={data} />
                      </div>
                    </motion.div>
                  ))}
                </ScrollArea>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </AnimatePresence>
      </motion.div>
    </Card>
  )
}
