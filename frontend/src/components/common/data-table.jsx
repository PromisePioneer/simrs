import {useState, useEffect} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    X,
    Loader2
} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.jsx";

function DataTable({
                       title,
                       description,
                       columns,
                       data,
                       isLoading,
                       pagination,
                       onPageChange,
                       currentPage,
                       onSearch,
                       search,
                       searchPlaceholder = "Search...",
                       emptyStateIcon: EmptyIcon,
                       emptyStateText = "No data found",
                       renderRow,
                       showSearch = true
                   }) {
    return (

        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-900">{title}</CardTitle>
                        {description && (
                            <CardDescription className="text-sm text-gray-600 mt-1">
                                {description}
                            </CardDescription>
                        )}
                    </div>

                    {/* Enhanced Search Input */}
                    {showSearch && (
                        <div className="relative w-full sm:w-80">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                            />
                            <Input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={search}
                                onChange={(e) => onSearch(e.target.value)}
                                className="pl-10 pr-10 border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent rounded-lg"
                            />
                            {search && (
                                <button
                                    onClick={() => onSearch('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                                >
                                    <X className="h-4 w-4"/>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="px-0">
                {/* Enhanced Table Container */}
                <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                                {columns.map((column, index) => (
                                    <TableHead
                                        key={index}
                                        className={`text-xs font-semibold text-gray-600 uppercase tracking-wider py-4 ${column.align === 'right' ? 'text-right' : ''} ${column.className || ''}`}
                                        style={column.width ? {width: column.width} : {}}
                                    >
                                        {column.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-16">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Loader2 className="h-8 w-8 text-teal-600 animate-spin"/>
                                            <span className="text-sm text-gray-500 font-medium">
                                                Memuat data..
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data && data.length > 0 ? (
                                data.map((item, index) => renderRow(item, index))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            {EmptyIcon && (
                                                <div
                                                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <EmptyIcon className="h-8 w-8 text-gray-400"/>
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-gray-600">
                                                    {search
                                                        ? 'Tidak ada hasil pencarian'
                                                        : emptyStateText
                                                    }
                                                </span>
                                                {search && (
                                                    <span className="text-sm text-gray-500">
                                                        Untuk kata kunci "<span
                                                        className="font-medium text-gray-700">{search}</span>"
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Enhanced Pagination */}
                {pagination && data && data.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
                        {/* Pagination Info */}
                        <div className="text-sm text-gray-600 font-medium">
                            Menampilkan <span className="text-gray-900 font-semibold">{pagination.from}</span> - <span
                            className="text-gray-900 font-semibold">{pagination.to}</span> dari <span
                            className="text-gray-900 font-semibold">{pagination.total}</span> data
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-2">
                            {/* First Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(1)}
                                disabled={currentPage === 1}
                                className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                            >
                                <ChevronsLeft className="h-4 w-4"/>
                            </Button>

                            {/* Previous Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4"/>
                            </Button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({length: pagination.last_page}, (_, i) => i + 1)
                                    .filter(page => {
                                        return page === 1 ||
                                            page === pagination.last_page ||
                                            (page >= currentPage - 1 && page <= currentPage + 1);
                                    })
                                    .map((page, index, array) => {
                                        const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;

                                        return (
                                            <div key={page} className="flex items-center">
                                                {showEllipsisBefore && (
                                                    <span className="px-2 text-gray-400 font-medium">...</span>
                                                )}
                                                <Button
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => onPageChange(page)}
                                                    className={`h-9 w-9 p-0 font-medium ${
                                                        currentPage === page
                                                            ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-md'
                                                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                                    }`}
                                                >
                                                    {page}
                                                </Button>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Next Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === pagination.last_page}
                                className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                            >
                                <ChevronRight className="h-4 w-4"/>
                            </Button>

                            {/* Last Page */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(pagination.last_page)}
                                disabled={currentPage === pagination.last_page}
                                className="h-9 w-9 p-0 border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                            >
                                <ChevronsRight className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default DataTable;