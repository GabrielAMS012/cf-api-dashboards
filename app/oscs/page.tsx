"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { LoginPage } from "@/components/auth/login-page"
import { AppSidebar } from "@/components/app-sidebar"
import { OSCsTable } from "@/components/oscs/oscs-table"

export default function OSCsPage() {
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
        <div className="flex-1 md:ml-64">
            <div className="p-6">
            <OSCsTable />
            </div>
        </div>
        </div>
  )
}
