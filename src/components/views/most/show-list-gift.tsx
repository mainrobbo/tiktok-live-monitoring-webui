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
import { useSelector } from 'react-redux'
import { getGiftByGiftName } from '@/components/selector/logs'
import { RootState } from '@/store'
import { removeDuplicates } from '@/lib/helper/transform'
type UserData = {
  uniqueId: string
  userId: string
  nickname: string
  profilePictureUrl: string
}

type OutputType = { user: UserData; repeatCount: number; diamondCount: number }

export default function ShowListGift({
  giftName = '',
  giftPictureUrl,
  username = '',
  dialogOpenState = false,
  setDialogOpenState,
  TriggerElement,
}: {
  giftName?: string
  giftPictureUrl: string
  username?: string
  dialogOpenState?: boolean
  setDialogOpenState?: (arg0: boolean) => void
  TriggerElement?: ReactNode
}) {
  const [dialogOpen, setDialogOpen] = useState(dialogOpenState)
  const [showUsername, setShowUsername] = useState(false)

  const columnVisibility = {
    user: username == '',
  }

  const mostWords = useSelector((state: RootState) =>
    getGiftByGiftName(state, giftName),
  )
  // const filteredData = useMemo(() => {
  //   return mostWords.filter(d => d.user.uniqueId.includes(selectedUsername))
  // }, [selectedUsername])

  const columns: ColumnDef<OutputType>[] = useMemo(
    () => [
      {
        accessorKey: 'user',
        header: () => <div className='text-left'>User</div>,
        cell: ({ getValue }: CellContext<OutputType, unknown>) => {
          const val = getValue() as UserData
          return (
            <Link
              href={`https://tiktok.com/@${val.uniqueId}`}
              target='_blank'
              className='underline'
            >
              {showUsername ? `@${val.uniqueId}` : val.nickname}
            </Link>
          )
        },
      },
      {
        accessorKey: 'repeatCount',
        header: () => <div className='text-left'>Total Gift</div>,
        cell: ({ getValue }: CellContext<OutputType, unknown>) => {
          const val = getValue() as number
          return val
        },
      },
      {
        accessorKey: 'diamondCount',
        header: () => <div className='text-left'>Total Coin</div>,
        cell: ({ getValue, row }: CellContext<OutputType, unknown>) => {
          const val = getValue() as number
          return val * row.original.repeatCount
        },
      },
    ],
    [showUsername, mostWords],
  )

  const listUserArray = useMemo(
    () =>
      removeDuplicates(
        mostWords.map(u => u.user),
        'userId',
      ),
    [mostWords],
  )
  const table = useReactTable({
    data: mostWords,
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
          <DialogTitle>List Gift</DialogTitle>
          <DialogDescription>
            Showing gift{' '}
            {giftName && (
              <>
                <span className='font-bold'>{giftName}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        {username == '' && (
          <div className='flex items-center gap-2'>
            <Switch
              checked={showUsername}
              onCheckedChange={e => {
                setShowUsername(e)
              }}
            />
            <Label>Show username</Label>
          </div>
        )}
        <DataTable table={table} />
      </DialogContent>
    </Dialog>
  )
}
