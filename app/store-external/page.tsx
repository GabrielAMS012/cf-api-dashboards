"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { LoginPage } from "@/components/auth/login-page"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

function StoreExternalContent() {
  return (
    <div className="flex-1 md:ml-64">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lojas Externas</h1>
          <p className="text-gray-600 mt-2">Gerenciamento de lojas externas ao sistema</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Em Desenvolvimento
            </CardTitle>
            <CardDescription>Esta funcionalidade está sendo desenvolvida e estará disponível em breve.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A página de gerenciamento de lojas externas permitirá visualizar e gerenciar estabelecimentos parceiros
              que não fazem parte da rede principal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function StoreExternalPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#f26b26] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <StoreExternalContent />
    </div>
  )
}
