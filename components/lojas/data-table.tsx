"use client"

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { LojasDataTableToolbar } from "./data-table-toolbar"
import { LojasDataTablePagination } from "./data-table-pagination"

interface LojasDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalCount: number
  currentPage: number
  pageSize: number
  totalPages: number
  activeOnly: boolean
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onActiveFilterChange: (active: boolean) => void
}

export function LojasDataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  currentPage,
  pageSize,
  totalPages,
  activeOnly,
  globalFilter,
  onGlobalFilterChange,
  onPageChange,
  onPageSizeChange,
  onActiveFilterChange,
}: LojasDataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
      globalFilter,
    },
  })

  return (
    <div className="space-y-4">
      <LojasDataTableToolbar
        table={table}
        activeOnly={activeOnly}
        onActiveFilterChange={onActiveFilterChange}
        globalFilter={globalFilter}
        onGlobalFilterChange={onGlobalFilterChange}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhuma loja encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <LojasDataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
