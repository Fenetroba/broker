import React, { useEffect, useState } from 'react';
import { Heart, Loader2, LoaderPinwheelIcon } from 'lucide-react';
import api from '@/lib/Axios';
import { Skeleton } from "@/components/ui/skeleton"

import View_details from '../LocalShoper/ProductDetail/View_details';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all products on component mount
  useEffect(() => { 
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/product/get-products");
        // Handle both array response and object with products property
        const productList = Array.isArray(data) ? data : data?.products || [];
        setProducts(productList);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Check Your Network');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Filter liked products
  const likedProducts = products.filter(product => product?.isLiked) || [];
  
  if (loading) {
    return (
      <div className="flex flex-col space-y-3 ">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>      
    );
  }
  
  // if (error) {
  //   return (
  //     <div className="p-8 text-red-500 text-center">
  //       {error}
  //     </div>
  //   );
  // }

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };
  return (
    <div className="p-6 mx-auto">
     
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
         
          Popular products
          
        </h1>
      </div>
{error && <div className="p-8 text-red-500 text-center">
         {error}
       </div> }
      {likedProducts.length === 0 ? (
        <div className="text-center py-2">
          <div className="text-gray-400 mb-4"></div>
          <h3 className="text-lg font-medium text-gray-500">No liked products yet</h3>
          <p className="text-gray-400 mt-1">Like products to see them here</p>
        </div>
      ) : (
        <>
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
            {likedProducts.map((product) => (
              <div 
                key={product._id || product.id} 
                onClick={() => handleProductClick(product._id)}
                className="bg-white cursor-pointer rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow w-64 flex-shrink-0"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden group">
                  <div className="relative w-full h-full overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-150"
                      style={{
                        transformOrigin: 'center center',
                        willChange: 'transform',
                      }}
                      onMouseMove={(e) => {
                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - left) / width) * 100;
                        const y = ((e.clientY - top) / height) * 100;
                        e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transformOrigin = 'center center';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-semibold text-gray-900">${product.price}</span>
                    {product.category && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
          
          {/* Modal */}
          {isModalOpen && (
            <View_details 
              productId={selectedProductId} 
              isOpen={isModalOpen}
              onClose={closeModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Products