import Header from '@/components/City shop/Header'
import Hero from '@/components/City shop/Hero'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

const CityHome = () => {
  return ( 
    <div className='relative overflow-hidden '>
      <SidebarProvider>
      <div className="flex-none">
        <Header />
      </div>
          <SidebarTrigger className='bg-[var(--two3m)] cursor-pointer rounded-2xl'/>
      <div className="flex-1 sm:p-6 p-1">
        <div className="mb-4 ">
        </div>
        <Hero/>
      </div>
      </SidebarProvider>
      <div className='bg-green-400 w-[550px] h-[550px]  shadow-2xl rounded-full absolute z-[-10] top-[-100px] right-[-100px]'></div>
    </div>
  )
}

export default CityHome