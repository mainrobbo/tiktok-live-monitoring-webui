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
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { useEffect } from "react"
import useLocalStorage from "@/hooks/use-localstorage"
import { setWSUrl, setProxyUrl, setProxyTimeout } from "@/store/connectionSlice"

export function AppSettingPopover() {
    const dispatch = useDispatch();
    const { wsUrl, proxyUrl, proxyTimeout } = useSelector(({ connection }: { connection: RootState["connection"] }) => connection);

    const { get } = useLocalStorage()

    useEffect(() => {
        const savedWsUrl = get('wsUrl')
        if (savedWsUrl) {
            dispatch(setWSUrl(savedWsUrl));
        }
        const savedProxyUrl = get('proxyUrl')
        if (savedProxyUrl) {
            dispatch(setProxyUrl(savedProxyUrl));
        }
        const savedProxyTimeout = get('proxyTimeout')
        if (savedProxyTimeout) {
            dispatch(setProxyTimeout(parseInt(savedProxyTimeout)));
        }
    }, []);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setWSUrl(e.target.value));
    };
    const handleProxyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setProxyUrl(e.target.value));
    };
    const handleProxyTimeoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setProxyTimeout(parseInt(e.target.value)));
    };
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
                                value={wsUrl}
                                onChange={handleUrlChange}
                                className="col-span-2 h-8"
                                placeholder="Server URL"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">Proxy</Label>
                            <Input
                                onChange={handleProxyUrlChange}
                                defaultValue={proxyUrl}
                                className="col-span-2 h-8"
                                disabled={true}
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="height">Proxy Timeout</Label>
                            <Input
                                onChange={handleProxyTimeoutChange}
                                defaultValue={proxyTimeout.toString()}
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