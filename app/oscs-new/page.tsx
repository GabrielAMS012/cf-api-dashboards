"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { LoginPage } from "@/components/auth/login-page"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

function OSCsNewContent() {
  return (
    <div className="flex-1 md:ml-64">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">OSCs</h1>
            <p className="text-gray-600 mt-2">Nova versão do sistema de OSCs</p>
          </div>
          <Button className="bg-[#f26b26] hover:bg-[#e55a1f]">
            <Plus className="mr-2 h-4 w-4" />
            Nova OSC
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>OSCs - Nova Versão</CardTitle>
            <CardDescription>Sistema de gestão de OSCs em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistema em Desenvolvimento</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                A nova versão do sistema de gestão de OSCs está sendo desenvolvida.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function OSCsNewPage() {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

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
      <OSCsNewContent />
    </div>
  )
}
