import { AdminLayout } from "@/components/admin-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-[#E8772E] text-white px-6 py-4 rounded-lg shadow-md">
          <Skeleton className="h-8 w-48 bg-orange-200/50" />
          <Skeleton className="h-5 w-80 mt-2 bg-orange-200/50" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-md border">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="rounded-md border bg-white p-4 space-y-2">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
          <div className="flex items-center justify-between px-2 py-2">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
