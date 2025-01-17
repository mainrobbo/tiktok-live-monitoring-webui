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
import { get10MostGift, Most10GiftType } from '@/components/selector/logs'
import ShowListGift from './show-list-gift'

export default function MostGift({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const mostActivity = useSelector(get10MostGift)

  const columns: ColumnDef<Most10GiftType>[] = useMemo(
    () => [
      {
        accessorKey: 'giftName',
        header: () => <div className='text-left'>Gift Name</div>,
        cell: ({ getValue, row }: CellContext<Most10GiftType, unknown>) => {
          const val = getValue() as string
          return (
            <div className='flex items-center gap-2'>
              <div
                className='w-4 h-4 bg-cover bg-center'
                style={{
                  backgroundImage: `url("${row.original.giftPictureUrl}")`,
                }}
              ></div>
              {val}
            </div>
          )
        },
      },
      {
        accessorKey: 'users',
        header: () => <div className='text-left'>User</div>,
        cell: ({ getValue }: CellContext<Most10GiftType, unknown>) => {
          const val = getValue() as string[]
          return val.length
        },
      },
      {
        accessorKey: 'repeatTotal',
        header: () => <div className='text-left'>Gift</div>,
        cell: ({ getValue }: CellContext<Most10GiftType, unknown>) => {
          const val = getValue() as string
          return val
        },
      },
      {
        accessorKey: 'diamondTotal',
        header: () => <div className='text-left'>Coin</div>,
        cell: ({ getValue }: CellContext<Most10GiftType, unknown>) => {
          const val = getValue() as string
          return <div className='flex items-center gap-1'>🪙 {val}</div>
        },
      },
      {
        accessorKey: 'action',
        header: () => <div className='text-left'>Detail</div>,
        cell: ({ row }: CellContext<Most10GiftType, unknown>) => {
          return (
            <ShowListGift
              giftPictureUrl={row.original.giftPictureUrl}
              giftName={row.original.giftName}
              TriggerElement={
                <div className='underline text-xs cursor-pointer'>
                  View detail
                </div>
              }
            />
          )
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
