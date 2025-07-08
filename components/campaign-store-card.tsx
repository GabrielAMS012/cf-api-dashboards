"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Store, MapPin, Plus, ChevronDown, ChevronRight, Heart, Trash2, Users } from "lucide-react"

interface CampaignStoreCardProps {
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
}

export function CampaignStoreCard({ store, onAddOSCs, onRemoveOSC, onToggleFavorite }: CampaignStoreCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  const favoritaOSC = store.oscsAssociadas.find((osc: any) => osc.favorita)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-[#E8772E] text-white rounded-lg">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{store.nome}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-mono">Código: {store.codigo}</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {store.cidade}, {store.uf}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>OSCs:</span>
                  </div>
                  <Badge variant="outline" className="text-[#E8772E] border-[#E8772E]">
                    {store.oscsAssociadas.length}
                  </Badge>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="border-t pt-4">
              {/* Add OSCs Button */}
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">OSCs Associadas</h4>
                <Button onClick={onAddOSCs} size="sm" className="bg-[#E8772E] hover:bg-[#d16b26]">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar OSCs
                </Button>
              </div>

              {/* OSCs List */}
              {store.oscsAssociadas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma OSC associada</p>
                  <p className="text-sm">Clique em "Adicionar OSCs" para começar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {store.oscsAssociadas.map((osc: any) => (
                    <div
                      key={osc.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        osc.favorita ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-medium text-gray-900">{osc.nome}</h5>
                            {osc.favorita && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Favorita</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 font-mono mb-2">{formatCNPJ(osc.cnpj)}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{osc.responsavel}</span>
                            <span>
                              {osc.cidade}, {osc.uf}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onToggleFavorite(osc.id)}
                            title={osc.favorita ? "Remover dos favoritos" : "Marcar como favorita"}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                osc.favorita ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onRemoveOSC(osc.id)}
                            title="Remover OSC"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              {store.oscsAssociadas.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-800">
                      Total: {store.oscsAssociadas.length} OSC{store.oscsAssociadas.length !== 1 ? "s" : ""}
                    </span>
                    {favoritaOSC && (
                      <span className="text-blue-800">
                        Favorita: <span className="font-medium">{favoritaOSC.nome}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
