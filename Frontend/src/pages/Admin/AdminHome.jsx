import Header from '@/components/admin/Sidebar'
import Hero from '@/components/admin/Hero'
import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import  banners from '../../assets/AdminBanner.png'
const AdminHome = ({user}) => {
  return (

     <div className='relative overflow-hidden '>
     <SidebarProvider>
     <div className="flex-none">
       <Header user={user}/>
     </div>
         <SidebarTrigger className='bg-[var(--two3m)] cursor-pointer rounded-2xl'/>
     <div className="flex-1 sm:p-6 p-1">
       <div className="mb-4 ">
       </div>
       <Hero/>
       <div className='sm:flex items-center'>
        <img src={banners} alt="banners" className='' />
     <h1 className='font-bold text-2xl md:text-4xl lg:text-5xl bg-[var(--two2m)] p-3 h-[150px] text-[var(--two5m)] rounded-t-2xl w-full'>Admin and Supporter</h1>
      </div>
     </div>
     </SidebarProvider>
     <div className=' bg-yellow-500 w-[550px] h-[550px]  shadow-2xl rounded-full absolute z-[-10] top-[-100px] right-[-100px]'></div>
      
   </div>
  )
}

export default AdminHome