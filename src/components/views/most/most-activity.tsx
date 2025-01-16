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
import { ArrowRightSquare } from 'lucide-react'
import ShowListLike from './show-list-like'
import { useSelector } from 'react-redux'
import {
  get10MostActivity,
  Most10ActivityOutputType,
} from '@/components/selector/logs'

type UserData = {
  uniqueId: string
  id: string
  nickname: string
  profilePictureUrl: string
}
export default function MostActivity({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const mostActivity = useSelector(get10MostActivity)

  const columns: ColumnDef<Most10ActivityOutputType>[] = useMemo(
    () => [
      {
        accessorKey: 'user',
        header: () => <div className='text-left'>Name</div>,
        cell: ({
          getValue,
        }: CellContext<Most10ActivityOutputType, unknown>) => {
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
        accessorKey: 'like',
        header: () => <div className='text-left'>Like</div>,
        cell: ({
          getValue,
          row,
        }: CellContext<Most10ActivityOutputType, unknown>) => {
          const val = getValue() as string
          return (
            <div className='flex items-center text-xs gap-1'>
              <span>{val}</span>
              <ShowListLike
                TriggerElement={
                  <ArrowRightSquare
                    size={14}
                    className='hover:cursor-pointer text-muted-foreground hover:ml-0.5 transition-all'
                  />
                }
                username={row.original.user.uniqueId}
              />
            </div>
          )
        },
      },
      {
        accessorKey: 'comment',
        header: () => <div className='text-left'>Comment</div>,
        cell: ({
          getValue,
          row,
        }: CellContext<Most10ActivityOutputType, unknown>) => {
          const val = getValue() as string
          return (
            <div className='flex items-center text-xs gap-1'>
              <span>{val}</span>
              <ShowListChat
                TriggerElement={
                  <ArrowRightSquare
                    size={14}
                    className='hover:cursor-pointer text-muted-foreground hover:ml-0.5 transition-all'
                  />
                }
                username={row.original.user.uniqueId}
              />
            </div>
          )
        },
      },
      {
        accessorKey: 'gift',
        header: () => <div className='text-left'>Gift</div>,
        cell: ({
          getValue,
        }: CellContext<Most10ActivityOutputType, unknown>) => {
          const val = getValue() as string
          return val
        },
      },
      {
        accessorKey: 'share',
        header: () => <div className='text-left'>Share</div>,
        cell: ({
          getValue,
        }: CellContext<Most10ActivityOutputType, unknown>) => {
          const val = getValue() as string
          return val
        },
      },
      {
        accessorKey: 'total',
        header: () => <div className='text-left'>Total</div>,
        cell: ({
          getValue,
        }: CellContext<Most10ActivityOutputType, unknown>) => {
          const val = getValue() as string
          return val
        },
      },
    ],
    [],
  )
  const table = useReactTable({
    data: mostActivity,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[625px]'>
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
