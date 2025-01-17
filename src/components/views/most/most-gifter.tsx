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
import { useSelector } from 'react-redux'
import { get10MostGifter, Most10GifterType } from '@/components/selector/logs'

export default function MostGifter({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const mostActivity = useSelector(get10MostGifter)
  console.log({ mostActivity })
  const columns: ColumnDef<Most10GifterType>[] = useMemo(
    () => [
      {
        accessorKey: 'user',
        header: () => <div className='text-left'>User</div>,
        cell: ({ getValue }: CellContext<Most10GifterType, unknown>) => {
          const val = getValue() as { uniqueId: string }
          return val.uniqueId
        },
      },
      {
        accessorKey: 'totalGift',
        header: () => <div className='text-left'>Total Gift</div>,
        cell: ({ getValue, row }: CellContext<Most10GifterType, unknown>) => {
          const val = getValue() as number
          return (
            <div className='flex items-center gap-2'>
              <div>
                {val}
                {row.original?.totalStreak > 0 && (
                  <div className='text-muted-foreground'>
                    (🔥 {row.original.totalStreak})
                  </div>
                )}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'totalDiamond',
        header: () => <div className='text-left'>Coin</div>,
        cell: ({ getValue }: CellContext<Most10GifterType, unknown>) => {
          const val = getValue() as number
          return <div className='flex items-center gap-1'>🪙 {val}</div>
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
          <DialogTitle>Most Gift</DialogTitle>
          <DialogDescription>
            Showing top 10 most gift on stream.
          </DialogDescription>
        </DialogHeader>
        <DataTable table={table} />
      </DialogContent>
    </Dialog>
  )
}
