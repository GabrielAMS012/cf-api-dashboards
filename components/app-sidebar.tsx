"use client"
import { useAuth } from "@/lib/hooks/use-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Store, Users, Heart, Megaphone, BarChart3, Settings, LogOut, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Lojas",
    url: "/lojas",
    icon: Store,
  },
  {
    title: "Lojas Externas",
    url: "/store-external",
    icon: Building2,
  },
  {
    title: "OSCs",
    url: "/oscs",
    icon: Users,
  },
  {
    title: "Parcerias",
    url: "/parcerias",
    icon: Heart,
  },
  {
    title: "Campanhas",
    url: "/campanhas",
    icon: Megaphone,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <SidebarProvider>
        <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">Connecting Food</span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
            </div>
        </SidebarHeader>

        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
            <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-orange-100 text-orange-600">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.username || "Usuário"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@connectingfood.com"}</p>
                </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="w-full bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
            </Button>
            </div>
        </SidebarFooter>
        </Sidebar>
    </SidebarProvider>
  )
}
