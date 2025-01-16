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
import { useDispatch, useSelector } from 'react-redux'
export default function DisconnectButton() {
  const { live, connected } = useSelector(
    ({ connection }: { connection: RootState['connection'] }) => connection,
  )
  const { roomInfo, liveIntro } = useSelector(
    ({ liveInfo }: { liveInfo: RootState['liveInfo'] }) => liveInfo,
  )
  const dispatch = useDispatch()
  const handleDisconnect = () => {
    dispatch({ type: SocketActionType.STOP })
  }
  const cek = () => {
    console.log({ live, connected, roomInfo, liveIntro })
  }
  return (
    <>
      <Button
        disabled={!live}
        onClick={handleDisconnect}
        variant={'destructive'}
        size={'sm'}
      >
        Stop
      </Button>
      <Button onClick={cek} variant={'destructive'} size={'sm'}>
        C
      </Button>
    </>
  )
}
