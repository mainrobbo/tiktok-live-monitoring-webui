'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { SocketActionType } from '@/lib/types/common'
import { RootState } from '@/store'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isLogsExist } from '../selector/logs'
import { RefreshCwIcon } from 'lucide-react'
export default function ConnectButton() {
  const [open, setOpen] = useState(false)

  const { username } = useSelector(
    ({ setting }: { setting: RootState['setting'] }) => setting,
  )
  const { live, wsUrl, state } = useSelector(
    ({ connection }: { connection: RootState['connection'] }) => connection,
  )
  const logs = useSelector(isLogsExist)
  const dispatch = useDispatch()
  const handleConnectButton = () => {
    if (logs) {
      setOpen(true)
    } else {
      connectButton()
    }
  }
  const connectButton = () => {
    dispatch({
      type: SocketActionType.START,
      payload: { wsUrl, username },
    })
  }
  return (
    <>
      <Button
        size='sm'
        className={`w-full ${
          state == 'connecting'
            ? 'bg-amber-500'
            : 'bg-emerald-500 hover:bg-emerald-400'
        }`}
        disabled={!username || state === 'connecting' || live || !wsUrl}
        onClick={handleConnectButton}
      >
        {state === 'connecting' ? (
          <RefreshCwIcon className='animate-spin' />
        ) : (
          'Start'
        )}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              data from last user. Make sure you export it first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={connectButton}>
              Continue
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
