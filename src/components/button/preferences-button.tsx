'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PenIcon } from 'lucide-react'
import { Switch } from '../ui/switch'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { setPreferences } from '@/store/preferencesSlice'
import { PreferencesState, PreferencesType } from '@/lib/types/common'
import { useEffect } from 'react'
import useLocalStorage from '@/hooks/use-localstorage'

const PREFERENCES_LABEL: { [key: string]: string } = {
  show_gift_level_badge: 'Gift Level Badge',
  show_mod_badge: 'Moderator Badge',
  show_relation_status: 'Relationship Badge',
  show_relative_timestamp: 'Relative timestamp',
}
export default function PreferencesButton() {
  const preferences = useSelector(({ preferences }: RootState) => preferences)
  const dispatch = useDispatch()

  const { set, get } = useLocalStorage()
  const handlePreferencesSwitch = ({
    key,
    value,
  }: {
    key: keyof PreferencesState
    value: boolean
  }) => {
    dispatch(setPreferences({ [key]: value }))
    set('options:preferences', JSON.stringify({ [key]: value }))
  }

  useEffect(() => {
    const savedPreferences = get('options:preferences')
    if (savedPreferences) {
      const parsedSavedPreferences = JSON.parse(savedPreferences)
      for (const [key, value] of Object.entries(parsedSavedPreferences)) {
        dispatch(setPreferences({ [key]: value }))
      }
    }
  }, [])
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='mt-1' variant='outline'>
          <PenIcon /> Preferences
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>Custom unwanted things on UI.</DialogDescription>
        </DialogHeader>
        <div className='text-xs px-2 flex flex-col gap-1'>
          {Object.keys(preferences).map(key => (
            <div key={key} className='flex items-center space-x-2 uppercase'>
              <Switch
                id={key}
                checked={preferences[key as keyof PreferencesState]}
                onCheckedChange={value =>
                  handlePreferencesSwitch({
                    key: key as PreferencesType,
                    value,
                  })
                }
              />
              <Label htmlFor={key}>{PREFERENCES_LABEL[key]}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>{/* Auto */}</DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
