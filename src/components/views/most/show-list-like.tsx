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
import { ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { DataTable } from '../data-table'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@radix-ui/react-dialog'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ArrowRightFromLineIcon, Check, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import moment from 'moment'
type UserData = {
  uniqueId: string
  id: string
  nickname: string
  profilePictureUrl: string
}

type OutputType = { count: string; time: string; isStreak: boolean }

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
    isStreak: true,
  }
  const { likes: data }: { likes: LogsData[] } = useContext(AppContext)
  const getMostLikes = useMemo(() => {
    return data
      .filter(d => d.data.uniqueId == username)
      .map(({ data }) => ({
        count: data.likeCount,
        time: data.createTime,
        isStreak: data.isStreak,
      }))
      .sort((a, b) => b.count - a.count)
  }, [data, username])

  const columns: ColumnDef<OutputType>[] = useMemo(
    () => [
      {
        accessorKey: 'count',
        header: () => <div className='text-left'>Like</div>,
        cell: ({ getValue, row }: CellContext<OutputType, unknown>) => {
          const val = getValue() as string
          return (
            <div className='flex items-center'>
              {row.original.isStreak && '🔥'} {val}
            </div>
          )
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
    [data],
  )

  const table = useReactTable({
    data: getMostLikes,
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
