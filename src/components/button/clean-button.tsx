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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { cleanLogs } from '@/store/logsSlice'
import { getAllLogs } from '../selector/logs'

export default function CleanButton() {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const allLogs = useSelector(getAllLogs)
  const handleCleanLogs = () => dispatch(cleanLogs())

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size={'sm'}
            variant={'outline'}
            disabled={allLogs.length == 0}
          >
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently clear the logs
              data from last user. Make sure you export it first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCleanLogs}>
              Continue
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
