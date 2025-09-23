// ...existing code...
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "@/store/ProductSlice";
import { Pencil, Trash2, Search, Plus, Eye, AlignLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import View_details from "./View_details";

const ListProducts = () => {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedProduct(null);
  };

  const { products, status, error } = useSelector(
    (state) => ({
      products: state.products.items || [],
      status: state.products.status,
      error: state.products.error,
    }),
    (prev, next) =>
      prev.products === next.products &&
      prev.status === next.status &&
      prev.error === next.error
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await dispatch(deleteProduct(productToDelete)).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // categories
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  // filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (status === "loading" && products.length === 0) {
    return (
      <div className=" mx-auto p-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <div key={index} className=" rounded-lg p-4">
            <div className="flex flex-col space-y-3">
   
        <Skeleton className="h-40 w-[100%] shadow-lg bg-green-50 rounded-2xl" />
         <div className="flex items-center gap-2">
             <Skeleton className="h-4 w-[90%] shadow-lg rounded-2xl bg-green-50" />
            <p className="w-10 h-10 rounded-full shadow-sm"></p>
         </div>
     
    </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=" ">
      <div className="flex shadow p-6 flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by name or description..."
              className="pl-10 h-10 text-sm w-full border rounded-md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 py-2 border rounded-md text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <Link to="/local_shop/my_product">
            <Button className="bg-[var(--two2m)] cursor-pointer hover:bg-green-900 text-[var(--two5m)]">
              <AlignLeft/> Back

            </Button>
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No products found. Create your first product!</p>
          <Link to="/local_shop/my_product">
            <Button className="bg-[var(--two2m)] hover:bg-green-900 text-[var(--two5m)]">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                      <div>
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">ID: {product._id}</div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm">{product.category || "-"}</td>

                    <td className="px-4 py-3 text-sm">
                      {Number(product.price || 0).toFixed(2)} Birr
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${product.countInStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {product.countInStock} in stock
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-200"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-xs text-gray-500">{product.numReviews || 0}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(product)}
                          className="p-2 rounded hover:bg-gray-100"
                          title="View"
                        >
                          <Eye className="h-4 w-4 text-gray-700" />
                        </button>


                        <AlertDialog  open={deleteDialogOpen && productToDelete === product._id} onOpenChange={setDeleteDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => handleDeleteClick(product._id)}
                              className="p-2 rounded hover:bg-red-50 text-red-600 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete product?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-400 cursor-pointer text-white">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border bg-white text-sm text-gray-600 disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-2 border text-sm ${currentPage === index + 1 ? "bg-[var(--two2m)] text-[var(--two5m)]" : "bg-white"}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border bg-white text-sm text-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
      {/* details modal */}
      <View_details
        productId={selectedProduct?._id || selectedProduct?.id}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
      />
    </div>
  );
};

export default ListProducts;
// ...existing code...