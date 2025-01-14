import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"

export type GameTag = {
    bundle_id: string,
    full_name: string
    game_category: any[]
    hashtag_id: number[]
    hashtag_list: any[]
    id: number
    is_new_game: boolean
    landscape: number
    package_name: string
    short_name: string
    show_name: string

}
export default function GameTagRoomInfo({ tags, hashtag }: { tags: GameTag[], hashtag?: string }) {
    if (!tags || tags.length == 0) return <></>
    return <div className="flex flex-col">
        <div className="grid grid-cols-auto">
            <div className="font-semibold w-fit">Game Tag</div>
            {tags.map((tag, i: number) => (
                <Button
                    key={i}
                    disabled={hashtag == "undefined"}
                    onClick={() => window.open(`https://tiktok.com/live/${hashtag}/${tag.show_name.replaceAll(' ', '_')}`, '_blank')}
                    className="opacity-60 tracking-wide font-semibold uppercase w-fit"><Gamepad2 className="mr-2" size={16} />{tag.show_name}</Button>
            ))}</div>
    </div>
}