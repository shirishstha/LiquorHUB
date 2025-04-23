  import Layout from "@/components/layout/Layout";
  import { Button } from "@/components/ui/button";
  import { useAuth } from "@/context/auth";
  import { useCart } from "@/context/cart";
  import { ShoppingCart, Trash2, ArchiveX } from "lucide-react";
  import React from "react";
  import toast from "react-hot-toast";
  import { useNavigate } from "react-router-dom";
  import axios from "axios";


  const CartPage = () => {
    const [cart, setCart] = useCart();
    const [auth] = useAuth();
    const navigate = useNavigate();

    const handleDeleteCart = (id) => {
      try {
        const updatedCart = cart.filter((item) => item._id != id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success("Item removed from cart");
      } catch (error) {
        console.log(error);
        toast.error("Error deleting cart");
      }
    };

    const calculateItemTotal = (price, quantity) => {
      return price * quantity;
    };

    const totalAmount = () => {
      let total = cart.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0
      );
      return total;
    };

    //handle update quantity
    const handleUpdateQuantity = (id, action) => {
      try {
        const updatedCart = cart.map((item) => {
          if (item._id === id) {
            if (action === "increase") {
              return { ...item, quantity: item.quantity + 1 };
            } else if (action === "decrease" && item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            }
          }
          return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (error) {
        console.log(error);
        toast.error("Error updating quantity");
      }
    };

    const shippingCharge = 200;
    const grandTotal = totalAmount() + shippingCharge;

    //handle payment
    const handlePayment = async () => {
      try {
        if (!totalAmount || !cart) {
          return toast.error("Cart is empty");
        }

        //creating product id and quantity array for backend
        const products = cart?.map((item) => {
          return { _id: item._id, quantity: item.quantity };
        });

        //sending request to backend
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/api/liquorhub/payment/pay`,
          { totalAmount: grandTotal, products, userId: auth?.user?._id }
        );
        if (data.success) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

          Object.keys(data.paymentData).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data.paymentData[key];
            form.appendChild(input);
          });
          document.body.appendChild(form);
          form.submit();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        if (error.response.status === 400) {
          console.log(error);
          toast.error(error.response.data.message);
        } else {
          console.log(error);
          toast.error("Couldnot perform payment operation");
        }
      }
    };

    return (
      <Layout title="LiquorHub-cart">
        <h1 className="text-3xl font-bold p-5">Your Cart</h1>
        {cart.length > 0 ? (
          <div className="flex w-[100%] space-x-2 p-2">
            <div className="shadow rounded p-3 w-[68%] h-full px-5  ">
              <div className="flex text-2xl space-x-2 mb-5 items-center font-medium">
                <ShoppingCart />
                <h2>Cart Items ({cart.length})</h2>
              </div>
              <div className="space-y-7 ">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex space-x-5  h-25 overflow-hidden rounded-lg items-center"
                  >
                    <img
                      src={`${
                        import.meta.env.VITE_BACKEND_API
                      }/api/liquorhub/product/product-photo/${item?._id}`}
                      alt={item.name}
                      className="h-22 aspect-square object-cover rounded-lg p-1"
                    />
                    <div className="flex-col w-[50%]">
                      <h1 className="text-xl font-medium ">{item.name}</h1>
                      <h2 className="text-md text-gray-600 ">Rs.{item.price}</h2>
                    </div>
                    <div className="flex w-[20%] items-center space-x-3">
                      <Button
                        onClick={() => handleUpdateQuantity(item._id, "decrease")}
                        className="text-lg "
                        variant="outline"
                      >
                        -
                      </Button>

                      <span> {item.quantity}</span>
                      <Button
                        onClick={() => handleUpdateQuantity(item._id, "increase")}
                        className="text-lg "
                        variant="outline"
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex  w-[20%] items-center">
                      <h3 className="text-xl w-[70%]">
                        Rs.{calculateItemTotal(item.price, item.quantity)}
                      </h3>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteCart(item._id)}
                        className="cursor-pointer"
                      >
                        <Trash2 size={17} className="text-gray-600 " />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[32%] shadow rounded mx-2 p-4 space-y-4">
              <h1 className="text-2xl font-medium flex flex-col">
                Cart Summary
                <span className="text-sm text-gray-500 font-normal pt-2">
                  Review your order before proceeding to payment.
                </span>
              </h1>
              <div className="flex justify-between border-y p-3">
                <span>Total Amount</span>
                <span>Rs.{totalAmount()}</span>
              </div>

              <div className="flex justify-between border-b pb-3 px-3">
                <span>Shipping Charge</span>
                <span>Rs.{shippingCharge}</span>
              </div>

              <div className="flex justify-between border-b items-center py-5 px-3">
                <span className="text-lg font-medium">Grand Total</span>
                <span className="text-lg font-medium">Rs.{grandTotal}</span>
              </div>
              <div className="flex justify-between items-center  w-[100%] pb-3 px-3">
                <span className="w-[50%]">Delivery Location</span>
                {auth?.user?.address ? (
                  <div className="flex  flex-col  w-[50%] space-y-2">
                    <span className=" text-center">{auth.user.address}</span>
                    <Button onClick={() => navigate("/dashboard/user/profile")}>
                      Change location?
                    </Button>
                    <Button onClick={() => handlePayment()}>Checkout</Button>
                  </div>
                ) : auth.token ? (
                  <Button onClick={() => navigate("/dashboard/user/profile")}>
                    Specify location?
                  </Button>
                ) : (
                  <Button
                    onClick={() =>navigate("/login") }
                  >
                    Login to Checkout
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <h1 className="flex flex-col items-center  text-xl space-y-1 ">
            <ArchiveX size={52} className="text-gray-700 "/>
            <p className="text-gray-600 text-lg"> Your cart is empty ! Add some items to checkout.</p>
            <Button variant="ghost" className="text-xl font-normal cursor-pointer" onClick={()=>navigate('/')}>Let's Go</Button>
          </h1>
        )}
      </Layout>
    );
  };

  export default CartPage;
