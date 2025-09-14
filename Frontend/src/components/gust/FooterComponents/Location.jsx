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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Location = () => {



  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="hover:text-[var(--two4m)] cursor-pointer">
          Location
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-[90vh] overflow-y-auto pb-10 bg-green-50 rounded-2xl flex flex-col items-center">
        <SheetHeader className="text-center mb-6">
          <SheetTitle className="text-2xl font-bold text-gray-800">Our Locations in Addis Ababa</SheetTitle>
          <SheetDescription className="text-gray-600">
            Find our branches and service centers in Addis Ababa
          </SheetDescription>
        </SheetHeader>

        {/* Google Map Container */}
        <div className="w-full p-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Map View</CardTitle>
              <CardDescription>Interactive map showing our locations in Addis Ababa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d38.7578!3d8.9806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f0a0b0b0b0%3A0x0!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2set!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

  


      </SheetContent>
    </Sheet>
  )
}

export default Location