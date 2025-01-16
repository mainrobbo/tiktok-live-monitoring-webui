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
import ShowListChat from './show-list-chat'
import { useSelector } from 'react-redux'
import { get10MostWords } from '@/components/selector/logs'

type OutputType = { word: string; users: string[]; times: string }

export default function MostWord({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const mostWords = useSelector(get10MostWords)

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
  const table = useReactTable({
    data: mostWords,
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
