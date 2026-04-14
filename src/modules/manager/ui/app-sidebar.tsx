'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { items } from "../items"
import { Config } from "@/modules/config/ui"

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
                                        <a href={item.url} aria-disabled={item.isBlocked} target={item.url.startsWith("http") ? "_blank" : "_self"}>
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
            <SidebarFooter>
                <Config.ThemeSelector />
            </SidebarFooter>
        </Sidebar>
    )
}