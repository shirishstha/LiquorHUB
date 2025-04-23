import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/auth/register";
import LoginPage from "./pages/auth/login";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import PolicyPage from "./pages/Policy";
import CartPage from "./pages/Cart";
import PageNotFoundPage from "./pages/Pagenotfound";
import Private from "./components/routes/private";
import Dashboard from "./pages/user/Dashboard";
import { ForgotPassword } from "./pages/auth/forgotPassword";
import Profile from "./pages/user/Profile";
import Orders from "./pages/user/Orders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateProduct from "./pages/admin/CreateProduct";
import Users from "./pages/admin/Users";
import AdminRoute from "./components/routes/AdminRoute";
import Products from "./pages/admin/Products";
import UpdateProduct from "./pages/admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import PaymentSuccess from "./pages/payment/paymentSuccess";
import PaymentFailed from "./pages/payment/paymentFailed";
import OrderDetails from "./pages/user/OrderDetails";
import AllOrders from "./pages/admin/AllOrders";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/product/:slug" element={<ProductDetails/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/category/:slug" element={<CategoryProducts/>} />

        {/* User Protected Routes */}
        <Route path="/dashboard" element={<Private />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/payment/success/:oid" element={<PaymentSuccess />} />
          <Route path="user/payment/failed/:oid" element={<PaymentFailed />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/order/:oid" element={<OrderDetails />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route path="/dashboard" element={<AdminRoute/>}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/all-orders" element={<AllOrders />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
          <Route path="admin/users" element={<Users />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* General Routes */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="*" element={<PageNotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
