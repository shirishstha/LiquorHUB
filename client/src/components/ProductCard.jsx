import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/cart";
import toast from "react-hot-toast";

export default function ProductCard({ products = [] }) {
  const [cart, setCart] = useCart();
  return (
    <div className="flex justify-around space-y-9 gap-5 flex-wrap p-10 w-[100%]">
      {products &&
        products.map((product) => (
          <Card
            className="w-[250px] h-[350px]  hover:shadow-2xl shadow-lg transition-all duration-200 relative overflow-hidden pt-0 gap-5 "
            key={product?._id}
          >
            <Link to={`/product/${product?.slug}`}>
              <img
                className="h-[210px] w-full object-cover"
                src={`${
                  import.meta.env.VITE_BACKEND_API
                }/api/liquorhub/product/product-photo/${product?._id}`}
                alt={product.name}
              />
              <CardContent className="px-4 py-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.category?.name}
                    </p>
                  </div>
                  <p className="text-lg font-semibold">{product?.price}</p>
                </div>
              </CardContent>
            </Link>
            <CardFooter className="p-1 border-t ">
              <Button
                variant="ghost"
                className="w-full cursor-pointer"
                onClick={() => {
                  const existingItem = cart.find(
                    (item) => item._id === product._id
                  );

                  if (existingItem) {
                    toast.error("Item is already in the cart");
                    return;
                  }

                  const newCartItem = { ...product, quantity: 1 };
                  setCart([...cart, newCartItem]);
                  localStorage.setItem(
                    "cart",
                    JSON.stringify([...cart, newCartItem])
                  );
                  toast.success("Item added to cart successfully");
                }}
              >
                <PlusIcon className="size-4 me-1" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}
