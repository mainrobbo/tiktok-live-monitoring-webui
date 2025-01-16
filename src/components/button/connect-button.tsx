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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { SocketActionType } from "@/lib/types/common";
import { RootState } from "@/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function ConnectButton() {
    const [open, setOpen] = useState(false)

    const { username } = useSelector(({ setting }: { setting: RootState["setting"] }) => setting);
    const { live, wsUrl } = useSelector(({ connection }: { connection: RootState["connection"] }) => connection);
    const dispatch = useDispatch();
    const connectButton = () => {
        dispatch({ type: SocketActionType.START, payload: { url: wsUrl, username } });
    }
    return (
        <>
            <Button size={"sm"} className="w-full bg-emerald-500"
                disabled={!username || live || !wsUrl}
                onClick={connectButton}
            >Start</Button>
            <AlertDialog open={open} onOpenChange={setOpen}>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the data from last user. Make sure you export it first.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={connectButton}>Continue</AlertDialogAction>
                        <AlertDialogCancel>Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}