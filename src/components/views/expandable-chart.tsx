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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import MenuBarChart from './summary'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import NumberFlow from '@number-flow/react'
import { useSelector } from 'react-redux'
import { getAllLogs } from '../selector/logs'
import { LogEntry } from '@/store/logsSlice'
import { getMinutesData, simplifyNumber } from '@/lib/helper/transform'
import { RootState } from '@/store'

type ChartData = {
  [key: string]: {
    createTime: string
    gift: number
    view: number
    like: number
    comment: number
    share: number
    follow: number
    subscribe: number
    mic_armies: number
  }
}

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  view: {
    label: 'View',
    color: 'hsl(var(--chart-1))',
  },
  like: {
    label: 'Likes',
    color: 'hsl(var(--chart-2))',
  },
  comment: {
    label: 'Comments',
    color: 'hsl(var(--chart-3))',
  },
  gift: {
    label: 'Gifts',
    color: 'hsl(var(--chart-4))',
  },
  share: {
    label: 'Shares',
    color: 'hsl(var(--chart-5))',
  },
  follow: {
    label: 'Followers',
    color: 'hsl(var(--chart-5))',
  },
  currentViewers: {
    label: 'Viewers',
    color: 'hsl(var(--chart-6))',
  },
} satisfies ChartConfig

export default function ExpandableChart() {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable()
  const contentRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [activeChart, setActiveChart] = useState<string[]>([
    'like',
    'comment',
    'gift',
  ])
  const logs = useSelector(getAllLogs)
  const [processedLogs, setProcessedLogs] = useState<LogEntry[]>([])
  const logEntriesRef = useRef<LogEntry[]>([])
  const lastProcessedIndexRef = useRef(0) // Track last processed index
  const processingRef = useRef(false)
  const debounceLogs = useCallback(
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
    if (logs?.length) {
      processLogsInBatch(logs)
    } else {
      logEntriesRef.current = []
      lastProcessedIndexRef.current = 0
      debounceLogs.cancel() // Cancel any ongoing debounced process
      setProcessedLogs([]) // Clear the UI logs
      processingRef.current = false // Reset processing state
    }
  }, [logs, processLogsInBatch])
  useEffect(() => {
    return () => {
      logEntriesRef.current = []
      lastProcessedIndexRef.current = 0
      processingRef.current = false
    }
  }, [])
  const transformedData = useCallback(() => {
    return (
      Object.values(getMinutesData(processedLogs)) as {
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
      }[]
    ).map(
      ({
        rawTime,
        gift,
        view,
        like,
        comment,
        share,
        follow,
        subscribe,
        mic_armies,
        currentViewers,
      }) => ({
        createTime: moment(moment.unix(parseInt(rawTime) / 1000)).format(
          'HH:mm',
        ),
        gift,
        view,
        like,
        comment,
        follow,
        share,
        subscribe,
        mic_armies,
        currentViewers,
      }),
    )
  }, [processedLogs])
  const lastDate = useCallback(() => {
    if (processedLogs.length === 0) return ''
    const last = processedLogs
      .map((log: LogEntry) => {
        const { timestamp } = log
        return timestamp
      })
      .sort((a: number, b: number) => a - b)
    return moment(moment.unix(last[0])).fromNow()
  }, [processedLogs])

  // Final Data
  const transformedDataArray = useMemo(
    () => transformedData(),
    [transformedData],
  )
  type t = {
    createTime: string
    gift: number
    view: number
    like: number
    comment: number
    follow: number
    share: number
    subscribe: number
    mic_armies: number
    currentViewers: number
  }
  const countTotal = (key: keyof t) =>
    simplifyNumber(
      transformedDataArray.reduce(
        (acc, curr) => acc + (curr[key] as number),
        0,
      ),
    )

  const total = useMemo(() => {
    return {
      like: countTotal('like'),
      view: countTotal('view'),
      comment: countTotal('comment'),
      gift: countTotal('gift'),
      share: countTotal('share'),
      follow: countTotal('follow'),
    }
  }, [transformedDataArray])
  useEffect(() => {
    const updateWidth = () => {
      if (contentRef.current) {
        setWidth(contentRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0)
    }
  }, [isExpanded, animatedHeight])
  const removeActiveChart = (val: string) => {
    const temporary = [...activeChart]
    const findIndex = temporary.findIndex(x => x == val)
    if (findIndex === -1) {
      temporary.push(val)
    } else {
      temporary.splice(findIndex, 1)
    }
    setActiveChart(temporary)
  }
  return (
    <Card className='w-full transition-all duration-300 hover:shadow-lg pb-0 h-fit'>
      <div className='flex flex-col lg:flex-row justify-around items-center w-full border-b'>
        <CardHeader
          className='space-y-1 p-0 cursor-pointer w-full'
          onClick={toggleExpand}
        >
          <div className='space-y-1 py-5 lg:pl-10 flex flex-col items-center lg:items-start w-full'>
            <h3 className='text-2xl font-semibold'>Activity Graph</h3>
            <span className='text-sm text-muted-foreground'>
              Update in every 5s
            </span>
          </div>
        </CardHeader>
        <div className='px-5 py-2'>
          <MenuBarChart />
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
                    <ChartContainer
                      config={chartConfig}
                      className='aspect-auto h-[350px] w-full'
                    >
                      <AreaChart data={transformedDataArray}>
                        <defs>
                          <linearGradient
                            id='fillViewers'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='var(--color-viewers)'
                              stopOpacity={0.8}
                            />
                            <stop
                              offset='95%'
                              stopColor='var(--color-viewers)'
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id='fillView'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='var(--color-view)'
                              stopOpacity={0.8}
                            />
                            <stop
                              offset='95%'
                              stopColor='var(--color-view)'
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id='fillLike'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='var(--color-like)'
                              stopOpacity={0.8}
                            />
                            <stop
                              offset='95%'
                              stopColor='var(--color-like)'
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id='fillFollow'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='var(--color-follow)'
                              stopOpacity={0.8}
                            />
                            <stop
                              offset='95%'
                              stopColor='var(--color-follow)'
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id='fillComment'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='var(--color-comment)'
                              stopOpacity={0.8}
                            />
                            <stop
                              offset='95%'
                              stopColor='var(--color-comment)'
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id='fillGift'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='var(--color-gift)'
                              stopOpacity={0.8}
                            />
                            <stop
                              offset='95%'
                              stopColor='var(--color-gift)'
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id='fillShare'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='5%'
                              stopColor='var(--color-share)'
                              stopOpacity={0.8}
                            />
                            <stop
                              offset='95%'
                              stopColor='var(--color-share)'
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey='createTime'
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          minTickGap={32}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator='dot' />}
                        />

                        {/* {isExpanded && (
                          <Area
                            dataKey='currentViewers'
                            // type='natural'
                            fill='url(#fillViewers)'
                            // stroke='var(--color-viewers)'
                            stackId='b'
                          />
                        )} */}

                        {((isExpanded && activeChart.includes('view')) ||
                          activeChart == undefined) && (
                          <Area
                            dataKey='view'
                            type='natural'
                            fill='url(#fillView)'
                            stroke='var(--color-View)'
                            stackId='a'
                          />
                        )}
                        {((isExpanded && activeChart.includes('like')) ||
                          activeChart == undefined) && (
                          <Area
                            dataKey='like'
                            type='natural'
                            fill='url(#fillLike)'
                            stroke='var(--color-like)'
                            stackId='a'
                          />
                        )}
                        {((isExpanded && activeChart.includes('comment')) ||
                          activeChart == undefined) && (
                          <Area
                            dataKey='comment'
                            type='natural'
                            fill='url(#fillComment)'
                            stroke='var(--color-comment)'
                            stackId='a'
                          />
                        )}
                        {((isExpanded && activeChart.includes('gift')) ||
                          activeChart == undefined) && (
                          <Area
                            dataKey='gift'
                            type='natural'
                            fill='url(#fillGift)'
                            stroke='var(--color-gift)'
                            stackId='a'
                          />
                        )}
                        {((isExpanded && activeChart.includes('share')) ||
                          activeChart == undefined) && (
                          <Area
                            dataKey='share'
                            type='natural'
                            fill='url(#fillShare)'
                            stroke='var(--color-share)'
                            stackId='a'
                          />
                        )}
                        {((isExpanded && activeChart.includes('follow')) ||
                          activeChart == undefined) && (
                          <Area
                            dataKey='follow'
                            type='natural'
                            fill='url(#fillFollow)'
                            stroke='var(--color-follow)'
                            stackId='a'
                          />
                        )}

                        <ChartLegend content={<ChartLegendContent />} />
                      </AreaChart>
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
            {['view', 'like', 'comment', 'gift', 'share', 'follow'].map(
              (key, i) => {
                const chart = key as keyof typeof chartConfig
                return (
                  <button
                    disabled={!isExpanded}
                    key={chart}
                    data-active={activeChart.includes(chart)}
                    className='w-full flex flex-1 flex-col items-center justify-center gap-1 border-t px-0 lg:px-6 py-3 lg:py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
                    onClick={() => removeActiveChart(key)}
                  >
                    <span className='text-xs text-muted-foreground'>
                      {chartConfig[chart].label}
                    </span>
                    <span className='text-lg font-bold leading-none sm:text-3xl'>
                      <NumberFlow
                        value={total[key as keyof typeof total].value}
                        transformTiming={{
                          duration: 500,
                          easing: 'ease-out',
                        }}
                      />
                      {total[key as keyof typeof total].pembilangan}
                    </span>
                  </button>
                )
              },
            )}
          </div>
          <span className='px-3 py-3  text-sm text-muted-foreground'>
            Latest activity at {lastDate()}
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
    // Calculate direction only if viewers changed
    if (viewers > prevViewersRef.current) {
      setChangeDirection('up')
    } else if (viewers < prevViewersRef.current) {
      setChangeDirection('down')
    }

    // Update the ref after calculating changeDirection
    prevViewersRef.current = viewers
  }, [viewers])

  const showData = useMemo(() => simplifyNumber(viewers), [viewers])

  return (
    <div className='w-full flex flex-1 flex-col items-center justify-center gap-1 border-t px-0 lg:px-6 py-3 lg:py-4 text-left even:border-l bg-primary sm:border-l sm:border-t-0 sm:px-8 sm:py-6'>
      <span className='text-xs text-white font-bold'>Current Viewers</span>
      <span className='text-lg font-bold leading-none sm:text-3xl flex items-center'>
        {/* Display the animated number */}
        <NumberFlow
          value={showData.value}
          transformTiming={{
            duration: 500,
            easing: 'ease-out',
          }}
        />
        {showData.pembilangan}

        {/* Show the direction indicator */}
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
