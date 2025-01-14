import {
    ArrowDown,
    ArrowLeftToLine,
    ArrowRightToLine,
    ArrowUp,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { flexRender } from "@tanstack/react-table";
import type { Table as TanstackTable } from "@tanstack/react-table";

interface DataTableProps<T> {
    table: TanstackTable<T>;
    options?: {
        lengthChange?: boolean;
    };
}

export function DataTable<T,>({ table, options }: DataTableProps<T>) {
    if (options?.lengthChange) options.lengthChange = true;
    return (
        <div style={{ maxWidth: "100%" }}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}

                                    className={
                                        header.column.getCanSort()
                                            ? 'cursor-pointer select-none'
                                            : ''}>
                                    <div className="flex items-center">
                                        {!header.isPlaceholder &&
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )} {{
                                                asc: <ArrowUp size={12} />,
                                                desc: <ArrowDown size={12} />,
                                            }[header.column.getIsSorted() as string] ?? null}</div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length > 0 ?
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="text-xs">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )) : <TableRow>
                            <TableCell className="text-center" colSpan={table.getHeaderGroups()[0].headers.length}>
                                No Data.
                            </TableCell>
                        </TableRow>}
                </TableBody>
            </Table>
            {(table._getPaginationRowModel != undefined) &&
                <Pagination>
                    <PaginationContent className={"flex flex-col lg:flex-row"}>
                        <div className="flex flex-row">
                            <PaginationItem
                            >
                                <PaginationLink
                                    onClick={() => table.firstPage()}
                                >
                                    <ArrowLeftToLine className="h-4 w-4" />
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => table.previousPage()}

                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                </PaginationPrevious>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        table.getCanNextPage() ? table.nextPage() : null
                                    }
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </PaginationNext>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink
                                    onClick={() => table.lastPage()}
                                >
                                    <ArrowRightToLine className="h-4 w-4" />
                                </PaginationLink>
                            </PaginationItem>
                        </div>
                        <div className="flex flex-col lg:flex-row items-center space-x-6 lg:space-x-8">
                            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                                Page {table.getState().pagination.pageIndex + 1} of{" "}
                                {table.getPageCount()}
                            </div>
                            {options?.lengthChange && (
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm font-medium">Rows per page</p>
                                    <Select
                                        value={`${table.getState().pagination.pageSize}`}
                                        onValueChange={(value: string) => {
                                            table.setPageSize(Number(value));
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue
                                                placeholder={table.getState().pagination.pageSize}
                                            />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                                    {pageSize}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </PaginationContent>
                </Pagination>}
        </div>
    );
}