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
import { ReactNode, useMemo, useState } from 'react'
import { DataTable } from '../data-table'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { ArrowRightFromLineIcon } from 'lucide-react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { getLikesByUniqueId } from '@/components/selector/logs'
import { RootState } from '@/store'

type OutputType = { count: number; time: string }

export default function ShowListLike({
  username = '',
  dialogOpenState = false,
  setDialogOpenState,
  TriggerElement,
}: {
  username: string
  dialogOpenState?: boolean
  setDialogOpenState?: (arg0: boolean) => void
  TriggerElement?: ReactNode
}) {
  const [dialogOpen, setDialogOpen] = useState(dialogOpenState)
  const columnVisibility = {
    count: true,
    time: true,
  }
  const likes = useSelector((state: RootState) =>
    getLikesByUniqueId(state, username),
  )
  const columns: ColumnDef<OutputType>[] = useMemo(
    () => [
      {
        accessorKey: 'count',
        header: () => <div className='text-left'>Like</div>,
        cell: ({ getValue, row }: CellContext<OutputType, unknown>) => {
          const val = getValue() as number
          return <div className='flex items-center'>{val.toString()}</div>
        },
      },
      {
        accessorKey: 'time',
        header: () => <div className='text-left'>Time</div>,
        cell: ({ getValue }: CellContext<OutputType, unknown>) => {
          const val = getValue() as string
          return moment(moment.unix(Math.round(parseInt(val) / 1000))).format(
            'hh:mm:ss',
          )
        },
      },
    ],
    [likes],
  )

  const table = useReactTable({
    data: likes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
  })
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={e => {
        if (setDialogOpenState) {
          setDialogOpenState(e)
        } else {
          setDialogOpen(e)
        }
      }}
    >
      {!setDialogOpenState && (
        <DialogTrigger asChild>
          {TriggerElement ? (
            TriggerElement
          ) : (
            <Button size={'icon'} variant={'outline'}>
              <ArrowRightFromLineIcon />
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className='sm:max-w-[625px] min-h-[500px] flex flex-col gap-3'>
        <DialogHeader>
          <DialogTitle>List Like</DialogTitle>
          <DialogDescription>Showing from @{username}</DialogDescription>
        </DialogHeader>

        <DataTable table={table} />
      </DialogContent>
    </Dialog>
  )
}
