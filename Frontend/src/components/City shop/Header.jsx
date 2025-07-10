import React from "react";
import { Calendar, Coins, Home, Inbox, ListOrdered, Search, Settings } from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/local_shop/home",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "My Products",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Orders",
    url: "#",
    icon: ListOrdered,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Earnings",
    url: "#",
    icon: Coins,
  },
];
const Header = () => {
  return (

      
      <Sidebar >
        <SidebarContent className='bg-[var(--two5m)] '>
          <SidebarGroup>
            <SidebarGroupLabel className='font-bold text-2xl mb-3.5 text-[var(--two2m)]'>CITY SHOP</SidebarGroupLabel>
            <SidebarGroupContent >
              <SidebarMenu >
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className='hover:bg-[var(--two4m)]'>
                      <a href={item.url} >
                        <item.icon  /> 
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

  );
};

export default Header;
