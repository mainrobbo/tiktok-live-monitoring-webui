'use query'
import { AppContext } from '@/components/app-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LogsData } from '@/lib/types/common'
import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { DataTable } from '../data-table'
import Link from 'next/link'
import ShowListChat from './show-list-chat'

type UserData = {
  uniqueId: string
  id: string
  nickname: string
  profilePictureUrl: string
}
type OutputType = { user: UserData; times: string }
export default function MostChat({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { comments: data }: { comments: LogsData[] } = useContext(AppContext)
  const getMostLikes = useCallback(() => {
    const countOccurrences = data.reduce(
      (acc, user) => {
        const { uniqueId } = user.data
        if (!acc[uniqueId]) {
          acc[uniqueId] = { user: user.data, times: 0 }
        }
        acc[uniqueId].times++
        return acc
      },
      {} as { [key: string]: { user: UserData; times: number } },
    )
    return Object.values(countOccurrences)
      .map(({ user, times }) => ({
        user,
        times: times.toString(),
      }))
      .sort((a, b) => parseInt(b.times) - parseInt(a.times))
      .filter((_, i) => i < 10)
  }, [data])
  const columns: ColumnDef<OutputType>[] = useMemo(
    () => [
      {
        accessorKey: 'user',
        header: () => <div className='text-left'>Name</div>,
        cell: ({ getValue }: CellContext<OutputType, unknown>) => {
          const val = getValue() as UserData
          return (
            <Link
              href={`https://tiktok.com/@${val.uniqueId}`}
              className='underline hover:opacity-80'
              title={`@${val.uniqueId}`}
              target='_blank'
            >
              {val.nickname}
            </Link>
          )
        },
      },
      {
        accessorKey: 'times',
        header: () => <div className='text-left'>Count</div>,
        cell: ({ getValue }: CellContext<OutputType, unknown>) => {
          const val = getValue() as string
          return val
        },
      },
      {
        accessorKey: 'chat-detail',
        header: () => <div className='text-left'>View Detail</div>,
        cell: ({ row }: CellContext<OutputType, unknown>) => {
          return <ShowListChat username={row.original.user.uniqueId} />
        },
      },
    ],
    [],
  )
  const mostLikeArray = useMemo(() => getMostLikes(), [getMostLikes])

  const table = useReactTable({
    data: mostLikeArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Most Chat</DialogTitle>
          <DialogDescription>
            Showing top 10 most users actively on chat.
          </DialogDescription>
        </DialogHeader>
        <DataTable table={table} />
      </DialogContent>
    </Dialog>
  )
}
