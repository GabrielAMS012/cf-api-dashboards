"use client"

import { useState, useEffect } from "react"
import type { OSC } from "@/lib/types/parcerias"

// Mock OSCs for search
const mockOSCs: OSC[] = [
  {
    id: 5,
    name: "ONG Nutrir Comunidade",
    cnpj: "77.888.999/0001-33",
    email: "nutrir@comunidade.org",
    responsable_name: "Fernanda Rodrigues",
    city: "Curitiba",
    state: "PR",
    is_active: true,
    is_favorite: false,
    partnership_active: false,
  },
  {
    id: 6,
    name: "Instituto Vida Verde",
    cnpj: "22.333.444/0001-55",
    email: "contato@vidaverde.org",
    responsable_name: "Roberto Santos",
    city: "Brasília",
    state: "DF",
    is_active: true,
    is_favorite: false,
    partnership_active: false,
  },
  {
    id: 7,
    name: "Associação Mãos Solidárias",
    cnpj: "66.777.888/0001-99",
    email: "maos@solidarias.org",
    responsable_name: "Lucia Fernandes",
    city: "Recife",
    state: "PE",
    is_active: false,
    is_favorite: false,
    partnership_active: false,
  },
  {
    id: 8,
    name: "Centro Social Esperança",
    cnpj: "88.999.000/0001-11",
    email: "esperanca@social.org",
    responsable_name: "Pedro Henrique",
    city: "Salvador",
    state: "BA",
    is_active: true,
    is_favorite: false,
    partnership_active: false,
  },
  {
    id: 9,
    name: "Fundação Amor ao Próximo",
    cnpj: "99.000.111/0001-22",
    email: "amor@proximo.org",
    responsable_name: "Sandra Oliveira",
    city: "Fortaleza",
    state: "CE",
    is_active: true,
    is_favorite: false,
    partnership_active: false,
  },
]

export function useOSCs(query: string) {
  const [oscs, setOSCs] = useState<OSC[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    // Simulate API search with delay
    const timeoutId = setTimeout(
      () => {
        if (!query.trim()) {
          setOSCs(mockOSCs)
        } else {
          const filtered = mockOSCs.filter(
            (osc) =>
              osc.name.toLowerCase().includes(query.toLowerCase()) ||
              osc.cnpj.includes(query) ||
              osc.responsable_name.toLowerCase().includes(query.toLowerCase()) ||
              osc.city.toLowerCase().includes(query.toLowerCase()) ||
              osc.email.toLowerCase().includes(query.toLowerCase()),
          )
          setOSCs(filtered)
        }
        setLoading(false)
      },
      query ? 500 : 100,
    )

    return () => clearTimeout(timeoutId)
  }, [query])

  return { oscs, loading }
}
