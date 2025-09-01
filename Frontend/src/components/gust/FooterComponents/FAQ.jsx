import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
const FAQ = () => {
  return (
   
    <Sheet>
    <SheetTrigger asChild>
      <Button className=" hover:text-[var(--two4m)] cursor-pointer">
      Frequently Asked Questions
      </Button>
    </SheetTrigger>
    <SheetContent side="bottom" className="h-[90vh] overflow-y-auto pb-10 bg-green-50 rounded-2xl flex flex-col items-center">
    
                
      
    </SheetContent>
  </Sheet>
  )
}

export default FAQ