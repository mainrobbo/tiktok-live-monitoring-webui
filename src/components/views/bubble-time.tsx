"use client"
import moment from "moment";
import { useContext } from "react";
import { AppContext } from "../app-context";

export default function BubbleTime({ time }: { time: string }) {
    const { preferences } = useContext(AppContext)
    const formatted = preferences.show_relative_timestamp
        ? moment(moment.unix(Math.round(parseInt(time) / 1000))).fromNow()
        : moment(moment.unix(Math.round(parseInt(time) / 1000))).format("hh:mm")
    return (
        <div className="text-muted-foreground w-fit">{formatted}</div>
    )
}