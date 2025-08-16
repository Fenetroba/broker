import React from 'react'
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
     SidebarTrigger,
   
   } from "@/components/ui/sidebar";
import UserList from '@/components/LocalShoper/UserList';
import { SpaceIcon } from 'lucide-react';
import MainChat from '@/components/LocalShoper/MainChat';
import RightSide_FullInfo from '@/components/LocalShoper/RightSide_FullInfo';
const Inbox = () => {
  return (
    <div className=' relative overflow-hidden'>


     <SidebarProvider className='reletive'>
    <Sidebar >
    <SidebarTrigger className='absolute top-1 left-65 z-10' />
      <SidebarContent className='bg-[var(--two2m)] '>
        <SidebarGroup>
          <SidebarGroupLabel className='font-bold text-2xl mb-3.5 text-[var(--two5m)]'>My Custemers</SidebarGroupLabel>
          <SidebarGroupContent >
            <SidebarMenu >
             
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className='hover:bg-[var(--two5m)] flex  text-[var(--two5m)]'>
                 
                 <UserList/>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
          
    </Sidebar>
    <div className=" bg-[var(--two5m)] flex-1 sm:p-6 p-1">
      <div className='shadow-lg  h-[90dvh] backdrop-blur-[20px]  reletive'>
<p className='absolute right-4'> <SpaceIcon/></p>
      
      <MainChat/>
      </div>
    </div>
    <RightSide_FullInfo/>
    </SidebarProvider>
  
    </div>
  )
}

export default Inbox 
