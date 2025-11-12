import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SortDesc,
  SortAsc,
  ArrowRightLeft,
  Loader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { flexRender, Table as TableType } from "@tanstack/react-table";

interface LinkTableProps<TData> {
  table: TableType<TData>;
  loading: boolean;
  error: true | Error | null;
  isRefetching: boolean;
}

const UITable = <TData,>({
  table,
  loading,
  error,
  isRefetching,
}: LinkTableProps<TData>) => {
  return (
    <div className="relative  bg-white rounded-lg border border-ttickles-lightblue shadow-sm overflow-visible">
      <Table className="border-collapse w-full">
        <TableHeader className="bg-ttickles-blue backdrop-blur rounded-t-2xl shadow">
          {table.getHeaderGroups().map(({ id, headers }) => (
            <TableRow key={id} className="w-full">
              {headers.map(({ id, column, getContext, getSize }) => (
                <TableHead
                  key={id}
                  style={{
                    width: column.id === "select" ? "60px" : getSize(),
                  }}
                  className={`py-1 text-base font-semibold text-white bg-transparent first:rounded-tl-2xl last:rounded-tr-2xl ${
                    column.id === "select"
                      ? "flex justify-center items-center px-2"
                      : "px-6"
                  }`}
                >
                  {column.id === "select" ? (
                    flexRender(column.columnDef.header, getContext())
                  ) : (
                    <div className="flex items-center gap-1 justify-center w-1/2 mx-auto">
                      {flexRender(column.columnDef.header, getContext())}
                      {column.getCanSort() && (
                        <button
                          onClick={column.getToggleSortingHandler()}
                          className="ml-1 text-ttickles-white transition-none pointer-events-auto"
                          aria-label="Toggle sort"
                        >
                          {column.getIsSorted() === "asc" && (
                            <SortAsc size={18} />
                          )}
                          {column.getIsSorted() === "desc" && (
                            <SortDesc size={18} />
                          )}
                          {!column.getIsSorted() && (
                            <ArrowRightLeft size={18} className="opacity-60" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="min-h-[70vh]" style={{ height: "100%" }}>
          {loading || isRefetching ? (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="min-h-[70vh] text-center"
              >
                <div className="flex items-center justify-center gap-3 text-ttickles-lightblue">
                  <Loader size={20} className="animate-spin" />
                  <span className="font-medium">Loading users…</span>
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                <div className="flex items-center justify-center gap-3 text-red-400">
                  <span className="font-medium">Error loading data.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map(({ id, original, getIsSelected, getVisibleCells }) => {
                const isSelected = getIsSelected();
                console.log({ original, isSelected });

                return (
                  <TableRow
                    key={id}
                    className={`border-b border-gray-100 hover:bg-photo-green-50 transition-colors cursor-pointer`}
                  >
                    {getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width:
                            cell.column.id === "select"
                              ? "60px"
                              : cell.column.getSize(),
                        }}
                        className="px-6 py-3 text-sm text-gray-900  text-center"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-gray-500"
              >
                No Data found.
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            !error &&
            table.getRowModel().rows?.length > 0 &&
            (() => {
              const pageSize = 10;
              const rows = table.getRowModel().rows.length;
              const fillers = Math.max(0, pageSize - rows);
              const cols = table.getVisibleLeafColumns();
              return Array.from({ length: fillers }).map((_, i) => (
                <TableRow
                  key={`filler-${i}`}
                  className="border-b border-gray-100"
                >
                  {cols.map((col) => (
                    <TableCell key={`f-${i}-${col.id}`} className="px-6 py-4">
                      <span className="opacity-0">&nbsp;</span>
                    </TableCell>
                  ))}
                </TableRow>
              ));
            })()}
        </TableBody>
      </Table>
      <div className="flex w-full items-center justify-between rounded-b bg-white p-4 text-lg border-t border-photo-green-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {loading && (
            <Loader size={20} className="animate-spin text-photo-green-400" />
          )}
          <div className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="text-sm text-gray-600">
            {table.getRowModel().rows.length} row(s)
          </div>
        </div>
      </div>
    </div>
  );
};

export default UITable;
