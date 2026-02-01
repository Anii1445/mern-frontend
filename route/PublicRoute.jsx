import { Navigate } from "react-router-dom";
import { useAuth } from "../src/store/auth-ContextAPI";

export default function PublicRoute({children}){
    const { user } = useAuth();
      if(user?.isAdmin){
        return <Navigate to="/admin/dashboard" replace />
      }

      return children;
}