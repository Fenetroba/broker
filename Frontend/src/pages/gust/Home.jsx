import Login from "@/auth/Login";
import Footer from "@/components/gust/Footer";
import Header from "@/components/gust/Header";
import Hero from "@/components/gust/Hero";
import New_products from "@/components/gust/New_products";
import Popular_Products from "@/components/gust/Popular_Products";



import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import React from "react";
import { useSelector } from "react-redux";

const Home = ({isAuthenticated ,user}) => {

  return (
    <div>
      <div className="">
        <div className="h-8 bg-[var(--two2m)] flex justify-end items-center">
          <Select className="text-white font-bold" >
            <SelectTrigger className="cursor-pointer my-2 bg-white  border-0 shadow-none">
              <SelectValue placeholder="Language 🌎" className="bg-amber-50" />
            </SelectTrigger>
            <SelectContent className="bg-white text-[var(--parent1)] border-0">
              <SelectItem value="Amharic">አማርኛ </SelectItem>
              <SelectItem value="Aoromo">AFan Oromo</SelectItem>
              <SelectItem value="Tigray">Tigray</SelectItem>
              <SelectItem value="Eng">Eng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Header isAuthenticated={isAuthenticated} user={user}/>
        <Hero />
       
           
       
                  <div className="sm:flex m-4 mt-20">
                    <div className="shadow-sm rounded-2xl w-[20%] p-4">
                         <h2>Local Sellers</h2>

                         


                  </div>
                <div className="sm:w-[88%]">
                      
                <Popular_Products/>
                  <New_products/>
                </div>
                  </div>
             
 
        <div className="mt-[] relative">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
