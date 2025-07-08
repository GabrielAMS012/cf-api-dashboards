"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { AppSidebar } from "@/components/app-sidebar"
import { StoresTable } from "@/components/stores/stores-table"
import { LoginPage } from "@/components/auth/login-page"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"


export default function LojasPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="w-64 bg-white shadow-sm">
            <div className="p-4">
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="space-y-2 p-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
          <div className="flex-1 p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
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
          <div className="mb-6 flex flex-row justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Lojas</h1>
                <p className="text-gray-600 mt-2">Gerencie todas as lojas do sistema</p>
            </div>
            <Button className="bg-[#f26b26] hover:bg-[#e55a1f]" onClick={() => {router.push("stores/add")}}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Loja
            </Button>
          </div>
          <StoresTable />
        </div>
      </div>
    </div>
  )
}
