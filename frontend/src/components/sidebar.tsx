"use client";

import { useUser } from "@/context/UserContext"; // ✅ Import für den UserContext
import { useState } from "react";
import {
  FileText,
  UserRoundPen,
  Edit,
  ClipboardList,
  Users,
  UserCircle,
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// **Liste der verfügbaren Rollen**
const roles = ["Account-Manager", "Developer", "User"];
const rolePasswords: Record<string, string> = {
  "User": "user",
  "Developer": "developer",
  "Account-Manager": "account-manager",
};

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  const { role, setRole, setCredentials } = useUser(); // ✅ UserContext verwenden

  return (
    <Sidebar collapsible="icon" className={`flex flex-col ${open ? "w-64" : "w-16"} h-screen`}>
      <SidebarContent className="flex flex-col flex-1 justify-between">
        <div>
          <SidebarGroup>
            {/* Sidebar-Toggle Button */}
            <div className="flex items-center justify-between p-2">
              <SidebarTrigger onClick={toggleSidebar} />
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                <Accordion type="multiple" className="w-full">
                  {/* Menü für Angebote */}
                  <AccordionItem value="Angebote">
                    <AccordionTrigger className="flex items-center space-x-2 p-2 no-rotate">
                      <ClipboardList className="size-5" />
                      {open && <span>Angebote</span>}
                    </AccordionTrigger>
                    <AccordionContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <a href="/" className="flex items-center space-x-2 p-2">
                            <FileText className="size-4" />
                            <span>Alle Angebote</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <a href="/anlegen" className="flex items-center space-x-2 p-2">
                            <Edit className="size-4" />
                            <span>Angebote anlegen</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Menü für Kunden */}
                  <AccordionItem value="Kunden">
                    <AccordionTrigger className="flex items-center space-x-2 p-2 no-rotate">
                      <Users className="size-5" />
                      {open && <span>Kunden</span>}
                    </AccordionTrigger>
                    <AccordionContent>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <a href="/kunden" className="flex items-center space-x-2 p-2">
                            <UserRoundPen className="size-4" />
                            <span>Alle Kunden</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <a href="/anlegen" className="flex items-center space-x-2 p-2">
                            <Edit className="size-4" />
                            <span>Kunde anlegen</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* 🔹 Fixierte Benutzerrollen-Auswahl am unteren Rand */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">
                <UserCircle className="size-5 mr-2" />
                <span>{role}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {roles.map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setCredentials(r, rolePasswords[r]); // ✅ Benutzername und Passwort setzen
                  }}
                  className={`cursor-pointer p-2 hover:bg-gray-200 ${
                    role === r ? "font-bold text-blue-500" : ""
                  }`}
                >
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
