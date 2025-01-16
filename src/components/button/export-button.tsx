"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { DownloadIcon } from "lucide-react"
import moment from "moment"
import { useSelector } from "react-redux"
import { getAllLogs } from "../selector/logs"
import { RootState } from "@/store"

export default function ExportButton() {
    const logs = useSelector(getAllLogs)
    const username = useSelector((state: RootState) => state.setting.username)
    const handleExportToJSON = () => {
        const fileName = `live_${username}_${moment().format("DD_MM_YY_hh_mm")}`;
        const json = JSON.stringify(logs);
        const blob = new Blob([json], { type: 'application/json' });
        const href = URL.createObjectURL(blob); // Create a downloadable link
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);   // This can any part of your website
        link.click();
        document.body.removeChild(link);
    }
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button><DownloadIcon /> Export Data</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportToJSON} disabled={logs.length == 0}>Export to JSON</DropdownMenuItem>
            <DropdownMenuItem disabled>Export To CSV</DropdownMenuItem>

        </DropdownMenuContent>
    </DropdownMenu>
    )
}