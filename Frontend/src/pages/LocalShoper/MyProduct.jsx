import { Button } from "@/components/ui/button";
import {  ChevronDown, CreativeCommons, List, ListCheck, Plus } from "lucide-react";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Product1 from '../../assets/Product1.jpg'
import Product2 from '../../assets/product2.jpg'

import { FaProductHunt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Create_product from "@/components/LocalShoper/ProductDetail/Create_product";
import ListProducts from "@/components/LocalShoper/ProductDetail/ListProducts";
const MyProduct = () => {
  return (
    <section>
      <div className=" shadow p-1 bg-gradient-to-br from-[var(--two5m)] to-[var(--two3m)]">
        <Popover>
          <PopoverTrigger className=" flex items-center justify-center rounded-2xl cursor-pointer bg-[var(--two2m)] text-[var(--two5m)] font-bold text-center p-1  w-[40%]">
            <span> My Product </span>{" "}
            <span>
              <ChevronDown />
            </span>
          </PopoverTrigger>
          <PopoverContent className="border-0 ">
            <Create_product />
            <Link to="/local_shop/product-list">
            <Button className="bg-[var(--two2m)] hover:bg-green-900 text-[var(--two5m)]">
              <ListCheck className="mr-2 h-4 w-4" /> List Of Products
            </Button> 
          </Link>
          </PopoverContent>
        </Popover>

        <div className="sm:flex space-x-2.5 max-sm:space-y-3.5 items-center sm:m-10 m-3">
          <div className="sm:w-[40%] h-[60vh]  bg-black">
            <img
              src={Product1}
              alt=""
              className="overflow-hidden w-full h-full rounded-4xl object-cover"
            />
          </div>
          <div className="flex-1   space-y-2  gap-10">
            <p className=" h-[50%] bg-black">
            <img
              src={Product2}
              alt="Product2"
              className=" overflow-hidden w-full h-full rounded-3xl object-cover"
            />
            </p>
            <p className="flex-1 h-[50%]  bg-[var(--two5m)]">ee</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProduct;
