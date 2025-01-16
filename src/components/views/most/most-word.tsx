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
import ShowListChat from './show-list-chat'

type OutputType = { word: string; users: string[]; times: string }

export default function MostWord({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { comments: data }: { comments: LogsData[] } = useContext(AppContext)
  const getMostWords = useCallback(() => {
    const countOccurrences = data.reduce(
      (acc, user) => {
        const { comment, userId } = user.data
        comment.split(' ').forEach((word: string) => {
          const lowerCaseWord = word.toLowerCase()
          if (acc[lowerCaseWord]) {
            acc[lowerCaseWord].times += 1
            if (!acc[lowerCaseWord].users.includes(userId))
              acc[lowerCaseWord].users.push(userId)
          } else {
            acc[lowerCaseWord] = {
              word: lowerCaseWord,
              times: 1,
              users: [userId],
            }
          }
        })
        return acc
      },
      {} as { [key: string]: { word: string; users: string[]; times: number } },
    )
    return Object.values(countOccurrences)
      .map(({ word, times, users }) => ({
        word,
        users,
        times: times.toString(),
      }))
      .sort((a, b) => parseInt(b.times) - parseInt(a.times))
      .filter((_, i) => i < 10)
  }, [data])
  const columns: ColumnDef<OutputType>[] = useMemo(
    () => [
      {
        accessorKey: 'word',
        header: () => <div className='text-left'>Word</div>,
        cell: ({ getValue }: CellContext<OutputType, unknown>) => {
          const val = getValue() as string
          return val
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
        accessorKey: 'users',
        header: () => <div className='text-left'>Total User</div>,
        cell: ({ getValue }: CellContext<OutputType, unknown>) => {
          const val = getValue() as string[]
          return val.length
        },
      },
      {
        accessorKey: 'view',
        header: () => <div className='text-left'>View Detail</div>,
        cell: ({ row }: CellContext<OutputType, unknown>) => {
          return <ShowListChat word={row.original.word} />
        },
      },
    ],
    [],
  )
  const mostWordsArray = useMemo(() => getMostWords(), [data])
  const table = useReactTable({
    data: mostWordsArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Most Word</DialogTitle>
          <DialogDescription>
            Showing top 10 most word from chat.
          </DialogDescription>
        </DialogHeader>
        <DataTable table={table} />
      </DialogContent>
    </Dialog>
  )
}
