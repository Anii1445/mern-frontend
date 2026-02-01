import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { IoBagCheck } from "react-icons/io5";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Carts from "./Carts";
import { setCartTotal } from "../store/checkoutSlice";
const API = import.meta.env.VITE_API_URL;

export default function Whislist() {
  const { user, token, isLoggedIn, products } = useAuth();
  const [wishlists, setWishlists] = useState([]);
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);

  const { pathname } = useLocation();

  useEffect(()=>{
     window.scrollTo(0,0);
  },[pathname]);


   const getCartByUser = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch(
          `${API}/api/auth/getUserCart/${user.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setCarts(data);
          dispatchEvent(setCartTotal(data))
        }
      } catch (error) {
        console.log(error);
      }
    }
  };


  const getWishlists = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch(`${API}/api/auth/UserWishlistJoin/${user.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setWishlists(await response.json());
        }
      } catch (error) {
        console.log(error);
      }
    }
  };


  useEffect(() => {
    if(user && user.userId){
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
            product_weightUnit: product_weightUnit,
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
             });
          Delete(wishlist_id);
          setWishlists(prev =>
             prev.filter(item => item._id !== wishlist_id)
          );

        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.warning("Please Login for better experience!", {
                position: "top-center",
                autoClose: 2000, 
             });
      navigate("/login");
    }
  }
  

  const Delete = async (wishlist_id) => {
  
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
       setWishlists(prev =>
              prev.filter(item => item._id !== wishlist_id)
        );
     }
    } catch (error) {
      console.log(error)
    }
  } 

  const GotoCart = () => {
    navigate("/carts");
  }

  
  return (
    <>
      <div className="container" style={{ marginTop: "10%" }}>
        <div className="justify-content-center">
          {wishlists.length === 0 ? (
            <div className="text-center">
              <img
                src="/wishlist.svg"
                className="img-fluid mx-auto d-block rounded-4"
                style={{ maxWidth: "auto", maxHeight: "auto" }}
              />
              <h5>OOPS!</h5>
              <small>Your wishlist is currently empty</small>
              <br />
              <Button variant="outlined" sx={{ marginTop: "15px" }} onClick={home}>
                Explore FF
              </Button>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-body">
                    <h5 className="mb-4 pt-2">Your Whishlist</h5>
                    {wishlists.map((c, index) => {

                      return (
                        <div className="card mb-3" key={index}>
                          <div className="card-body">
                            <div className="row">
                              <div className="col text-center">
                                <img className="img-fluid" src={c.product?.variant?.image[0]} style={{ maxWidth: "60%", cursor: "pointer"}} onClick={ ()=> {navigate(`/product/view/${c.product_id}`)}}/>
                              </div>
                              <div className="col-7">
                                <p style={{ fontSize: "15px", marginBottom: "5px"}}>
                                  {c.product.brand.toUpperCase()}, {c.product.name}, {c.product?.variant?.weight > 999 ? `${c.product?.variant?.weight/1000}Kg` : `${c.product?.variant?.weight}g`}{" "}
                                  {c.product_flavour}
                                </p>
                                <h5 style={{ display: "inline", marginRight: "3%" }}>Price: ₹{c.product?.variant?.price}</h5>
                                <h6 style={{ color: "#50C878", display: "inline" }}>( You Saved ₹{Number(c.product?.variant?.mrp - c.product?.variant?.price)} )</h6>
                                {!carts.some( ct => ct.variant_id === c.variant_id) ? <p style={{ fontSize: "15px", display: "flex", cursor: "pointer",
                                   alignItems: "center", gap: "5px", marginTop: "4%" }} onClick={(e) => { AddtoCart(c._id, c.product_id, c.product.variant._id, c.product.variant.price, c.product.variant.weight, c.product.variant.flavour, c.product.variant.mrp, c.product.variant.image) }}>
                                     <IconButton sx={{ backgroundColor: "#EEEEEE" }}><IoBagCheck style={{ color: "grey", fontSize: "18px" }}/></IconButton>
                                       Move to cart
                                </p> :
                                <p style={{ fontSize: "15px", display: "flex", cursor: "pointer",
                                   alignItems: "center", gap: "5px", marginTop: "4%" }} onClick={ GotoCart }>
                                     <IconButton sx={{ backgroundColor: "#EEEEEE" }}><IoBagCheck style={{ color: "grey", fontSize: "18px" }}/></IconButton>
                                       Go to cart
                                </p>}
                              </div>
                              <div className="col-3 text-end align-items-center gap-1">
                                <b>Added</b> on {c.date} |
                                <RiDeleteBin6Line onClick={ () => Delete(c._id) } style={{ marginLeft: "3px", fontSize: "20px", color: "dark grey", cursor: "pointer"}}/>
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
