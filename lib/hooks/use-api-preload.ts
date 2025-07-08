"use client"

import { useState, useEffect, useCallback } from "react"
import { AuthService } from "@/lib/api/auth"

interface UseApiPreloadOptions {
  cacheTime?: number // em minutos
  enabled?: boolean
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<any>>()

export function useApiPreload<T>(key: string, fetcher: () => Promise<T>, options: UseApiPreloadOptions = {}) {
  const { cacheTime = 10, enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      if (!enabled) return

      // Verificar cache primeiro
      const cached = cache.get(key)
      const now = Date.now()
      const cacheExpiry = cacheTime * 60 * 1000 // converter para ms

      if (cached && !forceRefresh && now - cached.timestamp < cacheExpiry) {
        setData(cached.data)
        setIsFromCache(true)
        return cached.data
      }

      try {
        setIsLoading(true)
        setError(null)
        setIsFromCache(false)

        const result = await fetcher()

        // Salvar no cache
        cache.set(key, {
          data: result,
          timestamp: now,
        })

        setData(result)
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar dados"
        setError(errorMessage)
        console.error(`Erro ao carregar ${key}:`, err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [key, fetcher, cacheTime, enabled],
  )

  const refresh = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    cache.delete(key)
  }, [key])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    isFromCache,
    refresh,
    clearCache,
  }
}

// Hook para fazer requisições autenticadas
export function useAuthenticatedFetch() {
  const authService = AuthService.getInstance()

  const makeRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    try {
      const token = await authService.getToken()

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error("Erro na requisição autenticada:", error)
      throw error
    }
  }, [])

  return { makeRequest }
}
