"use client"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useContext, useState } from "react";
import { AppContext } from "../app-context";
export default function ConnectButton() {
    const [open, setOpen] = useState(false)
    const {
        handleConnectButtonClick,
        username,
        isConnectedToServer,
        logs
    } = useContext(AppContext);
    const connectButton = () => {
        if (logs.length > 0) {
            setOpen(true)
        } else {
            handleConnectButtonClick()
        }
    }
    return (
        <>
            <Button size={"sm"} className="w-full"
                disabled={!username || isConnectedToServer}
                onClick={connectButton}
            >Connect</Button>
            <AlertDialog open={open} onOpenChange={setOpen}>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the data from last user. Make sure you export it first.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleConnectButtonClick}>Continue</AlertDialogAction>
                        <AlertDialogCancel>Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}