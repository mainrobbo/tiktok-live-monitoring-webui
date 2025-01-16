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
import { useEffect, useRef, useState } from 'react'
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
  const [showTransition, setShowTransition] = useState(false)
  const prevState = useRef(state)
  useEffect(() => {
    if (state === 'connecting') {
      // Reset transition state when connecting starts
      setShowTransition(false)
    } else if (
      prevState.current === 'connecting' &&
      state.toString() !== 'connecting'
    ) {
      // State has switched from 'connecting' to something else
      setShowTransition(true)

      // After a brief period, reset back to the 'Start' button
      const timer = setTimeout(() => {
        setShowTransition(false)
      }, 2000) // Duration before reverting to "Start" button

      return () => clearTimeout(timer) // Cleanup timeout
    }

    // Update previous state reference
    prevState.current = state
  }, [state])
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
      payload: { url: wsUrl, username },
    })
  }
  return (
    <>
      <Button
        size='sm'
        className={`w-full ${
          showTransition ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
        disabled={
          !username || state.toString() === 'connecting' || live || !wsUrl
        }
        onClick={handleConnectButton}
      >
        {state === 'connecting' ? (
          <RefreshCwIcon className='animate-spin' />
        ) : showTransition ? (
          <RefreshCwIcon className='animate-spin duration-300' />
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
