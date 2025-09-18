import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import BannerCity from "../../assets/cityBanner.png";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { LogOut } from "@/store/AuthSlice";
const Hero = () => {
const dispatch = useDispatch();
const LogoutHandler = () => {
  dispatch(LogOut());
};

  return (
    <section>
      <div className=" shadow flex justify-between items-center pr-10">
        <div>
          <Link to="/city_shop/home" className="flex items-center">
            <img
              src={Logo}
              alt="Logo"
              className=" -mb-5 w-48 h-24 object-contain"
            />
          </Link>
        </div>
        <div>
          <DropdownMenu>
            <Tooltip>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger className=" cursor-pointer bg-green-200 p-2 rounded-full">
                  <User />
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <TooltipContent className="bg-[var(--two2m)] rounded-2xl text-white">
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="border-0 shadow rounded-2xl bg-[var(--two5m)]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className=" cursor-pointer">
                {" "}
                <Link to="/user/profile">
                  <p>Profile</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className=" cursor-pointer">
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="  ">
                <Button onClick={LogoutHandler} className="cursor-pointer rounded-2xl bg-[var(--two2m)] text-white  hover:bg-green-900">
                  Log Out{" "}
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className=" cursor-pointer">
                Subscription
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* city shoper Banner */}
      <div className="mt-4 ">
        <img
          src={BannerCity}
          alt="BannerCity"
          className="object-cover  max-sm:h-[400px] max-sm:mt-20  "
        />
        <p className="text-4xl font-bold text-white absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-lg">City Shop</p>
      </div>
    </section>
  );
};

export default Hero;
