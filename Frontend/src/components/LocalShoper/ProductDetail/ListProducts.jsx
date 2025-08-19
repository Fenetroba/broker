import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "@/store/Productsice";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import PageLoad from "@/components/Loading/PageLoad";

const ListProducts = () => {
  const dispatch = useDispatch();
  const {
    items: products = [],
    status,
    error,
  } = useSelector((state) => ({
    items: state.products.items || [],
    status: state.products.status,
    error: state.products.error,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

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

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (status === "loading" && products.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="h-full border-0 shadow-2xl flex flex-col">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-20" />
                <div className="flex space-x-2">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (status==="loading") {
    return (
    <PageLoad/>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col md:flex-row shadow-emerald-100  shadow justify-between items-center mb-4 gap-3 px-2">
        <h1 className="text-xl font-bold text-gray-800 p-3">My Products</h1>
        <div className="flex w-full md:w-2/3 gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 h-9 text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No products found. Create your first product!
          </p>
          <Link to="/local_shop/my_product">
            <Button className="bg-[var(--two2m)] cursor-pointer hover:bg-green-900 text-[var(--two5m)]">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-2">
            {currentProducts.map((product) => (
              <Card
                key={product._id}
                className="h-full flex border-0 flex-col hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                
                </div>
                <CardHeader className="p-3">
                  <div className="flex justify-between items-start space-x-2">
                    <CardTitle className="text-sm font-medium line-clamp-2 leading-tight">
                      {product.name}
                    </CardTitle>
                    <span className="text-sm font-semibold text-green-600 whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <Badge variant="outline" className="w-fit mt-1 text-xs h-5">
                    {product.category}
                  </Badge>
                </CardHeader>
                <CardContent className="p-3 pt-0 flex-grow">
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-xs text-gray-500">
                        {product.numReviews}
                      </span>
                    </div>
                    <Badge className="text-xs h-5 bg-green-100 text-green-800 hover:bg-green-200">
                      {product.countInStock} in stock
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="text-[var(--two5m)] pt-0  bg-[var(--two2m)]  p-1 flex justify-between space-x-1">
                  <Link
                    to={`/local_shop/product/${product._id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8 cursor-pointer hover:bg-[var(--two3m)]"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Link
                    to={`/local_shop/edit-product/${product._id}`}
                    className="flex-shrink-0"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 cursor-pointer hover:bg-[var(--two3m)]"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
              


                  <AlertDialog open={deleteDialogOpen && productToDelete === product._id} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 cursor-pointer hover:text-red-600"
                        onClick={() => handleDeleteClick(product._id)}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product from our database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={confirmDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? "bg-[var(--two2m)] text-[var(--two5m)] border-[var(--two2m)]"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListProducts;
