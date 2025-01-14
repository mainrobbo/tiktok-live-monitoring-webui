"use query"
import { AppContext } from "@/components/app-context"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogsData } from "@/lib/types/common"
import { CellContext, ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react"
import { DataTable } from "../data-table"

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
        })).sort((a, b) => parseInt(b.total) - parseInt(a.total)).filter((_, i) => i <= 10)

    }, [data]);
    const columns: ColumnDef<MostLike>[] = useMemo(() => [
        {
            accessorKey: "user",
            header: () => <div className="text-left">Nickname</div>,
            cell: ({ getValue }: CellContext<MostLike, unknown>) => {
                const val = getValue() as MostLikeUserData
                return val.nickname
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
                    <DialogTitle>Most Likes</DialogTitle>
                    <DialogDescription>

                        <Button onClick={getMostLikes}>Test</Button>
                    </DialogDescription>
                </DialogHeader>
                <DataTable table={table} />
            </DialogContent>
        </Dialog>
    )
}
