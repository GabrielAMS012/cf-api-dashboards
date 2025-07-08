// Exportação centralizada de todos os serviços
export { storesService } from "./stores"
export { regionaisService } from "./regionais"
export { oscsService } from "./oscs"
export { partnershipsService } from "./partnerships"
export { campaignsService } from "./campaigns"

// Re-exportar tipos
export type * from "../types"
export type { ApiResponse, PaginatedResponse } from "../client"
