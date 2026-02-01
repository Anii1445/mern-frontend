
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../src/store/auth-ContextAPI";


export default function AdminRoute({children}){

    const { user, isLoggedIn } = useAuth();

    if (!isLoggedIn){
        return <Navigate to="/login" replace/>
    }
    
    if(!user?.isAdmin){
        return <Navigate to="/" replace/>
    }
    
    return children
}