"use client"
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function BubbleTime({ time }: { time: string }) {
    const preferences = useSelector(({ preferences }: RootState) => preferences)
    const formatted = preferences.show_relative_timestamp
        ? moment(moment.unix(Math.round(parseInt(time) / 1000))).fromNow()
        : moment(moment.unix(Math.round(parseInt(time) / 1000))).format("hh:mm")
    return (
        <div className="text-muted-foreground w-fit">{formatted}</div>
    )
}