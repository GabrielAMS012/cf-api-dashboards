"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Users, Store, MapPin, Star, Crown } from "lucide-react"

interface PartnershipPanelCardProps {
  store: {
    id: number
    codigo: string
    nome: string
    cidade: string
    uf: string
    oscsAssociadas: any[]
  }
  onAddOSCs: () => void
  onRemoveOSC: (oscId: number) => void
  onToggleFavorite: (oscId: number) => void
  onTogglePartnershipStatus: (oscId: number) => void
}

export function PartnershipPanelCard({
  store,
  onAddOSCs,
  onRemoveOSC,
  onToggleFavorite,
  onTogglePartnershipStatus,
}: PartnershipPanelCardProps) {
  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return "N/A"
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  const activePartnerships = store.oscsAssociadas.filter((osc: any) => osc.statusParceria === "Ativa").length
  const totalPartnerships = store.oscsAssociadas.length

  const getPartnershipStatusColor = (status: string) => {
    return status === "Ativa"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Store Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#E8772E] to-[#d16b26] text-white rounded-xl shadow-sm">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="text-xl font-bold text-gray-900">{store.nome}</h3>
                <Badge variant="outline" className="font-mono text-xs bg-white">
                  {store.codigo}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {store.cidade}, {store.uf}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Partnership Stats */}
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-semibold">
                  {activePartnerships} Ativas
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                  {totalPartnerships} Total
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Parcerias</p>
            </div>

            {/* Add OSCs Button */}
            <Button
              onClick={onAddOSCs}
              className="bg-gradient-to-r from-[#E8772E] to-[#d16b26] hover:from-[#d16b26] hover:to-[#c55d1f] text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar OSCs
            </Button>
          </div>
        </div>
      </div>

      {/* OSCs Content */}
      {store.oscsAssociadas.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">Nenhuma parceria estabelecida</h4>
          <p className="text-gray-500 mb-6">Esta loja ainda não possui OSCs vinculadas</p>
          <Button
            onClick={onAddOSCs}
            variant="outline"
            className="border-[#E8772E] text-[#E8772E] hover:bg-[#E8772E] hover:text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar primeira OSC
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="font-semibold text-gray-700 py-4">OSC</TableHead>
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
              {store.oscsAssociadas.map((osc: any, index) => (
                <TableRow
                  key={osc.id}
                  className={`
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    ${osc.favorita ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-l-yellow-400" : ""}
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
                        onCheckedChange={() => onTogglePartnershipStatus(osc.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-yellow-100"
                      onClick={() => onToggleFavorite(osc.id)}
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
                      onClick={() => onRemoveOSC(osc.id)}
                      title="Remover parceria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Summary Footer */}
      {store.oscsAssociadas.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                <strong>{totalPartnerships}</strong> parceria{totalPartnerships !== 1 ? "s" : ""} •
                <strong className="text-green-600 ml-1">{activePartnerships}</strong> ativa
                {activePartnerships !== 1 ? "s" : ""}
              </span>
            </div>
            {store.oscsAssociadas.find((osc: any) => osc.favorita) && (
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700 font-medium">
                  OSC Favorita: <strong>{store.oscsAssociadas.find((osc: any) => osc.favorita)?.nome}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
