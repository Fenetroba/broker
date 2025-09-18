import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProductDisplay from "@/components/admin/ProductDisplay";
const items = [
  {
    title: "ADD Product Detail",
    url: "#",
  },
  {
    title: "List Products",
    url: "#",
  },
];
const ProductsControlled = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarProvider>
        <div className="fixed top-0 left-0 h-full z-50">
          <SidebarTrigger className="fixed top-4 left-4 z-50" />
          <Sidebar className="h-full">
            <SidebarContent className='bg-[var(--two2m)] text-[var(--two5m)] h-full'>
              <SidebarGroup>
                <SidebarGroupLabel className='font-bold text-[16px] text-white mb-10'>Post Popular Products</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton className='hover:bg-[var(--two5m)] w-full text-left' asChild>
                          <a href={item.url} className="block w-full px-4 py-2">
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>
        
        <div className="flex-1 ml-0 transition-all duration-300 ease-in-out pl-[280px] p-8">
         
            <ProductDisplay />
         
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ProductsControlled;
