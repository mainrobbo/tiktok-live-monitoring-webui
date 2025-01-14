"use client";
import { debounce } from "lodash";
import { ActivityType, LogsData } from "@/lib/types/common";
import { useContext, useEffect, useRef, useState, useMemo } from "react";
import { AppContext } from "../app-context";
import NumberFlow from "@number-flow/react";

export default function CurrentStatistic() {
    // Render StatComponents for all activity types
    return (
        <div className="flex flex-col w-full px-3 text-xs">
            {
                [ActivityType.COMMENT, ActivityType.GIFT, ActivityType.LIKE, ActivityType.VIEW].map((act) => (
                    <StatComponent key={act} type={act} />
                ))
            }
        </div>
    );
}

function StatComponent({ type }: { type: ActivityType }) {
    const [count, setCount] = useState(0);

    // Mapping activity type to the respective log key
    const data = useMemo(() => ({
        [ActivityType.COMMENT]: "chats",
        [ActivityType.GIFT]: "gifts",
        [ActivityType.LIKE]: "likes",
        [ActivityType.VIEW]: "views",
    }), []);

    const ctx = useContext(AppContext); // Access logs data from the context
    const logs = ctx[data[type]] || []; // Safely retrieve logs, default to empty array if none

    const logsRef = useRef(logs); // Create ref to store logs data for debouncing

    // Update logsRef whenever logs change
    useEffect(() => {
        logsRef.current = logs;
    }, [logs]);

    // Memoizing the debounced count calculation to avoid re-creating it unnecessarily
    const debouncedSetCount = useMemo(() =>
        debounce(() => {
            const count = logsRef.current.filter((log: LogsData) => log.type === type).length;
            setCount(count);
        }, 500), [type]);

    // Trigger debounced update whenever logs change
    useEffect(() => {
        debouncedSetCount(); // Perform the debounced count calculation
        return () => debouncedSetCount.cancel(); // Clean up on unmount or type change
    }, [logs, debouncedSetCount]);

    return (
        <div className="flex items-center w-full justify-between uppercase">
            <div>{type}</div>
            <NumberFlow
                value={count}
                transformTiming={{
                    duration: 500,
                    easing: "ease-out",
                }}
            />
        </div>
    );
}
