import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import api from '@/lib/Axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError('Failed to load products');
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">Loading liked products...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6  mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
         
          Popular products
          
        </h1>
      </div>

      {likedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
          
          </div>
          <h3 className="text-lg font-medium text-gray-500">No liked products yet</h3>
          <p className="text-gray-400 mt-1">Like products to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {likedProducts.map((product) => (
            <div 
              key={product._id || product.id} 
              className="bg-white rounded-lg border w-[250px] border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
            
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
      )}
    </div>
  );
};

export default Products