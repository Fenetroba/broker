import Login from "@/auth/Login";
import Footer from "@/components/gust/Footer";
import Header from "@/components/gust/Header";
import Hero from "@/components/gust/Hero";
import HowToWork from "@/components/gust/HowToWork";
import WhyChooseUs from "@/components/gust/WhyChooseUs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

const Home = ({isAuthenticated ,user}) => {
  return (
    <div>
      <div className="">
        <div className="h-8 bg-[var(--two2m)] flex justify-end items-center">
          <Select className="text-white font-bold" >
            <SelectTrigger className="cursor-pointer my-2 bg-white  border-0 shadow-none">
              <SelectValue placeholder="Language" className="bg-amber-50" />
            </SelectTrigger>
            <SelectContent className="bg-white text-[var(--parent1)] border-0">
              <SelectItem value="light">አማርኛ</SelectItem>
              <SelectItem value="dark">Eng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Header isAuthenticated={isAuthenticated} user={user}/>
        <Hero />
        <HowToWork/>
        <WhyChooseUs/>
        <div className="mt-[] relative">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
