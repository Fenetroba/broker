import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import BannerLocal from '../../assets/LocalBanner.png'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { LogOut } from "../../store/AuthSlice";
const Hero = () => {
  const dispatch = useDispatch();
  return (
  <section>
      <div className=" shadow flex justify-between items-center pr-10">
      <div>
        <Link to="/local_shop/home" className="flex items-center">
          <img src={Logo} alt="Logo" className=" -mb-5 w-48 h-24 object-contain" />
        </Link>
      </div>
      <div>
        <DropdownMenu >
            
          <Tooltip>
          <DropdownMenuTrigger asChild>
  <TooltipTrigger className=' cursor-pointer bg-green-200 p-2 rounded-full'><User/></TooltipTrigger>
  
  </DropdownMenuTrigger>
  <TooltipContent className='bg-[var(--two2m)] rounded-2xl text-white'>
    <p>Profile</p>
  </TooltipContent>
</Tooltip>

          <DropdownMenuContent className="border-0 shadow rounded-2xl bg-[var(--two5m)]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem  className=' cursor-pointer'><Link to='/user/profile'>Profile</Link> </DropdownMenuItem>
            <DropdownMenuItem  className=' cursor-pointer'>Billing</DropdownMenuItem>
            <DropdownMenuItem  className='  '>
              <Button className='cursor-pointer rounded-2xl bg-[var(--two2m)] text-white  hover:bg-green-900' onClick={()=> dispatch(LogOut())} >Log Out </Button>
            </DropdownMenuItem>
            <DropdownMenuItem  className=' cursor-pointer'>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    {/* Loca shoper Banner */}
    <div className="mt-4">
      <img src={BannerLocal} alt="BannerLocal" />
    </div>
  </section>
  );
};

export default Hero;
