import React from "react";
import { Building2, Calendar, Coins, Home, Inbox, ListOrdered, Search, Settings, TowerControl, User } from "lucide-react";

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
import { FaCity } from "react-icons/fa";
import { Link } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },

  {
    title: "Products",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Users",
    url: "/admin/userList",
    icon: User,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },

];
const Header = () => {
  return (

      
    <Sidebar >
    <SidebarContent className='bg-[var(--two2m)] '>
      <SidebarGroup>
        <SidebarGroupLabel className='font-bold text-3xl mb-3.5 text-[var(--two5m)]'>ADMIN<TowerControl  className="ml-2 text-green-100"/></SidebarGroupLabel>
        <SidebarGroupContent >
          <SidebarMenu >
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className='hover:bg-[var(--two5m)] flex  text-[var(--two5m)]'>
                  <Link to={item.url} >
                    <item.icon  /> 
                  <span  className="flex ">{item.title}
    {
                          item.title==="Inbox"&& <div>
                             <p className="absolute right-10 bg-green-500 px-1.5 mb-10 rounded-full ">0</p>
                          </div>
                        }

                  </span>
                   
                
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <div className="absolute w-full bottom-0 bg-[var(--two5m)] flex items-center justify-around rounded-t-2xl p-4">
           <div className="w-20 h-20 bg-amber-100 rounded-full"></div>
           <div className="text-[14px]">
            <p><strong>Name</strong> : fenet roba</p>
            <p><strong>Email</strong> :fenetroba700@</p>
           </div>
          </div>
      </SidebarContent>
    </Sidebar>



  );
};

export default Header;
