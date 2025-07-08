"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { LoginPage } from "@/components/auth/login-page"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Plus } from "lucide-react"

function RegionaisContent() {
  return (
    <div className="flex-1 md:ml-64">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Regionais</h1>
            <p className="text-gray-600 mt-2">Gestão de regionais e territórios</p>
          </div>
          <Button className="bg-[#f26b26] hover:bg-[#e55a1f]">
            <Plus className="mr-2 h-4 w-4" />
            Nova Regional
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Regionais</CardTitle>
            <CardDescription>Sistema de gestão de regionais em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistema em Desenvolvimento</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                A funcionalidade de gestão de regionais está sendo desenvolvida.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RegionaisPage() {
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
      <RegionaisContent />
    </div>
  )
}
