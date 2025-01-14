"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PenIcon } from "lucide-react"
import { Switch } from "../ui/switch"
import { useContext } from "react"
import { AppContext } from "../app-context"
export type PreferencesType = "show_gift_level_badge" | "show_mod_badge" | "show_relation_status"
export const DEFAULT_PREFERENCES: { [key: string]: boolean } = {
  "show_gift_level_badge": true,
  "show_mod_badge": true,
  "show_relation_status": true,
  "show_relative_timestamp": false
}
export const PREFERENCES_LABEL: { [key: string]: string } = {
  "show_gift_level_badge": "Gift Level Badge",
  "show_mod_badge": "Moderator Badge",
  "show_relation_status": "Relationship Badge",
  "show_relative_timestamp": "Relative timestamp"
}

export default function PreferencesButton() {
  const { preferences, handlePreferencesSwitch } = useContext(AppContext)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-1" variant="outline"><PenIcon /> Preferences</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>
            Custom unwanted things on UI.
          </DialogDescription>
        </DialogHeader>
        <div className="text-xs px-2 flex flex-col gap-1">
          {
            Object.keys(DEFAULT_PREFERENCES).map((key => (
              <div key={key} className="flex items-center space-x-2 uppercase">
                <Switch id={key} checked={preferences[key]} onCheckedChange={(e) => handlePreferencesSwitch(key, e)} />
                <Label htmlFor={key}>{PREFERENCES_LABEL[key]}</Label>
              </div>
            )))
          }



        </div>
        <DialogFooter>
          {/* Auto */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
