import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  /** Unique column key. */
  key: string;
  /** Column header text. */
  header: ReactNode;
  /** Cell content for a row. */
  render: (row: T) => ReactNode;
  /** Render the cell in IBM Plex Mono - use for versions, dates, counts. */
  mono?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Stable key per row. */
  rowKey: (row: T) => string;
  /** Minimum table width in px before it scrolls horizontally (default 640). */
  minWidth?: number;
  /** Shown in place of rows when `rows` is empty. */
  empty?: ReactNode;
}

/** Full-width data table; place inside `<Panel flush>`. Scrolls horizontally on narrow screens. */
export function DataTable<T>({ columns, rows, rowKey, minWidth = 640, empty = '결과가 없습니다.' }: DataTableProps<T>) {
  return (
    <div className="lc-table-wrap">
      <table className="lc-table" style={{ minWidth }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="lc-table__empty">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={rowKey(r)}>
                {columns.map((c) => (
                  <td key={c.key} className={c.mono ? 'lc-table__cell--mono' : undefined}>
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export interface RowLinkProps {
  onClick?: () => void;
  children: ReactNode;
}

/** Underlined row-title button for the first DataTable column; clicking opens the row's detail. */
export function RowLink({ onClick, children }: RowLinkProps) {
  return (
    <button type="button" className="lc-table__rowlink" onClick={onClick}>
      {children}
    </button>
  );
}
