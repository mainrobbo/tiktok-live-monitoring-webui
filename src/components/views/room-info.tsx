"use client"
import { Suspense, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import VideoPlayer from "./media-player";
import { AppContext } from "../app-context";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "../ui/badge";
import { Gamepad2 } from "lucide-react";
import GameTagRoomInfo from "./room-info/game-tag";
import { Button } from "../ui/button";

export default function RoomInfoComponent() {
    const { liveInfo } = useContext(AppContext)
    if (!liveInfo?.hashtag?.title) return <></>
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Live {liveInfo.hashtag?.title && <Button
                        variant={"outline"}
                        onClick={() => window.open(`https://tiktok.com/live/${liveInfo.hashtag?.title?.toLowerCase()}`, '_blank')}
                        className="opacity-60 tracking-wide font-semibold uppercase">#{liveInfo.hashtag?.title?.toLowerCase()}</Button>}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {liveInfo?.stream_url?.flv_pull_url && (
                    <div className="lg:w-[500px]">  <Suspense fallback={<div>Loading...</div>}> <VideoPlayer src={liveInfo.stream_url.hls_pull_url} />  </Suspense></div>
                )}
                <Separator />
                {liveInfo?.game_tag && <div className="flex items-start">
                    <GameTagRoomInfo tags={liveInfo?.game_tag} hashtag={liveInfo?.hashtag?.title?.toLowerCase()} />
                </div>}

            </CardContent>
        </Card>
    )
}