'use client'

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpCircleIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { useExpandable } from '@/hooks/use-expandable'
import { debounce } from 'lodash'
import moment from 'moment'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts'
import NumberFlow from '@number-flow/react'
import { useSelector } from 'react-redux'
import { getAllLogs } from '../selector/logs'
import { LogEntry } from '@/store/logsSlice'
import { getMinutesData, simplifyNumber } from '@/lib/helper/transform'
import { RootState } from '@/store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const chartConfig = {
  egr: {
    label: 'Engagement Rate',
    color: 'hsl(var(--chart-1))',
  },
  currentViewers: {
    label: 'Current Viewers',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export default function EngagementChart() {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable()
  const contentRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const logs = useSelector(getAllLogs)
  const [processedLogs, setProcessedLogs] = useState<LogEntry[]>([])
  const logEntriesRef = useRef<LogEntry[]>([])
  const lastProcessedIndexRef = useRef(0)
  const processingRef = useRef(false)
  const availableMinutesRef = useRef(0)

  const [period, setPeriod] = useState('1')

  const debounceLogs = useMemo(
    () =>
      debounce(
        (newLogs: LogEntry[]) => {
          setProcessedLogs(newLogs)
          processingRef.current = false
          lastProcessedIndexRef.current = logEntriesRef.current.length
        },
        1000,
        { maxWait: 2000 },
      ),
    [],
  )

  const processLogsInBatch = useCallback(
    (newLogs: LogEntry[]) => {
      if (!processingRef.current) {
        processingRef.current = true
        const uniqueLogs = logEntriesRef.current.slice(
          lastProcessedIndexRef.current,
        )
        const combinedLogs = [...uniqueLogs, ...newLogs]
        logEntriesRef.current = combinedLogs
        debounceLogs(combinedLogs)
      } else {
        logEntriesRef.current = [...logEntriesRef.current, ...newLogs]
      }
    },
    [debounceLogs],
  )

  useEffect(() => {
    return () => {
      debounceLogs.cancel()
      logEntriesRef.current = []
      lastProcessedIndexRef.current = 0
      processingRef.current = false
    }
  }, [debounceLogs])

  useEffect(() => {
    if (logs?.length) {
      processLogsInBatch(logs)
    } else {
      logEntriesRef.current = []
      lastProcessedIndexRef.current = 0
      debounceLogs.cancel()
      setProcessedLogs([])
      processingRef.current = false
    }
  }, [logs, processLogsInBatch, debounceLogs])

  const transformedData = useMemo(() => {
    const minutesData = getMinutesData(processedLogs, parseInt(period))
    availableMinutesRef.current = Object.keys(minutesData).length
    return Object.values(minutesData) as Array<{
      rawTime: string
      gift: number
      view: number
      like: number
      comment: number
      follow: number
      share: number
      subscribe: number
      mic_armies: number
      currentViewers: number
    }>
  }, [processedLogs, period])

  const transformedDataArray = useMemo(
    () =>
      transformedData.map(
        ({
          rawTime,
          gift,
          view,
          like,
          comment,
          share,
          follow,
          subscribe,
          currentViewers,
        }) => {
          const averageViewers = currentViewers / parseInt(period)
          const totalActivities =
            like + comment + share + follow + subscribe + gift + view
          const engagementRate =
            averageViewers > 0 ? totalActivities / averageViewers : 0
          return {
            createTime: moment(moment.unix(parseInt(rawTime) / 1000)).format(
              'HH:mm',
            ),
            egr: (engagementRate * 100).toFixed(2),
            currentViewers,
          }
        },
      ),
    [transformedData, period],
  )

  const lastEngagementRate = useMemo(() => {
    if (transformedDataArray.length < 2) return 0
    return Number(transformedDataArray[transformedDataArray.length - 2].egr)
  }, [transformedDataArray])

  const averageEngagementRate = useMemo(() => {
    if (transformedDataArray.length < 2) return 0
    const currentEgr = Number(
      transformedDataArray[transformedDataArray.length - 2].egr,
    )
    const previousEgr = Number(
      transformedDataArray[transformedDataArray.length - 3]?.egr || currentEgr,
    )
    return ((currentEgr + previousEgr) / 2).toFixed(2)
  }, [transformedDataArray])

  const lastDate = useMemo(() => {
    if (processedLogs.length === 0) return ''
    const timestamps = processedLogs.map(log => log.timestamp)
    return moment(moment.unix(Math.min(...timestamps))).fromNow()
  }, [processedLogs])

  useEffect(() => {
    const updateWidth = () => {
      if (contentRef.current) {
        setWidth(contentRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0)
    }
  }, [isExpanded, animatedHeight])

  return (
    <Card className='w-full lg:w-2/3 transition-all duration-300 hover:shadow-lg pb-0 h-fit'>
      <div className='flex flex-col lg:flex-row justify-around items-center w-full border-b'>
        <CardHeader
          className='space-y-1 p-0 cursor-pointer w-full'
          onClick={toggleExpand}
        >
          <div className='space-y-1 py-5 lg:pl-10 flex flex-col items-center lg:items-start w-full'>
            <h3 className='text-2xl font-semibold'>Engagement Rate</h3>
            <span className='text-sm text-muted-foreground'>
              See trends and track engagement fluctuates
            </span>
          </div>
        </CardHeader>
        <div className='px-5 py-2'>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className='w-[100px]'>
              <SelectValue placeholder='Period' />
            </SelectTrigger>
            <SelectContent>
              {['1', '3', '5', '10', '30'].map(min => (
                <SelectItem
                  key={min}
                  value={min}
                  disabled={parseInt(min) > availableMinutesRef.current}
                >
                  {min} minute
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        style={{ height: animatedHeight }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className='overflow-hidden'
      >
        <div ref={contentRef}>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='space-y-4 pt-2'
              >
                <CardContent>
                  <div className='space-y-4'>
                    <ChartContainer config={chartConfig}>
                      <LineChart
                        accessibilityLayer
                        data={transformedDataArray}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey='createTime'
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator='line' />}
                        />
                        <Line
                          dataKey='currentViewers'
                          type='monotone'
                          stroke='var(--color-currentViewers)'
                          strokeWidth={2}
                          dot={{
                            fill: 'var(--color-currentViewers)',
                          }}
                          activeDot={{
                            r: 6,
                          }}
                        >
                          <LabelList
                            position='top'
                            offset={12}
                            className='fill-foreground'
                            fontSize={12}
                          />
                        </Line>
                        <Line
                          dataKey='egr'
                          type='monotone'
                          stroke='var(--color-egr)'
                          strokeWidth={2}
                          dot={{
                            fill: 'var(--color-egr)',
                          }}
                          activeDot={{
                            r: 6,
                          }}
                        >
                          <LabelList
                            position='top'
                            offset={12}
                            className='fill-foreground'
                            fontSize={12}
                          />
                        </Line>
                      </LineChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <CardFooter className='p-0 w-full'>
        <div className='flex flex-col w-full'>
          <div
            className={`grid grid-cols-2 lg:flex justify-items-stretch w-full border-b ${
              isExpanded ? `border-t` : `border-t-0`
            }`}
          >
            <CurrentViewers />
            <div className='w-full flex flex-1 flex-col items-center justify-center gap-1 border-t px-0 lg:px-6 py-3 lg:py-4 text-left even:border-l bg-primary sm:border-l sm:border-t-0 sm:px-8 sm:py-6'>
              <span className='text-xs text-white font-bold'>EGRS</span>
              <span className='text-lg font-bold leading-none sm:text-3xl flex items-center'>
                <NumberFlow
                  value={lastEngagementRate}
                  transformTiming={{
                    duration: 500,
                    easing: 'ease-out',
                  }}
                />
              </span>
              <span className='text-xs text-white'>
                Avg: {averageEngagementRate}%
              </span>
            </div>
          </div>
          <span className='px-3 py-3 text-sm text-muted-foreground'>
            Latest activity {lastDate}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
function CurrentViewers() {
  const { viewers } = useSelector((state: RootState) => state.liveInfo)
  const prevViewersRef = useRef<number>(viewers)
  const [changeDirection, setChangeDirection] = useState<'up' | 'down'>('down')

  useEffect(() => {
    if (viewers > prevViewersRef.current) {
      setChangeDirection('up')
    } else if (viewers < prevViewersRef.current) {
      setChangeDirection('down')
    }

    prevViewersRef.current = viewers
  }, [viewers])

  const showData = useMemo(() => simplifyNumber(viewers), [viewers])

  return (
    <div className='w-full flex flex-1 flex-col items-center justify-center gap-1 border-t px-0 lg:px-6 py-3 lg:py-4 text-left even:border-l bg-primary sm:border-l sm:border-t-0 sm:px-8 sm:py-6'>
      <span className='text-xs text-white font-bold'>Current Viewers</span>
      <span className='text-lg font-bold leading-none sm:text-3xl flex items-center'>
        <NumberFlow
          value={showData.value}
          transformTiming={{
            duration: 500,
            easing: 'ease-out',
          }}
        />
        {showData.pembilangan}
        <span
          className={`ml-2 transition-all ${
            changeDirection === 'up'
              ? 'text-emerald-500'
              : 'text-amber-500 rotate-180'
          }`}
        >
          <ArrowUpCircleIcon />
        </span>
      </span>
    </div>
  )
}
