"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toaster } from "@/components/ui/sonner"
import { Building2, Users, Handshake, Megaphone, Store, ExternalLink, Database, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"

const navigation = [
  {
    name: "Lojas",
    href: "/lojas",
    icon: Store,
  },
  {
    name: "Lojas Externas",
    href: "/store-external",
    icon: ExternalLink,
  },
  {
    name: "Dados CF",
    icon: Database,
    isDropdown: true,
    children: [
      { name: "Regionais", href: "/regionais" },
      { name: "OSCs", href: "/oscs-new" },
      { name: "Parcerias", href: "/parcerias-new" },
      { name: "Campanhas", href: "/campanhas-new" },
      { name: "Contatos", href: "/contatos" },
    ],
  },
  {
    name: "OSCs - Versão Antiga",
    href: "/oscs",
    icon: Users,
  },
  {
    name: "Parcerias - Versão Antiga",
    href: "/parcerias",
    icon: Handshake,
  },
  {
    name: "Parcerias & Campanhas",
    href: "/parcerias-campanhas",
    icon: Building2,
  },
  {
    name: "Campanhas - Versão Antiga",
    href: "/campanhas",
    icon: Megaphone,
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b px-6">
        <h1 className="text-xl font-bold text-[#E8772E]">Connecting Food Admin</h1>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            if (item.isDropdown) {
              return (
                <Collapsible key={item.name}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-6 space-y-1">
                    {item.children?.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive(child.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
      <Toaster />
    </SidebarProvider>
  )
}
