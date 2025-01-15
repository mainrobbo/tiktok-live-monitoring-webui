"use query"
import { AppContext } from "@/components/app-context"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ActivityType, LogsData } from "@/lib/types/common"
import { CellContext, ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react"
import { DataTable } from "../data-table"
import Link from "next/link"
import ShowListChat from "./show-list-chat"
import { ArrowRightSquare, EyeIcon } from "lucide-react"
import ShowListLike from "./show-list-like"

type UserData = {
    uniqueId: string
    id: string
    nickname: string
    profilePictureUrl: string
}
type OutputType = { user: UserData, total: string, like: string, comment: string, share: string, gift: string }
export default function MostActivity({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const { comments: data }: { comments: LogsData[] } = useContext(AppContext)
    const getMostLikes = useCallback(() => {
        const countOccurrences = data.reduce((acc, user) => {
            const { data, type } = user
            const { uniqueId } = data
            if (!acc[uniqueId]) {
                acc[uniqueId] = { user: user.data, total: 0, like: 0, comment: 0, share: 0, gift: 0 }
            }
            if (type == ActivityType.LIKE) acc[uniqueId].like++
            if (type == ActivityType.COMMENT) acc[uniqueId].comment++
            if (type == ActivityType.SHARE) acc[uniqueId].share++
            if (type == ActivityType.GIFT) acc[uniqueId].gift++
            acc[uniqueId].total++
            return acc
        }, {} as { [key: string]: { user: UserData, total: number, like: number, comment: number, share: number, gift: number } })
        return Object.values(countOccurrences).map(({ user, total, like, comment, share, gift }) => ({
            user,
            total: total.toString(),
            like: like.toString(),
            comment: comment.toString(),
            share: share.toString(),
            gift: gift.toString(),
        })).sort((a, b) => parseInt(b.total) - parseInt(a.total)).filter((_, i) => i < 10)

    }, [data]);
    const columns: ColumnDef<OutputType>[] = useMemo(() => [
        {
            accessorKey: "user",
            header: () => <div className="text-left">Name</div>,
            cell: ({ getValue }: CellContext<OutputType, unknown>) => {
                const val = getValue() as UserData
                return (
                    <Link href={`https://tiktok.com/@${val.uniqueId}`} className="underline hover:opacity-80" title={`@${val.uniqueId}`} target="_blank">{val.nickname}</Link>
                )
            },
        },
        {
            accessorKey: "like",
            header: () => <div className="text-left">Like</div>,
            cell: ({ getValue, row }: CellContext<OutputType, unknown>) => {
                const val = getValue() as string
                return (
                    <div className="flex items-center text-xs gap-1">
                        <span>{val}</span>
                        <ShowListLike TriggerElement={<ArrowRightSquare size={14} className="hover:cursor-pointer text-muted-foreground hover:ml-0.5 transition-all" />} username={row.original.user.uniqueId} />
                    </div>
                )
            },
        },
        {
            accessorKey: "comment",
            header: () => <div className="text-left">Comment</div>,
            cell: ({ getValue, row }: CellContext<OutputType, unknown>) => {
                const val = getValue() as string
                return (
                    <div className="flex items-center text-xs gap-1">
                        <span>{val}</span>
                        <ShowListChat TriggerElement={<ArrowRightSquare size={14} className="hover:cursor-pointer text-muted-foreground hover:ml-0.5 transition-all" />} username={row.original.user.uniqueId} />
                    </div>
                )
            },
        },
        {
            accessorKey: "gift",
            header: () => <div className="text-left">Gift</div>,
            cell: ({ getValue }: CellContext<OutputType, unknown>) => {
                const val = getValue() as string
                return val
            },
        },
        {
            accessorKey: "share",
            header: () => <div className="text-left">Share</div>,
            cell: ({ getValue }: CellContext<OutputType, unknown>) => {
                const val = getValue() as string
                return val
            },
        },
        {
            accessorKey: "total",
            header: () => <div className="text-left">Total</div>,
            cell: ({ getValue }: CellContext<OutputType, unknown>) => {
                const val = getValue() as string
                return val
            },
        },

    ], []);
    const mostLikeArray = useMemo(() => getMostLikes(), [getMostLikes]);
    const table = useReactTable({
        data: mostLikeArray,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Most Activity</DialogTitle>
                    <DialogDescription>
                        Showing top 10 most users actively on stream.
                    </DialogDescription>
                </DialogHeader>
                <DataTable table={table} />
            </DialogContent>
        </Dialog>
    )
}
