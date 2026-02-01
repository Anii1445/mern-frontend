import { Routes, Route, useActionData } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Error from "./pages/Error";
import Logout from "./pages/Logout";
import AdminLayout from "./components/Admin-Layout";
import AdminUsers from "./pages/Admin-Users";
import AdminDashboard from "./pages/Admin-Dashboard";
import { useLocation } from "react-router-dom";
import AdminProduct from "./pages/Admin-Product";
import ProductView from "./pages/Product-View";
import Carts from "./pages/Carts";
import Whislist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import { useState } from "react";
import Payment from "./pages/Payment";
import { useAuth } from "./store/auth-ContextAPI";
import GuestRoute from "../route/GuestRoute";
import ProtectedRoute from "../route/ProtectedRoute";
import AdminRoute from "../route/AdminRoute";
import PublicRoute from "../route/PublicRoute";
import MyAccount from "./pages/MyAccount";
import Addresses from "./pages/Addresses";
import MyOrder from "./pages/MyOrder";
import PersonalInfo from "./pages/PersonalInfo";
import RegisterEdit from "./pages/RegisterEdit";
import AllUserOrders from "./pages/AllUserOrders";
import ServiceCenter from "./pages/ServiceCenter";
import PaymentRoute from "../route/PaymentRoute";
import OrderDetails from "./pages/OrderDetails";
import AdminRegisterEdit from "./pages/AdminRegisterEdit";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import FAQs from "./pages/FAQs";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About_Us from "./pages/About_Us";
import ContactUs from "./pages/ContactUs";

function App() {
  const location = useLocation();
  const {user} = useAuth();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  const { authLoading } = useAuth();

  if (authLoading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
             <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
             </div>
           </div>; // or spinner
  }

  return (
    <>
      <div className="app-container">
      {!shouldHideNavbar && <Navbar/>}
      
      <main className="content">
        <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/product/view/:id" element={<PublicRoute><ProductView /></PublicRoute>} />
        <Route path="/faqs" element={<PublicRoute><FAQs /></PublicRoute>} />
        <Route path="/blog" element={<PublicRoute><Blog /></PublicRoute>} />
        <Route path="/privacy-policy" element={<PublicRoute><PrivacyPolicy /></PublicRoute>} />
        <Route path="/about-us" element={<PublicRoute><About_Us /></PublicRoute>} />
        <Route path="/contact-us" element={<PublicRoute><ContactUs /></PublicRoute>} />

        
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
        
        <Route path="/carts" element={<ProtectedRoute><Carts/></ProtectedRoute>} />
        <Route path="/whishlist" element={<ProtectedRoute><Whislist/></ProtectedRoute>}/>
        <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
        <Route path="/payment" element={<PaymentRoute><Payment/></PaymentRoute>}/>
        <Route path="/myaccount" element={<ProtectedRoute><MyAccount/></ProtectedRoute>}>
           <Route path="addresses" element={<Addresses/>}/>
           <Route path="myorders" element={<MyOrder/>}/>
           <Route path="personal-information" element={<PersonalInfo/>}/>
           <Route path="personal-information/edit" element={<RegisterEdit/>} />
           <Route path="mywishlist" element={<Whislist/>}/>
           <Route path="orderDetails/:id" element={<OrderDetails/>}/>
        </Route>
        
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="userEdit/:id" element={<AdminRegisterEdit/>}/>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="servicecenter" element={<ServiceCenter/>} />
          <Route path="userOrders/:id" element={<AllUserOrders />} />
          <Route path="userOrderDetails/:id" element={<AdminOrderDetails/>}/>
        </Route>

        <Route path="*" element={<Error />} /> 
        </Routes>
      </main>
      {!shouldHideNavbar && <Footer />}
      </div>
    </>
  );
}

export default App;
