import { ActivityType, LogsData } from "@/lib/types/common";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useContext } from "react";
import { AppContext } from "../app-context";
const gifterLevelColors = (level: number) => {
    if (level == 0) {
        return "bg-amber-500 bg-opacity-20";
    } else if (level <= 5) {
        return "bg-sky-300";
    } else if (level <= 10) {
        return "bg-red-300";
    } else if (level <= 20) {
        return "bg-purple-500 bg-opacity-30";
    } else {
        return "bg-yellow-300";
    }
};
export default function BubblePerson({ logsData, icon = false }: { logsData: LogsData, icon?: boolean }) {
    const { type, data } = logsData
    const icons = {
        [ActivityType.COMMENT]: "💬",
        [ActivityType.GIFT]: "🎁",
        [ActivityType.LIKE]: "💗",
        [ActivityType.VIEW]: "➡️",
    };
    const { userDetails, followInfo } = data
    const { preferences } = useContext(AppContext)
    return (

        <div className="flex items-center gap-2 ">
            {icon && <span>{icons[type]} </span>}
            <Popover>
                <PopoverTrigger asChild>
                    <div className="hover:underline hover:cursor-pointer">
                        <span className="font-semibold">{data.nickname ?? data.uniqueId}</span>
                        {(data.isModerator && preferences.show_mod_badge) && <span>🛠️</span>}
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="flex gap-5 items-center">
                        <Avatar>
                            <AvatarImage src={data.profilePictureUrl} />
                            <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="">
                            <h4 className="text-base font-semibold">{data.nickname}</h4>
                            <h4 className="text-sm">@{data.uniqueId}</h4>
                            <p className="text-sm">
                                {userDetails?.bioDescription ?? ""}
                            </p>
                            <div className="flex items-center pt-2 justify-between gap-2">
                                <span className="text-xs text-muted-foreground">
                                    <b>{followInfo.followingCount ?? "0"}</b> Following
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    <b>{followInfo.followerCount ?? "0"}</b> Followers
                                </span>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            {preferences.show_gift_level_badge && <span
                className={`${gifterLevelColors(
                    data.gifterLevel ?? 0
                )} flex gap-2 items-center px-1.5 rounded-md text-xs`}
            >
                💎{data.gifterLevel ?? 0}
            </span>}

            {type == ActivityType.VIEW && (data.isRejoin ? <span>Rejoined the stream.</span> : <span>Joined the stream.</span>)}
        </div>



    );
}