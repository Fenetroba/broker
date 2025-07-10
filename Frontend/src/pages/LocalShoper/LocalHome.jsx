import Hero from '@/components/gust/Hero'
import Header from '@/components/LocalShoper/Header'
import RightSider from '@/components/LocalShoper/RightSider'
import React from 'react'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'



const Local_shop_Home = ({children}) => {
  return (
   <div>
     <SidebarProvider>
      <div className="flex-none">
        <Header />
      </div>
          <SidebarTrigger className='hover:bg-[var(--three)] cursor-pointer'/>
      <div className="flex-1 p-6">
        <div className="mb-4 ">
        </div>
        {/* ...other content... */}
      </div>
    </SidebarProvider>
   </div>
  )
}
export default Local_shop_Home