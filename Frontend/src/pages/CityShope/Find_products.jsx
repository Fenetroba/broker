import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import api from "@/lib/Axios";

import { Button } from "@/components/ui/button";
import View_details from "@/components/LocalShoper/ProductDetail/View_details";
import { toast } from 'sonner';
import { likeProduct } from "@/store/ProductSlice";

// Helper: format price safely
const formatPrice = (value) => {
  if (value == null || value === "") return "—";
  const num = Number(value);
  return Number.isFinite(num) ? `$${num.toLocaleString()}` : "—";
};

// Presentational: single product card
const ProductCard = ({ product, onLike }) => {
 
  const navigate = useNavigate();
  const { _id, id, image, name, description, price, category, owner, isLiked } =
    product || {};
  const ownerId = owner?._id || owner?.id;
  const { user } = useSelector(state => state.auth);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to like products');
      return;
    }
    if (isLiking) return; // Prevent multiple clicks
    
    try {
      setIsLiking(true);
      await onLike(_id || id);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <div
      key={_id || id}
      className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="aspect-video relative bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={name || "Product"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        <button 
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white/90 transition-colors"
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500 transition-colors`}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="font-medium text-gray-900 line-clamp-1">
          {name || "Unnamed"}
        </div>
        <div className="text-xs text-gray-500 line-clamp-2 min-h-[2rem]">
          {description || ""}
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-sm font-semibold text-[var(--two3m)]">
            {formatPrice(price)}
          </span>
          <span className="text-xs text-gray-500">
            {category || "Uncategorized"}
          </span>
        </div>

        <Button
          className="p-0 rounded-full px-2 h-8 bg-[var(--two4m)] text-[10px] hover:bg-[var(--two3m)] text-[var(--two5m)] cursor-pointer"
          onClick={() => ownerId && navigate(`/city_shop/inbox?to=${ownerId}`)}
          aria-label="Chat with seller"
        >
          Chat
        </Button>
        {owner?.name && (
          <div className="text-[11px] text-gray-500 ">Seller: {owner.name}</div>
        )}
        <div className="flex items-center gap-2">
          <Button
            className="p-0 rounded-[10px] px-2 h-8 bg-[var(--two2m)] hover:bg-[var(--two3m)] text-[var(--two5m)] cursor-pointer"
            onClick={() => ownerId && navigate(`/city_shop/order/${_id || id}`)}
            aria-label="Chat with seller"
          >
            Start Order
          </Button>

          {/* View details uses the existing sheet-based component */}
          <View_details productId={_id || id} />
        </div>
      </div>
    </div>
  );
};

const Find_products = () => {
  const dispatch  = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  // Load all products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/product/get-products");
        const list = Array.isArray(data) ? data : data?.products || [];
        setProducts(list);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Build the category list from products
  const categories = useMemo(() => {
    const set = new Set();
    for (const p of products || []) {
      if (p?.category) set.add(p.category);
    }
    return ["all", ...Array.from(set)];
  }, [products]);

  // Apply search text and category filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (products || []).filter((p) => {
      const matchesQuery =
        !q ||
        [p?.name, p?.description, p?.category]
          .filter(Boolean)
          .some((txt) => String(txt).toLowerCase().includes(q));
      const matchesCategory = category === "all" || p?.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  const handleLike = async (productId) => {
    try {
      await dispatch(likeProduct(productId)).unwrap();
      // Refetch products to update the UI
      const { data } = await api.get("/product/get-products");
      const list = Array.isArray(data) ? data : data?.products || [];
      setProducts(list);
    } catch (error) {
      console.error('Error liking product:', error);
      throw error;
    }
  };

  return (
    <section className="bg-[var(--two1m)] min-h-screen max-sm:m-2">
      <div className="space-y-4 container mx-auto pt-5 ">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 h-10 px-3 rounded-md border max-sm:p-2 border-gray-200 focus:outline-none shadow-sm bg-white "
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-3  rounded-md border border-gray-200 bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        </div>

        {/* States */}
        {loading && (
          <div className="p-4 text-sm text-gray-500">Loading products...</div>
        )}
        {error && (
          <div className="p-4 text-sm text-red-600">{String(error)}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">
            No products found
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard 
                key={p?._id || p?.id} 
                product={p} 
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Find_products;
