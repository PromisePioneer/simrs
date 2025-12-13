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
    X
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
                       onSearch,
                       searchPlaceholder = "Search...",
                       emptyStateIcon: EmptyIcon,
                       emptyStateText = "No data found",
                       renderRow,
                       showSearch = true
                   }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        if (!onSearch) return;

        const delaySearch = setTimeout(() => {
            onSearch(searchInput);
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchInput]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        if (onPageChange) {
            onPageChange(page);
        }
    };

    const handleClearSearch = () => {
        setSearchInput("");
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>

                    {/* Search Input */}
                    {showSearch && (
                        <div className="relative w-full sm:w-72">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                            />
                            <Input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            {searchInput && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4"/>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableHead
                                        key={index}
                                        className={column.className}
                                    >
                                        {column.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-8">
                                        <div className="flex items-center justify-center gap-2">
                                            <Spinner className="h-10 w-10"/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data && data.length > 0 ? (
                                data.map((item, index) => renderRow(item, index))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-center py-8">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            {EmptyIcon && <EmptyIcon className="h-8 w-8"/>}
                                            <span>
                                                {searchInput
                                                    ? `${emptyStateText} untuk "${searchInput}"`
                                                    : emptyStateText
                                                }
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {pagination && data && data.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                        <div className="text-sm text-muted-foreground">
                            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronsLeft className="h-4 w-4"/>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4"/>
                            </Button>

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
                                                    <span className="px-2 text-muted-foreground">...</span>
                                                )}
                                                <Button
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            </div>
                                        );
                                    })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.last_page}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4"/>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.last_page)}
                                disabled={currentPage === pagination.last_page}
                                className="h-8 w-8 p-0"
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