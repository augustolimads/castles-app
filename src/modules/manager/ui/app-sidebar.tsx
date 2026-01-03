'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HardHat, ShoppingBasket, User2Icon } from "lucide-react"
import { usePathname } from "next/navigation"
// Menu items.
const items = [
    {
        title: "Gerador de personagem",
        url: "/",
        icon: User2Icon,
    },
    {
        title: "Gerador de NPC",
        url: "/em-breve",
        icon: HardHat,
        color: "text-gray-400"
    },
    {
        title: "Gerador de Tesouro",
        url: "/em-breve",
        icon: HardHat,
        color: "text-gray-400"
    },
    {
        title: "Mercado",
        url: "/mercado",
        icon: ShoppingBasket,
        color: "text-gray-400"
    },
    {
        title: "Compendium",
        url: "/em-breve",
        icon: HardHat,
        color: "text-gray-400"
    },
    {
        title: "War machine",
        url: "/em-breve",
        icon: HardHat,
        color: "text-gray-400"
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="py-2">
                    <h2 className="text-lg font-black text-center">Castles & Crusades App</h2>
                    <p className="text-gray-500 text-xs text-center">Não-oficial</p>
                </div>
            </SidebarHeader>
            <hr />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <a href={item.url} className={item.color}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {/* <SidebarFooter /> */}
        </Sidebar>
    )
}