"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronRight, Plus, Trash2, Star, Crown, MapPin, Users } from "lucide-react"

interface PartnershipAccordionTableProps {
  stores: any[]
  onAddOSCs: (storeId: number) => void
  onRemoveOSC: (storeId: number, oscId: number) => void
  onToggleFavorite: (storeId: number, oscId: number) => void
  onTogglePartnershipStatus: (storeId: number, oscId: number) => void
}

export function PartnershipAccordionTable({
  stores,
  onAddOSCs,
  onRemoveOSC,
  onToggleFavorite,
  onTogglePartnershipStatus,
}: PartnershipAccordionTableProps) {
  const [expandedStores, setExpandedStores] = useState<Set<number>>(new Set())

  const toggleStore = (storeId: number) => {
    const newExpanded = new Set(expandedStores)
    if (newExpanded.has(storeId)) {
      newExpanded.delete(storeId)
    } else {
      newExpanded.add(storeId)
    }
    setExpandedStores(newExpanded)
  }

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return "N/A"
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  const getPartnershipStatusColor = (status: string) => {
    return status === "Ativa"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200"
  }

  const getOSCCountText = (count: number) => {
    if (count === 0) return "Nenhuma OSC associada"
    if (count === 1) return "1 OSC associada"
    return `${count} OSCs associadas`
  }

  return (
    <div className="overflow-hidden">
      {/* Main Table Header */}
      <div className="bg-gray-50 border-b">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
          <div className="col-span-1"></div> {/* Expand button column */}
          <div className="col-span-4">Loja</div>
          <div className="col-span-3">CNPJ</div>
          <div className="col-span-4">OSCs Associadas</div>
        </div>
      </div>

      {/* Store Rows */}
      <div className="divide-y divide-gray-200">
        {stores.map((store, index) => {
          const isExpanded = expandedStores.has(store.id)
          const oscCount = store.oscsAssociadas.length
          const activeOSCs = store.oscsAssociadas.filter((osc: any) => osc.statusParceria === "Ativa").length

          return (
            <div key={store.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
              {/* Store Row */}
              <div
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-blue-50/50 cursor-pointer transition-colors"
                onClick={() => toggleStore(store.id)}
              >
                {/* Expand Button */}
                <div className="col-span-1 flex items-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                  </Button>
                </div>

                {/* Store Info */}
                <div className="col-span-4 flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#E8772E] to-[#d16b26] text-white rounded-lg shadow-sm">
                    <span className="text-xs font-bold">{store.codigo}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{store.nome}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {store.cidade}, {store.uf}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Store CNPJ */}
                <div className="col-span-3 flex items-center">
                  <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {formatCNPJ(store.cnpj)}
                  </span>
                </div>

                {/* OSC Count */}
                <div className="col-span-4 flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{getOSCCountText(oscCount)}</span>
                  </div>
                  {oscCount > 0 && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        {activeOSCs} Ativas
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t bg-gray-50/30">
                  <div className="px-6 py-6">
                    {/* Add OSCs Button */}
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <Users className="w-5 h-5 text-[#E8772E]" />
                        <span>OSCs Associadas</span>
                      </h4>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddOSCs(store.id)
                        }}
                        className="bg-gradient-to-r from-[#E8772E] to-[#d16b26] hover:from-[#d16b26] hover:to-[#c55d1f] text-white shadow-sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar OSCs
                      </Button>
                    </div>

                    {/* OSCs Table or Empty State */}
                    {store.oscsAssociadas.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <h5 className="text-lg font-medium text-gray-600 mb-2">Nenhuma parceria estabelecida</h5>
                        <p className="text-gray-500 mb-6">Esta loja ainda não possui OSCs vinculadas</p>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            onAddOSCs(store.id)
                          }}
                          variant="outline"
                          className="border-[#E8772E] text-[#E8772E] hover:bg-[#E8772E] hover:text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar primeira OSC
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-semibold text-gray-700">OSC</TableHead>
                              <TableHead className="font-semibold text-gray-700">CNPJ</TableHead>
                              <TableHead className="font-semibold text-gray-700">Responsável</TableHead>
                              <TableHead className="font-semibold text-gray-700">Localização</TableHead>
                              <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
                              <TableHead className="font-semibold text-gray-700 text-center">Parceria</TableHead>
                              <TableHead className="font-semibold text-gray-700 text-center">Favorita</TableHead>
                              <TableHead className="font-semibold text-gray-700 text-center">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {store.oscsAssociadas.map((osc: any, oscIndex) => (
                              <TableRow
                                key={osc.id}
                                className={`
                                  ${oscIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                                  ${
                                    osc.favorita
                                      ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-l-yellow-400"
                                      : ""
                                  }
                                  hover:bg-blue-50/50 transition-colors
                                `}
                              >
                                <TableCell className="py-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-semibold text-gray-900">{osc.nome}</span>
                                        {osc.favorita && (
                                          <div className="flex items-center space-x-1">
                                            <Crown className="w-4 h-4 text-yellow-500" />
                                            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold shadow-sm">
                                              Favorita
                                            </Badge>
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500">{osc.email}</p>
                                    </div>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {formatCNPJ(osc.cnpj)}
                                  </span>
                                </TableCell>

                                <TableCell>
                                  <span className="text-sm text-gray-700 font-medium">{osc.responsavel}</span>
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {osc.cidade}, {osc.uf}
                                    </span>
                                  </div>
                                </TableCell>

                                <TableCell className="text-center">
                                  <Badge
                                    className={`${getPartnershipStatusColor(osc.statusParceria)} font-semibold`}
                                    variant="outline"
                                  >
                                    {osc.statusParceria}
                                  </Badge>
                                </TableCell>

                                <TableCell className="text-center">
                                  <div className="flex justify-center">
                                    <Switch
                                      checked={osc.statusParceria === "Ativa"}
                                      onCheckedChange={(e) => {
                                        e.stopPropagation()
                                        onTogglePartnershipStatus(store.id, osc.id)
                                      }}
                                      className="data-[state=checked]:bg-green-500"
                                    />
                                  </div>
                                </TableCell>

                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 hover:bg-yellow-100"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onToggleFavorite(store.id, osc.id)
                                    }}
                                    title={osc.favorita ? "Remover dos favoritos" : "Marcar como favorita"}
                                  >
                                    {osc.favorita ? (
                                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    ) : (
                                      <Star className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                                    )}
                                  </Button>
                                </TableCell>

                                <TableCell className="text-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onRemoveOSC(store.id, osc.id)
                                    }}
                                    title="Remover parceria"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {/* Summary Footer */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-gray-700 font-medium">
                                <strong>{oscCount}</strong> parceria{oscCount !== 1 ? "s" : ""} •
                                <strong className="text-green-600 ml-1">{activeOSCs}</strong> ativa
                                {activeOSCs !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {store.oscsAssociadas.find((osc: any) => osc.favorita) && (
                              <div className="flex items-center space-x-2">
                                <Crown className="w-4 h-4 text-yellow-500" />
                                <span className="text-gray-700 font-medium">
                                  OSC Favorita:{" "}
                                  <strong>{store.oscsAssociadas.find((osc: any) => osc.favorita)?.nome}</strong>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
