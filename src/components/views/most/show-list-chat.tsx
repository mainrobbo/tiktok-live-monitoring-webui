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
import { ReactNode, useCallback, useMemo, useState } from 'react'
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
import { LogData } from '@/lib/types/log'
import { useSelector } from 'react-redux'
import { get10MostWords, getMostWordByFilter } from '@/components/selector/logs'
import { RootState } from '@/store'
type UserData = {
  uniqueId: string
  id: string
  nickname: string
  profilePictureUrl: string
}

type OutputType = { comment: string; user: UserData; time: string }

export default function ShowListChat({
  word = '',
  username = '',
  dialogOpenState = false,
  setDialogOpenState,
  TriggerElement,
}: {
  word?: string
  username?: string
  dialogOpenState?: boolean
  setDialogOpenState?: (arg0: boolean) => void
  TriggerElement?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(dialogOpenState)
  const [showUsername, setShowUsername] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState(username)
  const columnVisibility = {
    comment: true,
    user: username == '',
    time: true,
  }
  const mostWords = useSelector((state: RootState) =>
    getMostWordByFilter(state, username, word),
  )

  const columns: ColumnDef<OutputType>[] = useMemo(
    () => [
      {
        accessorKey: 'comment',
        header: () => <div className='text-left'>Comment</div>,
        cell: ({ getValue }: CellContext<OutputType, unknown>) => {
          const val = getValue() as string
          return val
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
    ],
    [showUsername, mostWords],
  )

  const listUserArray = useMemo(() => mostWords.map(u => u.user), [mostWords])
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
          <DialogTitle>List Comment</DialogTitle>
          <DialogDescription>
            Showing comment{' '}
            {word && (
              <>
                containing <span className='font-bold'>{word}</span>
              </>
            )}{' '}
            {selectedUsername && <>from @{selectedUsername}</>}
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
        {username == '' && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                className='w-full justify-between'
              >
                {selectedUsername
                  ? listUserArray.find(
                      user => user.uniqueId === selectedUsername,
                    )?.uniqueId
                  : 'Select user...'}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[400px] p-0'>
              <Command>
                <CommandInput placeholder='Search by username...' />
                <CommandList>
                  <CommandEmpty>No user found.</CommandEmpty>
                  <CommandGroup>
                    {listUserArray.map(user => (
                      <CommandItem
                        key={user.uniqueId}
                        value={user.uniqueId}
                        onSelect={currentValue => {
                          setSelectedUsername(
                            currentValue === selectedUsername
                              ? ''
                              : currentValue,
                          )
                          setOpen(false)
                        }}
                        className='flex justify-between'
                      >
                        <div className='flex items-center gap-3'>
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedUsername === user.uniqueId
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                          {user.nickname}
                        </div>{' '}
                        <span className='text-sm text-muted-foreground'>
                          @{user.uniqueId}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
        <DataTable table={table} />
      </DialogContent>
    </Dialog>
  )
}
