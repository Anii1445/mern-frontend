import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { setCartTotal } from "./checkoutSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();


// AuthProvider function is responsible to provide data to all the child components
export const AuthProvider = ({ children }) => {



    // ---- Function for storing token in localstorage, this function is called from login.jsx and register.jsx page ------    
    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem("token", serverToken)
    };



    // ------------------------------------ Logout function logic ------------------------------------------------
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    let isLoggedIn = !!token;
    const [authLoading, setAuthLoading] = useState(true);


    const LogoutUser = () => {
        setToken("");
        setUser(null);
        setCartTotal([]);
        dispatch(setCartTotal(0));
        toast.success("Logout Successfully", {
                position: "top-center",
                autoClose: 2000, 
                 style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             })
        return localStorage.removeItem("token");
    }

    // const { cartTotal } = useSelector((state) => state.checkout);
    const dispatch = useDispatch();

    // ------------------ JWT Authentication - to get currently logged in userdata -----------------------
    const userAuthentication = async () => {

       if (!token) {
           setAuthLoading(false);
           return;
         } 
        try {
            const response = await fetch(`${API}/api/auth/users`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (error) {
            console.error("error fetching user data");
        } finally {
         setAuthLoading(false);
    }

    }

    // ----------------- Get All Flavour's Of Products ------------------------ //

      const [ApiFlavour, setApiFlavour] = useState([]);
      const getFlavour = async () => {
        try {
          const response = await fetch(`${API}/api/auth/flavour`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
          setApiFlavour(data);
        } catch (error) {
          console.log(error);
        }
      };


    // ---------------------- Get All Weight's Of Products -------------------- //

    const [ApiWeight, setApiWeight] = useState([]);
    const getWeight = async () => {
    try {
      const response = await fetch(`${API}/api/auth/weight`, {
        method: "GET",
      });
      const data = await response.json();
      setApiWeight(data);
    } catch (error) {
      console.log(error);
    }
  };


  const [ApiCategory, setApiCategory] = useState([]);

  const getCategory = async () => {
    try {
      const response = await fetch(`${API}/api/auth/category`,{
        method: "GET",
      });
      const data = await response.json();
      setApiCategory(data);
    } catch (error) {
      console.log(error);
    }
  }

  const [ApiBrands, setApiBrands] = useState([]);
  const getBrands = async () => {
    try {
      const response = await fetch(`${API}/api/auth/brand`,{
        method: "GET"
      });
      const data = await response.json();
      setApiBrands(data);
    } catch (error) {
      console.log(error);
    }
  }


  const getTotalCarts = async () => {
    try {

      const response = await fetch(`${API}/api/auth/getUserCart/${user?.userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json();
      
      if(response.ok){
        dispatch(setCartTotal(data));
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(user){
       getTotalCarts();
    }
  },[user])


    useEffect(() => {
        getFlavour();
        getWeight();
        getCategory();
        getBrands();
    }, []);

    useEffect(()=>{
      userAuthentication();
    },[token])

 

    return (
        <AuthContext.Provider value={{ storeTokenInLS, LogoutUser, isLoggedIn, user, token, ApiFlavour, ApiWeight, ApiCategory, ApiBrands, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook creation (useAuth)
export const useAuth = () => {
    return useContext(AuthContext);
};
