import { Button } from "@/components/ui/button";
import { CreativeCommons, List, Plus } from "lucide-react";
import React from "react";
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
import { FaProductHunt } from "react-icons/fa";
import { Link } from "react-router-dom";
const MyProduct = () => {
  return (
    <section>
      <div className="w-[40%] shadow p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[var(--two2m)] hover:bg-green-900 text-[var(--two5m)] rounded-2xl cursor-pointer">
              Product Detail <Plus />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="border-0 shadow rounded-2xl bg-[var(--two5m)]">
            <DropdownMenuSeparator />
            <DropdownMenuItem className=" cursor-pointer">
              <Button className="hover:bg-[var(--two3m)]  shadow-black  cursor-pointer rounded-2xl">
                {" "}
                Create Product
                <CreativeCommons />
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem className=" cursor-pointer ">
              <Link to="/local_shop/product-list">
                {" "}
                <Button className="hover:bg-[var(--two3m)] shadow-black cursor-pointer rounded-2xl">
                  List Products <List className="ml-3" />
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="sm:flex space-x-1.5 max-sm:space-y-2.5 items-center m-5">
        <div className="sm:w-[40%] h-[60vh] bg-[var(--two2m)] rounded-2xl"></div>
        <div className="flex-1 space-y-2 h-[80vh]">
          <p className="h-[50%] bg-[var(--two5m)]">ee</p>
          <p className="flex-1 h-[50%]  bg-[var(--two5m)]">ee</p>
        </div>
      </div>
    </section>
  );
};

export default MyProduct;
