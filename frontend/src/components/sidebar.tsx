"use client";

import { useState } from "react";
import {
  Home,
  Calendar,
  Search,
  Settings,
  FileText,
  UserRoundPen,
  Edit,
  ClipboardList,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// Menü-Items mit Untermenüs
const items = [
  {
    title: "Angebote",
    icon: ClipboardList,
    submenu: [
      { title: "Alle Angebote", url: "/angebote", icon: FileText },
      { title: "Angebote bearbeiten", url: "/angebote/bearbeiten", icon: Edit },
    ],
  },
  {
    title: "Kunden",
    icon: Users,
    submenu: [
      { title: "Alle Kunden", url: "/kunden", icon: UserRoundPen },
      { title: "Kunde bearbeiten", url: "/kunden/bearbeiten", icon: Edit },
    ],
  },
];

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" className={open ? "w-64" : "w-16"}>
      <SidebarContent>
        <SidebarGroup>
          {/* Sidebar-Toggle Button */}
          <div className="flex items-center justify-between p-2">
            <SidebarTrigger onClick={toggleSidebar} />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <Accordion type="multiple" className="w-full">
                {items.map((item) =>
                  item.submenu ? (
                    <AccordionItem key={item.title} value={item.title}>
                      <AccordionTrigger className="flex items-center space-x-2 p-2">
                        <item.icon className="size-5" />
                        {open && <span>{item.title}</span>}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2 pl-6">
                          {item.submenu.map((sub) => (
                            <SidebarMenuItem key={sub.title}>
                              <SidebarMenuButton asChild>
                                <a
                                  href={sub.url}
                                  className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-200 rounded"
                                >
                                  <sub.icon className="size-4" />
                                  <span>{sub.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center space-x-2 p-2">
                          <item.icon className="size-5" />
                          {open && <span>{item.title}</span>}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
