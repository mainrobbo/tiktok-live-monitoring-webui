'use query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { DataTable } from '../data-table'
import Link from 'next/link'
import ShowListChat from './show-list-chat'
import { useSelector } from 'react-redux'
import {
  get10MostComment,
  Most10CommentsOutputType,
} from '@/components/selector/logs'

type UserData = {
  uniqueId: string
  id: string
  nickname: string
  profilePictureUrl: string
}
export default function MostChat({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const data = useSelector(get10MostComment)
  const columns: ColumnDef<Most10CommentsOutputType>[] = useMemo(
    () => [
      {
        accessorKey: 'user',
        header: () => <div className='text-left'>Name</div>,
        cell: ({
          getValue,
        }: CellContext<Most10CommentsOutputType, unknown>) => {
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
        cell: ({
          getValue,
        }: CellContext<Most10CommentsOutputType, unknown>) => {
          const val = getValue() as string
          return val
        },
      },
      {
        accessorKey: 'chat-detail',
        header: () => <div className='text-left'>View Detail</div>,
        cell: ({ row }: CellContext<Most10CommentsOutputType, unknown>) => {
          return <ShowListChat username={row.original.user.uniqueId} />
        },
      },
    ],
    [],
  )
  const table = useReactTable({
    data: data,
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
