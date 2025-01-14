"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CogIcon } from "lucide-react"
import { Separator } from "./ui/separator"
import { useContext } from "react"
import { AppContext } from "./app-context"

export function AppSettingPopover() {
    const { wsUrl, setWsUrl, isConnectedToServer } = useContext(AppContext)
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} size={"sm"}>
                    <CogIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Setting</h4>
                        <Separator />
                        <p className="text-sm text-muted-foreground">
                            {/* Setting. */}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width">Server URL</Label>
                            <Input
                                disabled={isConnectedToServer}
                                id="serverUrl"
                                value={wsUrl}
                                onChange={(e) => setWsUrl(e.target.value)}
                                className="col-span-2 h-8"
                                placeholder="Server URL"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">Proxy</Label>
                            <Input
                                id="proxy"
                                defaultValue="127.0.0.1:8080"
                                className="col-span-2 h-8"
                                disabled={true}
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="height">Proxy Timeout</Label>
                            <Input
                                id="proxy_to"
                                defaultValue="10000"
                                className="col-span-2 h-8"
                                disabled={true}
                            />
                        </div>

                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}