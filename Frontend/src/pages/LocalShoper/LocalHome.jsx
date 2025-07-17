
import Header from '@/components/LocalShoper/Sidebar'
import RightSider from '@/components/LocalShoper/RightSider'
import React, { useEffect } from 'react'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import Hero from '@/components/LocalShoper/Hero'

const Local_shop_Home = ({children,  isAuthenticated ,user}) => {
  useEffect(() => {
    console.log("Local_shop_Home component mounted");
  }, []);

  return (
   <div className=" relative overflow-hidden">
     <SidebarProvider>
      <div className="flex-none">
        <Header  isAuthenticated={isAuthenticated} user={user}/>
      </div>
          <SidebarTrigger className='bg-[var(--two3m)] cursor-pointer rounded-2xl'/>
      <div className="flex-1 sm:p-6 p-1">
        <div className="mb-4 ">
          <h1 className="text-2xl font-bold text-green-600">Local Shop Home Page</h1>
          <p className="text-gray-600">Welcome to your local shop dashboard!</p>
        </div>
        <Hero/>
      </div>
    </SidebarProvider>
    <div className='bg-green-400 w-[550px] h-[550px]  shadow-2xl rounded-full absolute z-[-10] top-[-100px] right-[-100px]'></div>

   </div>
  )
}
export default Local_shop_Home