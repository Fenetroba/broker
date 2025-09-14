import React, { useEffect, useState } from 'react';
import api from '@/lib/Axios';
import { Loader2, Package2, Star } from 'lucide-react';
import View_details from '../LocalShoper/ProductDetail/View_details';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNewProducts } from '@/store/ProductSlice';

const New_products = () => {


  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();

  // Fetch new products (last 48 hours) 
  const { NewPoducts, LoadingNewPoduct } = useSelector(state => state.products);
  console.log('New Products:', NewPoducts);
  
  useEffect(() => {
    dispatch(fetchNewProducts());
  }, [dispatch]);
  

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  if (LoadingNewPoduct) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 font-bold animate-spin text-[var(--two2m)] " />

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
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="font-bold text-gray-900 sm:text-2xl">
            New Arrivals
          </h2>
        </div>

        {NewPoducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500">No new products added recently</h3>
            <p className="text-gray-400 mt-1">Check back later for new arrivals</p>
          </div>
        ) : (
          <>
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
              {NewPoducts.slice(0, showAll ? NewPoducts.length : 6).map((product) => (
                <div 
                  key={product._id || product.id} 
                  onClick={() => handleProductClick(product._id)}
                  className="bg-white cursor-pointer rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow w-64 flex-shrink-0"
                >
                  <div className="relative h-64 bg-gray-100 overflow-hidden group">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110"
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
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= Math.round(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-500">
                          ({product.numReviews || 0})
                        </span>
                      </div>
                    </div>
               
                  </div>
                </div>
              ))}
              </div>
            </div>

            {NewPoducts.length > 6 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-2 border border-[var(--two2m)] text-[var(--two2m)] rounded-md hover:bg-[var(--two2m)] hover:text-white transition-colors"
                >
                  {showAll ? 'Show Less' : 'See All'}
                </button>
              </div>
            )}
          </>
        )}
     
      </div>

      {/* Product Details Modal */}
      {selectedProductId && (
        <View_details 
          key={selectedProductId}
          productId={selectedProductId}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default New_products;