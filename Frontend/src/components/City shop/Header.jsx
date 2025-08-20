import React from "react";
import { Building2, Calendar, Coins, Home, Inbox, ListOrdered, Search, Settings } from "lucide-react";


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
    url: "/city_shop/home",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/city_shop/inbox",
    icon: Inbox,
  },
  {
    title: "Find Products",
    url: "/city_shop/find-products",
    icon: Calendar,
  },
  {
    title: "My Orders History",
    url: "/city_shop/order/history",
    icon: ListOrdered,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },

];
const Header = ({user}) => {
  const truncateEmail = (email) => {
    if (!email) return '';
    return email.length > 10 ? email.substring(0, 10) + '...' : email;
  };
  return (

      
    <Sidebar >
    <SidebarContent className='bg-[var(--two2m)] '>
      <SidebarGroup>
        <SidebarGroupLabel className='font-bold text-2xl mb-3.5 text-[var(--two5m)]'>CITY SHOP <Building2  className="ml-2 text-green-100" /></SidebarGroupLabel>
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
      {user?.profilePic ? (
        <img
          className="w-20 h-20 bg-amber-100 rounded-full object-cover"
          src={user.profilePic}
          alt={user?.name || user?.email || 'User'}
        />
      ) : (
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-3xl font-semibold text-gray-700">
          {(user?.name || user?.email || 'U').slice(0,1).toUpperCase()}
        </div>
      )}
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
