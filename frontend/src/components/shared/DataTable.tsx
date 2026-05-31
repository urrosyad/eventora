import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filterComponent?: ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyState,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filterComponent,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {/* Table Filters & Search */}
      {(onSearchChange || filterComponent) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 border border-border rounded-xl">
          {onSearchChange && (
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#F7F8FA] border border-border rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue placeholder:text-muted-ink"
              />
            </div>
          )}
          {filterComponent && (
            <div className="flex items-center space-x-3 flex-wrap">
              {filterComponent}
            </div>
          )}
        </div>
      )}

      {/* Table Body */}
      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-[#F7F8FA]">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`px-6 py-3.5 text-left text-xs font-semibold text-muted-ink uppercase tracking-wider ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Loader2 className="w-6 h-6 text-primary-blue animate-spin" />
                      <span className="text-sm text-muted-ink">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4">
                    {emptyState || (
                      <div className="text-center py-12 text-sm text-muted-ink">
                        No records found.
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-[#F7F8FA]/60 transition-colors">
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-6 py-4 text-sm text-ink whitespace-nowrap ${col.className || ""}`}
                      >
                        {col.accessor(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
