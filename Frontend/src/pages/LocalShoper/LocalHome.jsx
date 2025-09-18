
import Header from '@/components/LocalShoper/Sidebar'
import RightSider from '@/components/LocalShoper/RightSider'
import React, { useEffect } from 'react'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import Hero from '@/components/LocalShoper/Hero'

const Local_shop_Home = ({children,  isAuthenticated ,user}) => {
 

  return (
   <div className=" relative overflow-hidden">
     <SidebarProvider>
      <div className="flex-none">
        <Header  isAuthenticated={isAuthenticated} user={user}/>
      </div>
          <SidebarTrigger className='bg-[var(--two3m)] cursor-pointer rounded-2xl'/>
      <div className="flex-1 sm:p-6 p-1">
      
        <Hero/>
      </div>
    </SidebarProvider>
    <div className='bg-green-400 w-[550px] h-[550px]  shadow-2xl rounded-full absolute z-[-10] top-[-100px] right-[-100px]'></div>

   </div>
  )
}
export default Local_shop_Home