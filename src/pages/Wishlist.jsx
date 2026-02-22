import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useAsyncError, useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { IoBagCheck } from "react-icons/io5";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Carts from "./Carts";
import { setCartTotal } from "../store/checkoutSlice";
const API = import.meta.env.VITE_API_URL;
import { RiLoader2Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useTheme, useMediaQuery } from "@mui/material";
import { FaArrowLeftLong } from "react-icons/fa6";


export default function Whislist() {
  const { user, token, isLoggedIn, products } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useDispatch()
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [movetocartLoading, setMovetocartLoading] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(()=>{
     window.scrollTo(0,0);
  },[pathname]);


   const getCartByUser = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch(
          `${API}/api/auth/getUserCart/${user?.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCarts(data);
          dispatch(setCartTotal(data))
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  console.log(carts)

  const getWishlists = async () => {
    setLoading(true);
    if (isLoggedIn) {
      try {
        const response = await fetch(`${API}/api/auth/UserWishlistJoin/${user?.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setWishlists(await response.json());
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
  };


  useEffect(() => {
    if(user){
         getWishlists();
         getCartByUser();
    }
  }, [user]);

//   const wishlistProduct = products.filter(p => wishlists.some(w => w.product_id === p._id && wishlists))
//  const wishlistProducts = products
//   .map(p => {
//     const match = wishlists.find(w => w.product_id === p._id);
//     return match ? { ...p, wishlist: match } : null;
//   })
//   .filter(Boolean);

  const home = () => {
    navigate("/");
  }

  const AddtoCart = async (wishlist_id, product_id, variant_id, product_price, product_weight, product_flavour, product_mrp, image) => {
   setMovetocartLoading(variant_id);
    if (isLoggedIn) {
      try {
        const response = await fetch(`${API}/api/auth/cart`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user?.userId,
            product_id: product_id,
            variant_id: variant_id,
            product_price: product_price,
            product_weight: product_weight,
            product_flavour: product_flavour,
            product_mrp: product_mrp,
            product_qty: 1,
            product_img: image
          }),
        });

        if (response.ok) {
          toast.success("Added To Cart!", {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             });
          getCartByUser();
          Delete(wishlist_id);
          setWishlists(prev =>
             prev.filter(item => item._id !== wishlist_id)
          );
          setMovetocartLoading(null);
        }
      } catch (error) {
        console.log(error);
      }
      finally{
        setMovetocartLoading(null);
      }
    } else {
      toast.warning("Please Login for better experience!", {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             });
      navigate("/login");
    }
  }
  

  const Delete = async (wishlist_id) => {
  setDeleteLoading(wishlist_id);
    try {
      const response = await fetch(`${API}/api/auth/deleteWhislistByID`,{
        method: "DELETE",
        headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json"
        },
        body: JSON.stringify({
          _id: wishlist_id,
          user_id: user.userId,
        })
      });
      if(response.ok){
        toast.success("Removed from Wishlist",{
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             });
       setWishlists(prev =>
              prev.filter(item => item._id !== wishlist_id)
        );
        setDeleteLoading(null);
     }
    } catch (error) {
      console.log(error)
    }
    finally{
      setDeleteLoading(null);
    }
  } 

  const GotoCart = () => {
    navigate("/carts");
  }


  console.log(wishlists)
  
  return (
    <>
      <div className="container" style={{ paddingTop: isMobile ? "20%":"10%" }}>
        <div className="justify-content-center">
          {loading ?   
          <div
    className="d-flex justify-content-center align-items-center gap-1"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
    <div className="spinner-grow spinner-grow-sm" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div>  : wishlists.length === 0 ? (
            <div className="text-center">
              <img
                src="/wishlist.svg"
                className="img-fluid mx-auto d-block rounded-4"
                style={{ maxWidth: "auto", maxHeight: "auto" }}
              />
              <h5>OOPS!</h5>
              <small>Your wishlist is currently empty</small>
              <br />
              <Button startIcon={<FaArrowLeftLong/>} variant="outlined" sx={{ marginTop: "15px" }} onClick={home}>
                Explore FF
              </Button>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-body">
                    <h4 className="mb-4 pt-2">Your Whishlist</h4>
                    {wishlists.map((c, index) => {
                      const isLoading = deleteLoading === c._id;
                      const load = movetocartLoading === c.variant_id
                      return (
                        <div className="card mb-3" key={index}>
                          <div className="card-body">
                            <div className="row d-flex align-items-center">
                              <div className="col-12 col-md-2 text-center mb-2 mb-md-0">
                                <img className="img-fluid" src={c.product?.variant?.image[0]} style={{ maxWidth: isMobile ? "30%":"60%", cursor: "pointer"}} onClick={ ()=> {navigate(`/product/view/${c.product_id}`)}}/>
                              </div>
                              <div className="col-12 col-md-7">
                                <p style={{ fontSize: isMobile ? "14px":"15px", marginBottom: "5px"}}>
                                  {c.product.brand.toUpperCase()}, {c.product.name}, {c.product?.variant?.qty ? `${c.product?.variant?.qty} Capsules` : c.product?.variant?.weight > 999 ? `${c.product?.variant?.weight/1000}Kg` : `${c.product?.variant?.weight}g`}{" "}
                                  {c.product?.variant?.flavour && `, ${c.product?.variant?.flavour}`}
                                </p>
                                <h5 style={{ display: "inline", marginRight: "3%" }}>Price: ₹{c.product?.variant?.price}</h5>
                                <h6 style={{ color: "#50C878", display: "inline", fontSize: isMobile && "14px" }}>( You Saved ₹{Number(c.product?.variant?.mrp - c.product?.variant?.price)} )</h6>
                                {!carts.some( ct => ct.variant_id === c.variant_id) ? <p   style={{
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "12px",
    cursor: "pointer",
  }}
  className="justify-content-start justify-content-md-start" onClick={(e) => { AddtoCart(c._id, c.product_id, c.product.variant._id, c.product.variant.price, c.product.variant.weight, c.product.variant.flavour, c.product.variant.mrp, c.product.variant.image) }}>
                                     <IconButton sx={{ backgroundColor: "#EEEEEE" }}>
                                      {load ? <RiLoader2Line  style={{ color: "grey", fontSize: "18px" }}/> :<IoBagCheck style={{ color: "grey", fontSize: "18px" }}/>}</IconButton>
                                       {load ? "Moving...":"Move to cart"}
                                </p> :
                                <p   style={{
                                  cursor:"pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "12px",
  }}
  className="justify-content-start justify-content-md-start" onClick={ GotoCart }>
                                     <IconButton sx={{ backgroundColor: "#EEEEEE" }}><IoBagCheck style={{ color: "grey", fontSize: "18px" }}/></IconButton>
                                       Go to cart
                                </p>}
                              </div>
                              <div className="col-12 col-md-3 d-flex justify-content-md-end align-items-md-top gap-2 mt-2 mt-md-0">
                                <div><b>Added</b> on {c.date} |</div>
                                <div>
                                {isLoading ? 
                                
                                   <RiLoader2Line style={{ fontSize: "20px", color: "dark grey"}}/>
                                 :
                                
                                  <RiDeleteBin6Line onClick={ () => Delete(c._id) } style={{ fontSize: "20px", color: "dark grey", cursor: "pointer"}}/>
                                }
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    
                 })
                }
                  </div>
                </div>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </>
  );
}
