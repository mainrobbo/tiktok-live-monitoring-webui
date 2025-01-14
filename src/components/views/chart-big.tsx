"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { AppContext } from "../app-context"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { ActivityType, LogsData } from "@/lib/types/common"
import moment from "moment"
import { debounce } from "lodash"
import NumberFlow from "@number-flow/react"

import MenuBarChart from "./summary"
type ChartData = { createTime: string } & { [key in ActivityType]: number }


const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    view: {
        label: "Viewers",
        color: "hsl(var(--chart-1))",
    },
    like: {
        label: "Likes",
        color: "hsl(var(--chart-2))",
    },
    comment: {
        label: "Comments",
        color: "hsl(var(--chart-3))",
    },
    gift: {
        label: "Gifts",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export default function ChartBig() {
    const [activeChart, setActiveChart] = useState<string[]>(["view", "like", "comment", "gift"])
    const { logs } = useContext(AppContext)
    const [debouncedLogs, setDebouncedLogs] = useState(logs);
    const debouncedSetLogs = useMemo(
        () => debounce((logs) => setDebouncedLogs(logs), 500), []);

    useEffect(() => {
        debouncedSetLogs(logs);
    }, [logs, debouncedSetLogs]);
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
    const transformedData = useCallback(() => {
        const countOccurrences = debouncedLogs.reduce((res: { [key: string]: ChartData }, log: LogsData) => {
            const { data, type } = log;
            const { createTime: time, likeCount }: { createTime: string, likeCount: number } = data;
            const createTime = moment(moment.unix(Math.round(parseInt(time) / 1000))).format('hh:mm');
            if (!res[createTime]) {
                res[createTime] = { createTime, gift: 0, view: 0, like: 0, comment: 0 };
            }
            if (type == ActivityType.LIKE) {
                res[createTime][type as ActivityType] += likeCount
            } else { res[createTime][type as ActivityType]++; }
            return res;
        }, {} as ChartData);

        return (Object.values(countOccurrences) as ChartData[]).map(({ createTime, gift, view, like, comment }) => ({
            createTime,
            gift,
            view,
            like,
            comment
        }));
    }, [debouncedLogs]);
    // TODO Bug - Reproduce: Start - Stop.
    const transformedDataArray = useMemo(() => transformedData(), [transformedData]); // Only depend on transformedData
    const total = useMemo(
        () => ({
            like: transformedDataArray.reduce((acc, curr) => acc + (curr.like as number), 0),
            view: transformedDataArray.reduce((acc, curr) => acc + (curr.view as number), 0),
            comment: transformedDataArray.reduce((acc, curr) => acc + (curr.comment as number), 0),
            gift: transformedDataArray.reduce((acc, curr) => acc + (curr.gift as number), 0),
        }),
        [transformedDataArray] // Depend on transformedDataArray instead of debouncedLogs
    );
    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Activity Traffic</CardTitle>
                    <CardDescription>
                        Update in every 5s
                    </CardDescription>
                    <MenuBarChart />
                </div>
                <div className="flex">
                    {["view", "like", "comment", "gift"].map((key, i) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart.includes(chart)}
                                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => removeActiveChart(key)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    <NumberFlow
                                        value={total[key as keyof typeof total]}
                                        transformTiming={{
                                            duration: 500,
                                            easing: "ease-out",
                                        }}
                                    />

                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={transformedDataArray}>
                        <defs>
                            <linearGradient id="fillView" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-view)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-view)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillLike" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-like)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-like)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillComment" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-comment)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-comment)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillGift" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-gift)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-gift)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="createTime"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}

                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent

                                    indicator="dot"
                                />
                            }
                        />
                        {(activeChart.includes('view') || activeChart == undefined) && <Area
                            dataKey="view"
                            type="natural"
                            fill="url(#fillView)"
                            stroke="var(--color-View)"
                            stackId="a"
                        />}
                        {(activeChart.includes("like") || activeChart == undefined) && <Area
                            dataKey="like"
                            type="natural"
                            fill="url(#fillLike)"
                            stroke="var(--color-like)"
                            stackId="a"
                        />}
                        {(activeChart.includes("comment") || activeChart == undefined) && <Area
                            dataKey="comment"
                            type="natural"
                            fill="url(#fillComment)"
                            stroke="var(--color-comment)"
                            stackId="a"
                        />}
                        {(activeChart.includes("gift") || activeChart == undefined) && <Area
                            dataKey="gift"
                            type="natural"
                            fill="url(#fillGift)"
                            stroke="var(--color-Gift)"
                            stackId="a"
                        />}


                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
