import { Navigate } from "react-router-dom";
import { useAuth } from "../src/store/auth-ContextAPI";

export default function PaymentRoute({children}){

    const { isLoggedIn, user } = useAuth();

     if(!isLoggedIn){
        return <Navigate to="/login" replace />
    }

     // 🚫 Admin blocked
    if (user?.isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};