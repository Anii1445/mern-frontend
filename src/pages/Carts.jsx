import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import ButtonGroup from "@mui/material/ButtonGroup";
import { RiLoader2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiHeartDuotone } from "react-icons/pi";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Box from '@mui/material/Box';
import { IoMdInformationCircleOutline } from "react-icons/io";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { BsBoxSeam } from "react-icons/bs";
import Tooltip from "@mui/material/Tooltip";
import { setCartTotal, setOrderInfo } from "../store/checkoutSlice";
import { useDispatch } from "react-redux";
import { IoWarningOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "../css/wave.css"
import "../css/confirmAlert.css";
const API = import.meta.env.VITE_API_URL;
import { useTheme, useMediaQuery } from "@mui/material";


export default function Carts() {
  const { user, token, isLoggedIn, products } = useAuth();
  const [carts, setCarts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const steps = [
     'Cart',
     'Add address',
     'Payment',
    ];

  const [wishlistLoad, setWishLoad] = useState(null);

  const getJoinCartByUserID = async () => {
    setLoading(true);
    if (isLoggedIn) {
      try {
        const response = await fetch(
          `${API}/api/auth/getJoinCartByUserID/${user.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setLoading(false);
          setCarts(data);
          dispatch(setCartTotal(data));
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
  };

  console.log(carts)

  const minus = (Id) => {
    setCarts(
      carts.map((c) =>
        c._id === Id && c.product_qty > 1
          ? { ...c, product_qty: Number(c.product_qty) - 1 }
          : c
      )
    );
  };


  const plus = (Id) => {
    setCarts(
      carts.map((c) =>
        c._id === Id ? { ...c, product_qty: Number(c.product_qty) + 1 } : c
      )
    );
  };


  useEffect(() => {
    if(user){
      getJoinCartByUserID();
    }
  }, [user]);

  const home = () => {
    navigate("/");
  };

  const cartTotalMRP = carts.reduce(
    (acc, item) => acc + item.product_mrp * item.product_qty, 0 );

  const cartTotalPRICE = carts.reduce(
    (acc, item) => acc + item.product_price * item.product_qty, 0 ); 


  const Delete = async (cart_id) => {
    
    try {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui p-5 rounded" 
            style={{ backgroundColor: "#F0F8FF", padding: isMobile ? "12px" : "30px",
                   width: isMobile ? "80%" : "400px", margin: "0 auto",  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)"}}>
              <h3><IoWarningOutline color="red"/> Are you sure?</h3>
              <p>You want to remove this item from the cart?</p>
              <Button
                variant="outlined"
                size={isMobile ? "small":"medium"}
                sx={{ marginRight: "2%" }}
                onClick={onClose}
                startIcon={<RxCross2/>}
              >
                No
              </Button>
              <Button
                size={isMobile ? "small":"medium"}
                variant="contained"
                onClick={async () => {
                  try{
                  const response = await fetch(
                    `${API}/api/auth/deleteCartsItemsByID`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        _id: cart_id,
                        user_id: user.userId,
                      }),
                    }
                  );

                  if(response.ok){
                  onClose();
                  toast.success("Item Deleted", {
                        position: "top-center",
                        autoClose: 2000, 
                        style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
                  })
                  getJoinCartByUserID();
                  }}catch{
                    console.log("error")
                  }
                }}
                startIcon={<IoMdCheckmark/>}
              >
               Delete
              </Button>
            </div>
          );
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkout = (cartTotalMRP, cartTotalPRICE, cartProducts) => {
    dispatch(setOrderInfo({cartTotalMRP, cartTotalPRICE, cartProducts}))
    navigate("/checkout");
  }



   // ---------------------- Wishlist ---------------------------- //

    const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let fullDate = `${day} ${months[month]} ${year}`;

   
     const [ApiWishlists, setApiWishlists] = useState([]);
     const getWishlists = async () => {
       try {
         const response = await fetch(
           `${API}/api/auth/allWishlistsByID/${user.userId}`,
           {
             method: "GET",
             headers: {
               Authorization: `Bearer ${token}`,
             },
           }
         );
   
         if(response.ok){
         setApiWishlists(await response.json())
        }
        
       } catch (error) {
         console.log(error);
       }
     };

   
  const toggleWishlist = (productId, variant_id) => {
   
    if (!isLoggedIn) {
      toast.warning("Please login!", {
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
      return;
    }

  const exists = ApiWishlists.some(
    a => a.variant_id === variant_id
  );

  if (exists) {
    setApiWishlists(prev =>
      prev.filter(
        a =>
          !(
            a.variant_id === variant_id
          )
      )
    );
    WishListDelete(variant_id);
  } else {
    setApiWishlists(prev => [
      ...prev,
      { variant_id: variant_id}
    ]);
    Save(productId, variant_id);
  }
};


  const WishListDelete = async (variant_id) => {
    setWishLoad(variant_id)
     try {
      const response = await fetch(
        `${API}/api/auth/deleteWishlistByProductID`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.userId,
            variant_id: variant_id
          
          }),
        }
      );

      if (response.ok) {
        setWishLoad(null);
            toast.error("Removed from Wishlist!", {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             });
           }

    } catch (error) {
      console.log(error);
    }finally{
      setWishLoad(null)
    }
  };


  const Save = async (p_id, variant_id) => {
    setWishLoad(variant_id)
      try {
          const response = await fetch(
            `${API}/api/auth/wishlist`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: user.userId,
                product_id: p_id,
                variant_id: variant_id,
                date: fullDate
              }),
            }
          );
  
          if (response.ok) {
            setWishLoad(null)
            toast.success("Added to Wishlist!", {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             });
           }
      } catch (error) {
        console.log(error);
      }
      finally{
        setWishLoad(null)
      }
    };
   
    useEffect(() => {
       if (user && user.userId) {
         getWishlists();
    }
  }, [user]);

  


  return (
    <>
      <div className="container" style={{ paddingTop: isMobile ? "20%" : "10%" }}>
        <div className="justify-content-center">
          {loading ? <div  className="d-flex justify-content-center align-items-center gap-2" style={{ minHeight: "clamp(300px, 70vh, 800px)" }}>
                  <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>
                </div> : 
          carts.length === 0 ? (
            <div className="text-center">
              <img
                src="/empty-cart.svg"
                className="img-fluid mx-auto d-block rounded-4"
                style={{ maxWidth: "auto", maxHeight: "auto" }}
              />
              <h5>Hey, it feels so light!</h5>
              <small>There is nothing in your bag. Let's add some items</small>
              <br />
              <Button
                variant="outlined"
                sx={{ marginTop: "15px" }}
                onClick={home}
                startIcon={<FaArrowLeftLong/>}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="row">
              <div className="col-12 col-md-8">
                 <Box sx={{ width: '100%', marginBottom: "3%"}}>
      <Stepper activeStep={0} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
                <div className="card" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}} >
                  <div className="card-body">
                    <h5 className="mb-4 pt-2">Shopping Cart</h5>
                    {carts.map((c, index) => {
                      return (
                        <div className="card mb-3" key={index} >
                          <div className="card-body">
                            <div className="row align-items-start">
                              <div className="col-4 col-md-2 text-center align-self-center">
                                <img src={c.product_img[0]}  className="img-fluid" style={{ maxWidth: "80%", cursor: "pointer"}} onClick={ ()=> {navigate(`/product/view/${c.product_id}`)}}/>
                              </div>
                              <div className="col-8 col-md-8">
                                <p style={{ fontSize: "15px", marginBottom: "5px"}}>
                                  {c.product.brand}, {c.product.name}, {c.product_weight > 999 ? `${c.product_weight/1000}Kg` : `${c.product_weight}g`}, {c.product_flavour}
                                </p>
                                <h5 style={{ display: "inline", marginRight: "4%" }}>₹{(c.product_price * c.product_qty).toLocaleString("en-IN")}</h5>
                                <p style={{ display: "inline", color:"grey" }}>MRP: <del>₹{(c.product_mrp * c.product_qty).toLocaleString("en-IN")}</del></p>
                                <h6 style={{ display: "inline", marginLeft: "4%", color: "#50C878", fontSize: isMobile && "15px" }}>( You Saved ₹{(c.product_mrp * c.product_qty - c.product_price * c.product_qty).toLocaleString("en-IN")} )</h6>
                                <div><ButtonGroup
                                size="small"
                                  variant="outlined"
                                  aria-label="Basic button group"
                                  sx={{
                                     
    mt: 1,
    width: { xs: "100%", md: "auto" }
                                  }}
                                >
                                  <Button onClick={() => minus(c._id)}>
                                    -
                                  </Button>
                                  <Button variant="outlined">
                                    {c.product_qty}
                                  </Button>
                                  <Button onClick={() => plus(c._id)}>+</Button>
                                </ButtonGroup>
                                </div>
                              </div>
                              <div className="col-12 col-md-2 d-flex justify-content-end gap-3 mt-2 mt-md-0">
                                <RiDeleteBin6Line
                                  onClick={() => Delete(c._id)}
                                  style={{
                                    fontSize: "20px",
                                    color: "grey",
                                    cursor: "pointer",
                                  }}
                                />
                                {wishlistLoad ? <RiLoader2Line style={{
                                    fontSize: "20px",
                                    cursor: "pointer",
                                  }}/> :
                                <PiHeartDuotone
                                  style={{
                                    fontSize: "20px",
                                    color: ApiWishlists?.some(a => a.variant_id === c.variant_id)
                                     ? "red" : "grey",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {toggleWishlist(
                                    c.product_id,
                                    c.variant_id
                              );
                            }} 
                                />}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4 mt-4 mt-md-0">
                <div className="card" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}}>
                  <div className="card-body">
                    <h4><BsBoxSeam style={{ marginRight: "3%" }}/>Order Summary ({carts.length} Items)</h4>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7%"}}>
                        <p>Total MRP</p>
                        <h6 style={{ textAlign: "end" }}>₹{cartTotalMRP.toLocaleString("en-IN")}</h6>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>Discount
                          <Tooltip title={`FF Discount -₹${Number(cartTotalMRP - cartTotalPRICE).toLocaleString("en-IN")}`} arrow>
                                                <IoMdInformationCircleOutline style={{ fontSize: "20px", cursor:"pointer", marginLeft: "5px" }} />
                          </Tooltip>
                        </p>
                        <h6 style={{ textAlign: "end", color: "#50C878" }}>-₹{(cartTotalMRP - cartTotalPRICE).toLocaleString("en-IN")}</h6>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between"}}>
                        <p>Convenience Fee
                          <Tooltip title="Delivery Charges FREE" arrow>
                                                <IoMdInformationCircleOutline style={{ fontSize: "20px", cursor: "pointer", marginLeft: "5px" }}  />
                          </Tooltip>
                        </p>
                        <h6 style={{ textAlign: "end" }}>
                          {cartTotalMRP > 399 ? "FREE" : 50}
                        </h6>
                      </div>
                    
                    <hr />

                      <div style={{ display: "flex", justifyContent: "space-between"}}>
                        <h5>Payable Amount</h5>
                        <h5 style={{ textAlign: "end" }}>
                          ₹{cartTotalPRICE ? (cartTotalPRICE + 0).toLocaleString("en-IN") : (cartTotalPRICE + 50).toLocaleString("en-IN")}
                        </h5>
                      </div>
                      <div style={{ backgroundColor: "lightgreen", padding: "4px 10px 4px 10px", borderRadius: "6px"}} className="saving-wave">
                        <small style={{ color: "#3D3C3A"}}><img src="/total-savings-coin.svg" style={{ marginRight: "5px" }}/>Yay! You will Save <strong>₹{(cartTotalMRP - cartTotalPRICE).toLocaleString("en-IN")}</strong> on this order </small>
                      </div>

                    </div>
                </div>
                {!isMobile &&
                <Button variant="contained" size="large" fullWidth sx={{ marginTop: "5%" }} startIcon={<FaArrowRightLong />} onClick={()=>checkout(cartTotalMRP, cartTotalPRICE, carts)}>
                        Proceed To Checkout 
                </Button>}
              </div>
            </div>
          )}
        </div>

         {isMobile && carts.length > 0 && (
          <div className="mobile-fixed-buybar">
                    <Button
                      variant="contained" fullWidth
                      startIcon={<FaArrowRightLong />}
                      onClick={()=>checkout(cartTotalMRP, cartTotalPRICE, carts)}
                      size="large"
                    >
                        Checkout ₹{cartTotalPRICE ? (cartTotalPRICE + 0).toLocaleString("en-IN") : (cartTotalPRICE + 50).toLocaleString("en-IN")}

                    </Button>
          </div>)}
        
      </div>

      {/* <!-- Modal --> */}
      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">
                Modal title
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
