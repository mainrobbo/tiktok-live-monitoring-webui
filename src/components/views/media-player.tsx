"use client"
import Hls from "hls.js";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    MediaController,
    MediaControlBar,
    MediaTimeRange,
    MediaTimeDisplay,
    MediaLoadingIndicator,
    MediaVolumeRange,
    MediaPlaybackRateButton,
    MediaPlayButton,
    MediaSeekBackwardButton,
    MediaSeekForwardButton,
    MediaMuteButton,
    MediaCaptionsButton,
    MediaAirplayButton,
    MediaPipButton,
    MediaFullscreenButton,
    MediaPosterImage
} from "media-chrome/dist/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { AppContext } from "../app-context";
import { InfoIcon } from "lucide-react";

function reverse(str: string) {
    return str.split("").reverse().join("").split(" ").reverse().join(" ")
};
export default function VideoPlayer({ src }: { src: string }) {
    const { username } = useContext(AppContext)
    const [proxyStreamUrl, setProxyStreamUrl] = useState("-1")
    const computedSrc = useMemo(() => {
        if (proxyStreamUrl !== "-1") {
            return proxyStreamUrl + reverse(Buffer.from(src).toString('base64')) + "/";
        }
        return src;
    }, [proxyStreamUrl, src]);
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.controls = true;
        const defaultOptions = {};
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = computedSrc;
        } else if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(computedSrc);
            hls.attachMedia(video);
        } else {
            console.error(
                "This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"
            );
        }
    }, [computedSrc, videoRef]);
    const primaryColor = "white";
    const chromeStyles = {
        "--media-icon-color": primaryColor,
        "--media-range-thumb-background": primaryColor,
        "--media-range-bar-color": primaryColor,
        color: primaryColor
    };
    return (
        <>
            <MediaController
                style={chromeStyles}
                defaultSubtitles
            >
                <video slot="media" ref={videoRef} controls={false} preload="auto"
                    autoPlay
                    muted
                    crossOrigin="" />
                <MediaLoadingIndicator
                    noautohide
                    slot="centered-chrome"
                // style={{ "--media-loading-indicator-icon-height": "200px" }}
                ></MediaLoadingIndicator>
                <div
                    ref={(el) => { el?.toggleAttribute("noautohide", true) }}
                    slot="centered-chrome"
                    className="flex flex-col select-none opacity-30"
                >
                    <div className="text-4xl font-extrabold">@{username}</div>
                    <div className="text-2xl font-extrabold">tiktok.zeranel.dev</div>
                </div>
                {/* <MediaControlBar>
                <MediaPlayButton></MediaPlayButton>
                <MediaSeekBackwardButton seekOffset={10}></MediaSeekBackwardButton>
                <MediaSeekForwardButton seekOffset={10}></MediaSeekForwardButton>
                <MediaTimeRange></MediaTimeRange>
                <MediaTimeDisplay showDuration></MediaTimeDisplay>
                <MediaMuteButton></MediaMuteButton>
                <MediaVolumeRange></MediaVolumeRange>
                <MediaPlaybackRateButton></MediaPlaybackRateButton>
                <MediaPipButton></MediaPipButton>
                <MediaFullscreenButton></MediaFullscreenButton>
            </MediaControlBar> */}
            </MediaController>
            <div className="flex items-center gap-2">
                <Select value={proxyStreamUrl} onValueChange={setProxyStreamUrl}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Media Server Proxy" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="-1">-- No proxy --</SelectItem>
                        <SelectItem value="https://server-tt.zeranel.dev/proxy-stream/">Server 1</SelectItem>
                    </SelectContent>
                </Select>
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <InfoIcon className="opacity-50" size={18} />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                            Use or change proxy if the media streaming not working!
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>
        </>
    );
}
