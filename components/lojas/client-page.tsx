"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LojasDataTable } from "./data-table"
import { columns } from "./columns"
import { mockLojas } from "./mock-data"

export function LojasClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Estados para filtros
  const [globalFilter, setGlobalFilter] = useState("")

  // Parâmetros da URL
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const activeOnly = searchParams.get("active") === "true"

  // Filtrar dados
  const filteredData = useMemo(() => {
    let filtered = mockLojas

    // Filtro por status ativo
    if (activeOnly) {
      filtered = filtered.filter((loja) => loja.status === 1)
    }

    // Filtro global (busca)
    if (globalFilter) {
      filtered = filtered.filter(
        (loja) =>
          loja.nome.toLowerCase().includes(globalFilter.toLowerCase()) ||
          loja.cidade.toLowerCase().includes(globalFilter.toLowerCase()) ||
          loja.bandeira.toLowerCase().includes(globalFilter.toLowerCase()),
      )
    }

    return filtered
  }, [activeOnly, globalFilter])

  // Paginação
  const totalPages = Math.ceil(filteredData.length / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const updateURL = (params: Record<string, string | number | boolean>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === false || value === 0) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value.toString())
      }
    })

    router.push(`/lojas?${newSearchParams.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lojas</h1>
        <p className="text-muted-foreground">Gerencie as lojas do sistema</p>
      </div>

      <LojasDataTable
        columns={columns}
        data={paginatedData}
        totalCount={filteredData.length}
        currentPage={page}
        pageSize={limit}
        totalPages={totalPages}
        activeOnly={activeOnly}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onPageChange={(newPage) => updateURL({ page: newPage })}
        onPageSizeChange={(newPageSize) => updateURL({ limit: newPageSize, page: 1 })}
        onActiveFilterChange={(active) => updateURL({ active, page: 1 })}
      />
    </div>
  )
}
