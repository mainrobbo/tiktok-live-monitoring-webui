"use client"
import { AppContext } from "@/components/app-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContext, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { ActivityType, LogsData } from "@/lib/types/common";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import BubblePerson from "../bubble-person";
import BubbleTime from "../bubble-time";

export default function GiftList() {
    const [list, setList] = useState<LogsData[]>([])
    const { gifts: logs } = useContext(AppContext)
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
                <CardTitle>
                    Gifts
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
                <ScrollArea className="h-[200px] rounded-md p-4 flex flex-col gap-2 w-full">
                    {
                        list.map(({ data, isStreak }, index) => (
                            <div key={index} className="flex items-start justify-items-start gap-2">
                                <BubbleTime time={data.createTime} />
                                <div className="flex flex-col items-start shrink">
                                    <BubblePerson logsData={{ type: ActivityType.GIFT, data }} />
                                    <div className="text-left w-full break-words flex items-center gap-1" title={
                                        data.diamondCount &&
                                        `${data.diamondCount} each - Total ${data.diamondCount * data.repeatCount
                                        }`
                                    }>
                                        {isStreak ? "Sending gift " : "Has sent gift "}
                                        <div
                                            className="w-4 h-4 bg-cover bg-center"
                                            style={{ backgroundImage: `url("${data.giftPictureUrl}")` }}
                                        ></div>
                                        {data.giftName} x{data.repeatCount}

                                    </div>
                                </div>

                            </div>
                        ))
                    }
                </ScrollArea>
            </CardContent>
        </Card>

    )
}