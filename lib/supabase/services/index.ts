// Mock services for demonstration
export const lojasService = {
  getAll: async () => ({ data: [], error: null }),
  getById: async (id: string) => ({ data: null, error: null }),
  create: async (data: any) => ({ data: null, error: null }),
  update: async (id: string, data: any) => ({ data: null, error: null }),
  delete: async (id: string) => ({ data: null, error: null }),
}

export const oscsService = {
  getAll: async () => ({ data: [], error: null }),
  getById: async (id: string) => ({ data: null, error: null }),
  create: async (data: any) => ({ data: null, error: null }),
  update: async (id: string, data: any) => ({ data: null, error: null }),
  delete: async (id: string) => ({ data: null, error: null }),
}

export const parceriasService = {
  getAll: async () => ({ data: [], error: null }),
  getById: async (id: string) => ({ data: null, error: null }),
  create: async (data: any) => ({ data: null, error: null }),
  update: async (id: string, data: any) => ({ data: null, error: null }),
  delete: async (id: string) => ({ data: null, error: null }),
}

export const campanhasService = {
  getAll: async () => ({ data: [], error: null }),
  getById: async (id: string) => ({ data: null, error: null }),
  create: async (data: any) => ({ data: null, error: null }),
  update: async (id: string, data: any) => ({ data: null, error: null }),
  delete: async (id: string) => ({ data: null, error: null }),
}

export const parceriasCampanhasService = {
  getAll: async () => ({ data: [], error: null }),
  getById: async (id: string) => ({ data: null, error: null }),
  create: async (data: any) => ({ data: null, error: null }),
  update: async (id: string, data: any) => ({ data: null, error: null }),
  delete: async (id: string) => ({ data: null, error: null }),
  exists: async (parceriaId: string, campanhaId: string) => ({ data: false, error: null }),
  getStats: async () => ({ data: { total: 0, active: 0, inactive: 0 }, error: null }),
}
