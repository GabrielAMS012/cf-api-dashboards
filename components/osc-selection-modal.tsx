"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Search, Building, User, Mail, MapPin, AlertCircle } from "lucide-react"

interface OSCSelectionModalProps {
  isOpen: boolean
  store: any
  oscs: any[]
  onClose: () => void
  onConfirm: (selectedOSCs: any[]) => void
}

export function OSCSelectionModal({ isOpen, store, oscs, onClose, onConfirm }: OSCSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOSCs, setFilteredOSCs] = useState(oscs)
  const [selectedOSCs, setSelectedOSCs] = useState<any[]>([])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setFilteredOSCs(oscs)
      } else {
        const searchLower = searchTerm.toLowerCase()
        const searchNumbers = searchTerm.replace(/\D/g, "")

        const filtered = oscs.filter((osc) => {
          // Busca por nome (parcial)
          const nameMatch = osc.nome.toLowerCase().includes(searchLower)

          // Busca por CNPJ (apenas números)
          const cnpjNumbers = osc.cnpj.replace(/\D/g, "")
          const cnpjMatch = searchNumbers.length >= 3 && cnpjNumbers.includes(searchNumbers)

          // Busca por responsável
          const responsavelMatch = osc.responsavel.toLowerCase().includes(searchLower)

          // Busca por cidade
          const cidadeMatch = osc.cidade.toLowerCase().includes(searchLower)

          return nameMatch || cnpjMatch || responsavelMatch || cidadeMatch
        })

        setFilteredOSCs(filtered)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, oscs])

  useEffect(() => {
    if (isOpen) {
      setSelectedOSCs([])
      setSearchTerm("")
    }
  }, [isOpen])

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  const isOSCAlreadyAssociated = (oscId: number) => {
    return store?.oscsAssociadas?.some((associated: any) => associated.id === oscId) || false
  }

  const handleOSCToggle = (osc: any, checked: boolean) => {
    if (checked) {
      setSelectedOSCs([...selectedOSCs, osc])
    } else {
      setSelectedOSCs(selectedOSCs.filter((selected) => selected.id !== osc.id))
    }
  }

  const handleConfirm = () => {
    // Filtrar apenas OSCs que não estão já associadas
    const newOSCs = selectedOSCs.filter((osc) => !isOSCAlreadyAssociated(osc.id))
    onConfirm(newOSCs)
    handleClose()
  }

  const handleClose = () => {
    setSearchTerm("")
    setSelectedOSCs([])
    onClose()
  }

  const isOSCSelected = (oscId: number) => {
    return selectedOSCs.some((selected) => selected.id === oscId)
  }

  const availableOSCsCount = selectedOSCs.filter((osc) => !isOSCAlreadyAssociated(osc.id)).length

  if (!store) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[75vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Adicionar OSCs à Loja</DialogTitle>
          <DialogDescription>
            Loja: {store.nome} (Código: {store.codigo}) - {store.cidade}, {store.uf}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Search Input */}
          <div className="flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, CNPJ, responsável ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Selected Count */}
          {selectedOSCs.length > 0 && (
            <div className="flex-shrink-0 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  {selectedOSCs.length} OSC{selectedOSCs.length !== 1 ? "s" : ""} selecionada
                  {selectedOSCs.length !== 1 ? "s" : ""}
                </span>
                {availableOSCsCount !== selectedOSCs.length && (
                  <span className="text-blue-600 text-sm">
                    ({availableOSCsCount} nova{availableOSCsCount !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Results - Scrollable Area */}
          <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
            {filteredOSCs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm.trim() === "" ? (
                  <>
                    <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-600">OSCs Disponíveis</p>
                    <p className="text-sm">Digite no campo de busca para encontrar OSCs</p>
                  </>
                ) : (
                  <div className="max-w-md mx-auto">
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-600 mb-2">Nenhuma OSC encontrada</p>
                    <div className="text-sm text-gray-500 space-y-2">
                      <p>Não foi possível encontrar OSCs com:</p>
                      <div className="bg-gray-100 rounded-lg p-3 text-left">
                        <p>
                          <span className="font-medium">Termo buscado:</span> "{searchTerm}"
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 mt-4 space-y-1">
                        <p>
                          <strong>Dicas de busca:</strong>
                        </p>
                        <p>• Digite o nome da OSC (ex: "Instituto", "Fundação")</p>
                        <p>• Digite o CNPJ completo ou parcial (ex: "12345")</p>
                        <p>• Digite o nome do responsável</p>
                        <p>• Digite a cidade da OSC</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Contador de resultados */}
                {searchTerm.trim() !== "" && (
                  <div className="flex-shrink-0 px-1 py-2 text-sm text-gray-600 border-b border-gray-100">
                    <span className="font-medium">
                      {filteredOSCs.length} OSC{filteredOSCs.length !== 1 ? "s" : ""} encontrada
                      {filteredOSCs.length !== 1 ? "s" : ""}
                    </span>
                    {searchTerm && <span className="text-gray-500"> para "{searchTerm}"</span>}
                  </div>
                )}

                <div className="divide-y divide-gray-100">
                  {filteredOSCs.map((osc) => {
                    const isSelected = isOSCSelected(osc.id)
                    const isAlreadyAssociated = isOSCAlreadyAssociated(osc.id)

                    return (
                      <div
                        key={osc.id}
                        className={`py-4 transition-colors ${
                          isSelected ? "bg-blue-50" : isAlreadyAssociated ? "bg-gray-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleOSCToggle(osc, checked as boolean)}
                            className="mt-1"
                            disabled={isAlreadyAssociated}
                          />

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Building className="w-4 h-4 text-[#E8772E]" />
                                  <h4 className="font-semibold text-gray-900">{osc.nome}</h4>
                                  {isAlreadyAssociated && (
                                    <div className="flex items-center space-x-1">
                                      <AlertCircle className="w-4 h-4 text-amber-500" />
                                      <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
                                        Já associada a esta loja
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 font-mono mb-2">{formatCNPJ(osc.cnpj)}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <User className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-600">{osc.responsavel}</span>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-600">{osc.email}</span>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    <span className="text-gray-600">
                                      {osc.cidade}, {osc.uf}
                                    </span>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-green-100 text-green-800" variant="secondary">
                                      {osc.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#E8772E] hover:bg-[#d16b26]"
            disabled={availableOSCsCount === 0}
          >
            Adicionar OSC{availableOSCsCount !== 1 ? "s" : ""} Selecionada{availableOSCsCount !== 1 ? "s" : ""} (
            {availableOSCsCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
