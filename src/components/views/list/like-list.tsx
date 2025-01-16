"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { Separator } from "@/components/ui/separator";
import BubblePerson from "../bubble-person";
import BubbleTime from "../bubble-time";
import { useSelector } from "react-redux";
import { LogData } from "@/lib/types/log";
import { likes } from "@/components/selector/logs";

export default function LikeList() {
    const [list, setList] = useState<LogData[]>([])
    const logs = useSelector(likes)
    const logsRef = useRef<LogData[]>(logs);

    useEffect(() => {
        logsRef.current = logs;
    }, [logs]);
    const debouncedUpdateList = useRef(
        debounce(() => {
            setList([...logsRef.current]);
        }, 300)
    ).current;
    useEffect(() => {
        debouncedUpdateList(); // Call debounced function
        return () => debouncedUpdateList.cancel(); // Clean up on unmount
    }, [logs]);
    return (
        <Card className="text-sm">
            <CardHeader>
                <CardTitle>
                    Like
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
                <ScrollArea className="h-[200px] rounded-md py-2 flex flex-col gap-2 w-full">
                    {
                        list.map((data, index) => (
                            <div key={index} className="flex items-start justify-items-start gap-2">
                                <BubbleTime time={data.createTime} />
                                <div className="flex flex-col items-start shrink">
                                    <BubblePerson logsData={data} />
                                    <div className="text-left">Send <b>{data.likeCount} likes</b></div>
                                </div>
                            </div>
                        ))
                    }
                </ScrollArea>
            </CardContent>
        </Card>

    )
}