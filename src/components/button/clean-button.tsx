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
import { Trash2 } from "lucide-react";
export default function CleanButton() {
    const [open, setOpen] = useState(false)
    const {
        handleCleanLogsClick,
        isConnectedToServer,
        logs
    } = useContext(AppContext);

    return (

        <>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button size={"sm"} variant={"outline"}
                        disabled={logs.length == 0}
                    ><Trash2 /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently clear the logs data from last user. Make sure you export it first.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleCleanLogsClick}>Continue</AlertDialogAction>
                        <AlertDialogCancel>Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}