"use client"
import { AppContext } from "@/components/app-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContext, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { ActivityType, LogsData } from "@/lib/types/common";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import BubblePerson from "../bubble-person";
import { MenuLike } from "../menu/menu-like";
import BubbleTime from "../bubble-time";

export default function LikeList() {
    const [list, setList] = useState<LogsData[]>([])
    const { likes: logs } = useContext(AppContext)
    const chatsRef = useRef<LogsData[]>(logs);
    useEffect(() => {
        chatsRef.current = logs;
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

                <div className="items-center flex justify-between">
                    <div className="flex flex-col">
                        <CardTitle>
                            Like
                        </CardTitle>
                        <CardDescription>
                            Latest likes
                        </CardDescription>
                    </div>
                    <MenuLike />
                </div>

            </CardHeader>

            <Separator />
            <CardContent>
                <ScrollArea className="h-[200px] rounded-md py-2 flex flex-col gap-2 w-full">
                    {
                        list.map(({ data }, index) => (
                            <div key={index} className="lg:flex lg:items-start grid grid-cols-1 gap-2 justify-items-start py-0.5">
                                <BubbleTime time={data.createTime} />
                                <div className="flex flex-col items-start shrink">
                                    <BubblePerson logsData={{ type: ActivityType.LIKE, data }} />
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