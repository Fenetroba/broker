import React from "react";
import { Calendar, Coins, Home, HousePlus, Inbox, ListOrdered, MessageCircle, Search, Settings } from "lucide-react";
import { Link } from "react-router-dom";

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
    url: "/",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/local_shop/inbox",
    icon: Inbox,
  },
  {
    title: "My Products",
    url: "/local_shop/my_product",
    icon: Calendar,
  },
  {
    title: "Orders",
    url: "/local_shop/orders",
    icon: ListOrdered,
  },
  {
    title: "Settings",
    url: "/local_shop/setting",
    icon: Settings,
  },
  {
    title: "Earnings",
    url: "/local_shop/earning",
    icon: Coins,
  },

];
const Header = ({isAuthenticated ,user}) => {
  // Function to truncate email to 10 characters
  const truncateEmail = (email) => {
    if (!email) return '';
    return email.length > 10 ? email.substring(0, 10) + '...' : email;
  };

  return (
    <Sidebar >
      <SidebarContent className='bg-[var(--two2m)] '>
        <SidebarGroup>
          <SidebarGroupLabel className='font-bold text-2xl mb-3.5 text-[var(--two5m)]'>LOCAL SHOP <HousePlus  className="ml-2 text-green-100" /></SidebarGroupLabel>
          <SidebarGroupContent >
            <SidebarMenu >
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className='hover:bg-[var(--two5m)] flex  text-[var(--two5m)]'>
                    <Link to={item.url} >
                      <item.icon  /> 
                      <span className="flex ">{item.title} {
                        item.title==="Inbox"&& <div>
                           <p className="absolute right-10 bg-green-500 px-1.5 mb-10 rounded-full ">0</p>
                        </div>
                      } </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="absolute w-full bottom-0 bg-[var(--two5m)] flex items-center justify-around rounded-t-2xl p-4">
      
         
         <img className="w-20 h-20 bg-amber-100 rounded-full" src={user?.profilePic || ''} alt= {user?.name.charAt(0)}/>
   
         <div className="text-[14px]">
          <p><strong>Name</strong> : {user?.name || 'N/A'}</p>
          <p><strong>Email</strong> : {truncateEmail(user?.email)}</p>
         </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default Header;
