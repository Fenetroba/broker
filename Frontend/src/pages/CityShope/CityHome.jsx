import Header from '@/components/City shop/Header'
import Hero from '@/components/City shop/Hero'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

const CityHome = () => {
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
        <Hero/>
      </div>
      </SidebarProvider>
    </div>
  )
}

export default CityHome