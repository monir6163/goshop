/* eslint-disable react/prop-types */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function OrderTable({ data, column, page, limit }) {
  const table = useReactTable({
    data,
    columns: column,
    page: page,
    limit: limit,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="p-2">
      {data?.length > 0 &&
      <table className="w-full">
        <thead className="bg-black text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th className="border">S.No</th>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border whitespace-nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id}>
              <td className="border px-2 py-1 text-center whitespace-nowrap">
              {(page - 1) * limit + i + 1}
              </td>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border px-2 py-1 text-center whitespace-nowrap"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    }
    </div>
  );
}
