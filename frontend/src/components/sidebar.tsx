"use client";

import { useState } from "react";
import { ClipboardList, Users, UserCog, ChevronDown, ChevronRight, UserRoundPen } from "lucide-react";
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

// Menü-Items mit Untermenüs
const items = [
  {
    title: "Angebote",
    icon: ClipboardList,
    submenu: [
      { title: "Alle Angebote", url: "/angebote", icon: ClipboardList },
      { title: "Angebot bearbeiten", url: "/angebote/neu", icon: UserCog },
    ],
  },
  {
    title: "Kunden",
    icon: Users,
    submenu: [
      { title: "Alle Kunden", url: "/kunden", icon: UserCog },
      { title: "Kunde bearbeiten", url: "/kunde/bearbeiten", icon: UserRoundPen }
    ],
  },
];

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Funktion zum Ein- und Ausklappen eines Menüs
  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <Sidebar collapsible="icon" className={open ? "w-64" : "w-16"}>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between p-2">
            <SidebarTrigger onClick={toggleSidebar} />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <div key={item.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button 
                        className="flex items-center justify-between w-full p-2"
                        onClick={() => toggleDropdown(item.title)}
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon className="size-5" />
                          {open && <span>{item.title}</span>}
                        </div>
                        {open && (
                          openDropdown === item.title ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Submenu sichtbar, wenn Dropdown geöffnet ist */}
                  {openDropdown === item.title && (
                    <div className="ml-6">
                      {item.submenu.map((sub) => (
                        <SidebarMenuItem key={sub.title}>
                          <SidebarMenuButton asChild>
                            <a href={sub.url} className="flex items-center space-x-2 p-2">
                              <sub.icon className="size-4 text-gray-500" />
                              {open && <span>{sub.title}</span>}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
