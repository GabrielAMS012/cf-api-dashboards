// Middleware para autenticação nas requisições
export function withAuth<T extends (...args: any[]) => any>(fn: T): T {
  return (async (...args: any[]) => {
    // Verificar se o usuário está autenticado
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }
    }

    return fn(...args)
  }) as T
}

export function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {}

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  return headers
}
