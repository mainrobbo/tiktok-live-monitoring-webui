"use client"
import { AppContext } from "@/components/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContext, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { ActivityType, LogsData } from "@/lib/types/common";
import { Separator } from "@/components/ui/separator";
import BubblePerson from "../bubble-person";
import BubbleTime from "../bubble-time";

export default function ChatList() {
    const [list, setList] = useState<LogsData[]>([])
    const { comments: logs } = useContext(AppContext)
    console.log({ logs })
    const chatsRef = useRef<LogsData[]>(logs);
    useEffect(() => {
        chatsRef.current = logs;
        setList(logs)
    }, [logs]);
    const debouncedUpdateList = useRef(
        debounce(() => {
            setList([...chatsRef.current]);
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
                    Chats
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
                <ScrollArea className="h-[200px] rounded-md py-2 flex flex-col gap-2 w-full">
                    {
                        list.map(({ data }, index) => (
                            <div key={index} className="flex items-start justify-items-start gap-2">
                                {/* <BubbleTime time={data.createTime} /> */}
                                <div className="flex flex-col">
                                    {/* <BubblePerson logsData={{ type: ActivityType.COMMENT, data }} /> */}
                                    <div className="text-left">{data.comment}</div>
                                </div>

                            </div>
                        ))
                    }
                </ScrollArea>
            </CardContent>
        </Card>

    )
}