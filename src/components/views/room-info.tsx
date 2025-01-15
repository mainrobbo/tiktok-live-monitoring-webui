"use client"
import { memo, Suspense, useContext, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import VideoPlayer from "./media-player";
import { AppContext } from "../app-context";
import GameTagRoomInfo from "./room-info/game-tag";
import { Button } from "../ui/button";
const RoomInfoComponent = memo(() => {
    const { liveInfo } = useContext(AppContext)
    if (!liveInfo?.hashtag?.title) return <></>
    console.log(liveInfo)
    return (
        <div className="flex items-start w-full lg:col-span-3 gap-2">
            <Card className="w-fit">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {liveInfo.hashtag?.title && <Button
                            variant={"outline"}
                            onClick={() => window.open(`https://tiktok.com/live/${liveInfo.hashtag?.title?.toLowerCase()}`, '_blank')}
                            className="opacity-60 tracking-wide font-semibold uppercase">#{liveInfo.hashtag?.title?.toLowerCase()}</Button>}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {liveInfo?.stream_url?.flv_pull_url && (
                        <div className="flex w-full justify-center">
                            <div className="lg:w-[240px]">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <VideoPlayer src={liveInfo.stream_url.hls_pull_url} />
                                </Suspense>
                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <span className="font-medium tracking-wide text-muted-foreground">Title:</span> {liveInfo?.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {liveInfo?.game_tag && <div className="flex items-start">
                        <GameTagRoomInfo tags={liveInfo?.game_tag} hashtag={liveInfo?.hashtag?.title?.toLowerCase()} />
                    </div>}
                </CardContent>
            </Card>
        </div>
    )
})
export default RoomInfoComponent;
