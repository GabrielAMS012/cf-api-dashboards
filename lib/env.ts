// Configurações de ambiente
export const env = {
  // API Base URLs
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://hml-arrecadacaoback-ckf3cncbehb2cacd.brazilsouth-01.azurewebsites.net/api",

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",

  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_DEBUG: process.env.NODE_ENV === "development",

  // Server-only environment variables
  API_TOKEN: process.env.API_TOKEN || "",
} as const

// Validação de variáveis obrigatórias
const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET"] as const

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

// Server-only environment variables
export const serverEnv = {
  // Maps API should only be used server-side
  MAPS_API_KEY: process.env.MAPS_API_KEY || "",
} as const
