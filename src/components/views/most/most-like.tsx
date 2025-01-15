"use query"
import { AppContext } from "@/components/app-context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { LogsData } from "@/lib/types/common"
import { CellContext, ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react"
import { DataTable } from "../data-table"
import Link from "next/link"
import ShowListLike from "./show-list-like"
import { ArrowRightCircle } from "lucide-react"

type MostLikeUserData = {
    uniqueId: string
    id: string
    nickname: string
    profilePictureUrl: string
}
type MostLike = { user: MostLikeUserData, total: string, times: string }
export default function MostLike({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const { likes: data }: { likes: LogsData[] } = useContext(AppContext)
    const getMostLikes = useCallback(() => {
        const countOccurrences = data.reduce((acc, user) => {
            const { uniqueId, likeCount } = user.data
            if (!acc[uniqueId]) {
                acc[uniqueId] = { user: user.data, times: 0, total: 0 }
            }
            acc[uniqueId].times++
            acc[uniqueId].total += likeCount
            return acc
        }, {} as { [key: string]: { user: MostLikeUserData, times: number, total: number } })
        return Object.values(countOccurrences).map(({ user, times, total }) => ({
            user,
            times: times.toString(),
            total: total.toString()
        })).sort((a, b) => parseInt(b.total) - parseInt(a.total)).filter((_, i) => i < 10)

    }, [data]);
    const columns: ColumnDef<MostLike>[] = useMemo(() => [
        {
            accessorKey: "user",
            header: () => <div className="text-left">Nickname</div>,
            cell: ({ getValue }: CellContext<MostLike, unknown>) => {
                const val = getValue() as MostLikeUserData
                return (
                    <Link href={`https://tiktok.com/@${val.uniqueId}`} className="underline hover:opacity-80" title={`@${val.uniqueId}`} target="_blank">{val.nickname}</Link>
                )
            },
        },
        {
            accessorKey: "times",
            header: () => <div className="text-left">Count</div>,
            cell: ({ getValue }: CellContext<MostLike, unknown>) => {
                const val = getValue() as MostLikeUserData
                return val
            },
        },
        {
            accessorKey: "total",
            header: () => <div className="text-left">Total</div>,
            cell: ({ getValue }: CellContext<MostLike, unknown>) => {
                const val = getValue() as MostLikeUserData
                return val
            },
        },
        {
            accessorKey: "action",
            header: () => <div className="text-left">Action</div>,
            cell: ({ row }: CellContext<MostLike, unknown>) => {
                return (
                    <ShowListLike
                        TriggerElement={<Button size={"icon"} variant={"outline"}><ArrowRightCircle className="text-muted-foreground" size={16} /></Button>}
                        username={row.original.user.uniqueId} />
                )
            },
        }
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
                    <DialogTitle>Top & Most Likes</DialogTitle>
                    <DialogDescription>
                        Showing top 10 most users with total giving like and frequent.
                    </DialogDescription>
                </DialogHeader>
                <DataTable table={table} />
            </DialogContent>
        </Dialog>
    )
}
