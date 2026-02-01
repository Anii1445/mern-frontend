import { Navigate } from "react-router-dom";
import { useAuth } from "../src/store/auth-ContextAPI";

export default function GuestRoute({children}){

    const { isLoggedIn, user } = useAuth();

    if(isLoggedIn){
        return <Navigate to="/" replace />
    }
    return children;
};
