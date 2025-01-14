"use client"
import Hls from "hls.js";
import { useContext, useEffect, useRef } from "react";
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

import { AppContext } from "../app-context";
export default function VideoPlayer({ src }: { src: string }) {
    const { username } = useContext(AppContext)
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.controls = true;
        const defaultOptions = {};
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
        } else {
            console.error(
                "This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API"
            );
        }
    }, [src, videoRef]);
    const primaryColor = "white";
    const chromeStyles = {
        "--media-icon-color": primaryColor,
        "--media-range-thumb-background": primaryColor,
        "--media-range-bar-color": primaryColor,
        color: primaryColor
    };
    return (
        <MediaController
            style={chromeStyles}
            defaultSubtitles
        >
            <video slot="media" ref={videoRef} controls={false} preload="auto"
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
    );
}
