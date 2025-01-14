"use client"
import { DotIcon, SignalIcon, WifiHighIcon, WifiIcon } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "./app-context";

export default function AppNavbar() {
    const { isConnectedToServer, isLive } = useContext(AppContext)
    return (<div className="sticky top-0 bg-background border-b p-2 z-50">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={isLive ? `animate-pulse` : ''}>{isLive ? '🔴' : '⚫'}</div> <div className="">{isLive ? 'LIVE' : ''}</div>
            </div>
            <div className="flex items-center" title="Not connected to server">
                <WifiIcon className={isConnectedToServer ? `text-emerald-500` : `text-red-500`} />
            </div>
        </div>
    </div>)
}