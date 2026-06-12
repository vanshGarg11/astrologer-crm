import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import Button from './Button';

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  actions,
  emptyTitle = 'No records found',
}: {
  columns: Column<T>[];
  data: T[];
  actions?: (row: T) => ReactNode;
  emptyTitle?: string;
}) {
  // State for sorting and pagination
  const [sortKey, setSortKey] = useState<string>('');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sort data based on current sort key and direction
  const sorted = useMemo(() => {
    const next = [...data];
    if (!sortKey) return next;
    return next.sort((a, b) => {
      const left = String((a as Record<string, unknown>)[sortKey] ?? '');
      const right = String((b as Record<string, unknown>)[sortKey] ?? '');
      return direction === 'asc' ? left.localeCompare(right) : right.localeCompare(left);
    });
  }, [data, direction, sortKey]);

  // Calculate pagination values
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize);
  const start = sorted.length ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, sorted.length);

  // Reset to page 1 when data changes
  useEffect(() => {
    setPage(1);
  }, [data.length, pageSize, sortKey, direction]);

  // Get the appropriate sort icon
  const sortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown size={14} />;
    return direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  // Show empty state if no data
  if (!data.length) {
    return (
      <div className="glass-panel rounded-md border-dashed p-10 text-center">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{emptyTitle}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Adjust your search or create a new record.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden rounded-md">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          {/* Table Header - Column names and sort buttons */}
          <thead className="bg-slate-50/90 text-xs font-semibold uppercase text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3.5 text-left">
                  {column.sortable ? (
                    <button
                      className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-white/60 hover:text-slate-950 dark:hover:bg-slate-800/50 dark:hover:text-white"
                      onClick={() => {
                        const key = String(column.key);
                        setSortKey(key);
                        setDirection((value) => (sortKey === key && value === 'asc' ? 'desc' : 'asc'));
                      }}
                    >
                      {column.header} <span className="opacity-70">{sortIcon(String(column.key))}</span>
                    </button>
                  ) : (
                    <span className="px-2 py-1.5">{column.header}</span>
                  )}
                </th>
              ))}
              {actions && <th className="px-4 py-3.5 text-right">Actions</th>}
            </tr>
          </thead>
          
          {/* Table Body - Data rows */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => (
              <tr key={row.id} className="transition duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/80">
                {columns.map((column) => (
                  <td key={String(column.key)} className="max-w-xs whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-200">
                    {column.render ? column.render(row) : String((row as Record<string, unknown>)[String(column.key)] ?? '')}
                  </td>
                ))}
                {actions && <td className="px-4 py-3.5 text-right">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <span className="font-medium">
            Showing {start}-{end} of {sorted.length}
          </span>
          <select className="input-surface px-3 py-1.5 text-sm" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
            {[5, 10, 25].map((size) => <option key={size} value={size}>{size} rows</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="min-h-8 px-3 py-1" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
            Previous
          </Button>
          <span className="min-w-20 text-center font-medium text-slate-600 dark:text-slate-400">Page {page} of {pages}</span>
          <Button variant="outline" className="min-h-8 px-3 py-1" disabled={page === pages} onClick={() => setPage((value) => value + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
