// Utilitário para tratamento de erros da API
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: any): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error.response) {
    // Erro HTTP
    const status = error.response.status
    const message = error.response.data?.message || error.message || "Erro na API"
    const code = error.response.data?.code
    const details = error.response.data?.details

    return new ApiError(message, status, code, details)
  }

  if (error.request) {
    // Erro de rede
    return new ApiError("Erro de conexão com o servidor", 0, "NETWORK_ERROR")
  }

  // Outros erros
  return new ApiError(error.message || "Erro desconhecido", 0, "UNKNOWN_ERROR")
}

export function getErrorMessage(error: any): string {
  const apiError = handleApiError(error)

  switch (apiError.status) {
    case 400:
      return "Dados inválidos. Verifique as informações enviadas."
    case 401:
      return "Acesso não autorizado. Faça login novamente."
    case 403:
      return "Você não tem permissão para realizar esta ação."
    case 404:
      return "Recurso não encontrado."
    case 409:
      return "Conflito de dados. O recurso já existe."
    case 422:
      return "Dados inválidos. Verifique os campos obrigatórios."
    case 500:
      return "Erro interno do servidor. Tente novamente mais tarde."
    default:
      return apiError.message
  }
}
