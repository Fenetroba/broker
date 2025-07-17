import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  return (
    <div>
      <div>
       <Link to='/local_shop/home'>
       <Button className="bg-[var(--two2m)] text-white m-5 hover:bg-[var(--two4m)] cursor-pointer hover:text-black">
          <MoveLeft /> Back To Home
        </Button>
       </Link> 
      </div>
    </div>
  );
};

export default Orders;
