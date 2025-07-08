"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, Heart, Trash2, Users, Handshake, Store, MapPin } from "lucide-react"

interface PartnershipStoreCardProps {
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

export function PartnershipStoreCard({
  store,
  onAddOSCs,
  onRemoveOSC,
  onToggleFavorite,
  onTogglePartnershipStatus,
}: PartnershipStoreCardProps) {
  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return "N/A"
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  const activePartnerships = store.oscsAssociadas.filter((osc: any) => osc.statusParceria === "Ativa").length

  const getPartnershipStatusColor = (status: string) => {
    return status === "Ativa" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Store Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-[#E8772E] text-white rounded-lg">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{store.nome}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="font-mono">Código: {store.codigo}</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {store.uf} - {store.cidade}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                <Handshake className="w-4 h-4" />
                <span>Parcerias:</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {activePartnerships} Ativas
                </Badge>
                <Badge variant="outline" className="text-[#E8772E] border-[#E8772E]">
                  {store.oscsAssociadas.length} Total
                </Badge>
              </div>
            </div>
            <Button onClick={onAddOSCs} size="sm" className="bg-[#E8772E] hover:bg-[#d16b26]">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar OSCs
            </Button>
          </div>
        </div>
      </div>

      {/* OSCs Table */}
      {store.oscsAssociadas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Nenhuma parceria estabelecida</p>
          <p className="text-sm">Clique em "Adicionar OSCs" para criar parcerias</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
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
              {store.oscsAssociadas.map((osc: any, index) => (
                <TableRow
                  key={osc.id}
                  className={`
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                    ${osc.favorita ? "bg-yellow-50" : ""}
                    hover:bg-blue-50 transition-colors
                  `}
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{osc.nome}</span>
                      {osc.favorita && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Favorita</Badge>}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-sm text-gray-600">{formatCNPJ(osc.cnpj)}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-gray-600">{osc.responsavel}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {osc.uf} - {osc.cidade}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge className={getPartnershipStatusColor(osc.statusParceria)} variant="secondary">
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
                      className="h-8 w-8"
                      onClick={() => onToggleFavorite(osc.id)}
                      title={osc.favorita ? "Remover dos favoritos" : "Marcar como favorita"}
                    >
                      <Heart
                        className={`w-4 h-4 ${osc.favorita ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                      />
                    </Button>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
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
        <div className="bg-gray-50 px-6 py-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              Total: {store.oscsAssociadas.length} parceria{store.oscsAssociadas.length !== 1 ? "s" : ""} •{" "}
              {activePartnerships} ativa{activePartnerships !== 1 ? "s" : ""}
            </span>
            {store.oscsAssociadas.find((osc: any) => osc.favorita) && (
              <span className="text-gray-700">
                Favorita:{" "}
                <span className="font-medium">{store.oscsAssociadas.find((osc: any) => osc.favorita)?.nome}</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
