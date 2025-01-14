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
import { useContext } from "react"
import { AppContext } from "../app-context"

export default function ExportButton() {
    const { downloadToJson } = useContext(AppContext)
    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button><DownloadIcon /> Export Data</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={downloadToJson}>Export to JSON</DropdownMenuItem>
            <DropdownMenuItem disabled={true}>Export To CSV</DropdownMenuItem>

        </DropdownMenuContent>
    </DropdownMenu>
    )
}