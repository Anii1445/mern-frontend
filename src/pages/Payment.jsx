import Divider from "@mui/material/Divider";
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { FaCheckCircle } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BsBoxSeam } from "react-icons/bs";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { use, useState } from "react";
import  Tooltip  from '@mui/material/Tooltip';
import Button from "@mui/material/Button";
import { FiPlus } from "react-icons/fi";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setDeliverAddress } from "../store/checkoutSlice";
import swal from 'sweetalert';
import confetti from "canvas-confetti";
const API = import.meta.env.VITE_API_URL;
import { useTheme, useMediaQuery } from "@mui/material";
import { IoMailOutline } from "react-icons/io5";


export default function Payment() {

    const { user, token } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orderInfo, deliverAddress } = useSelector((state) => state.checkout);
    const [loadingAddress, setLoadingAddress] = useState(false);
    const theme = useTheme();  
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const steps = [
     'Cart',
     'Add address',
     'Payment',
    ];

    const fireConfetti = () => {
      confetti({
         particleCount: 250,
         spread: 80,
         origin: { y: 0.6 },
      });
    };

    const [userAddress, setUserAddress] = useState({})
    const getUserAddress = async() => {
      setLoadingAddress(true)
      try {
        const response = await fetch(`${API}/api/auth/getAddressByID/${deliverAddress}`,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        if(response.ok){
          setUserAddress(await response.json());
          setLoadingAddress(false);
        }
      } catch (error) {
        console.log(error)
      }
      finally{
        setLoadingAddress(false);
      }
    }

    useEffect(()=>{
      if(deliverAddress){
        getUserAddress(); 
    }},[deliverAddress]);

    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const change = () => {
      dispatch(setDeliverAddress(deliverAddress));
      navigate("/checkout");
    }

    const [UPI_Id, setUPI_Id] = useState("");
    const [upiError, setUpiError] = useState("");
    const [verifyId, setVerifyId] = useState("");
    const [disabled, setDisabled] = useState(true);

const validateUPI = (upi) => {
  const upiRegex = /^[a-zA-Z0-9.\-_]{3,}@[a-zA-Z]{3,}$/;
  return upiRegex.test(upi);
}

 const verify = () => {
        
         if(!UPI_Id.trim()){
          setUpiError("UPI ID is required");
          setVerifyId(false);
          return;
         }

          if(!validateUPI(UPI_Id))
         {
            setVerifyId(false);
            setUpiError("Invalid UPI ID");
            return;
         }

         setUpiError(<span style={{ color: "green", display: "flex", alignItems: "center" }}>
                           Verified <FaCheckCircle style={{ marginLeft: 6 }} />
                     </span>);
         setVerifyId(true);
         setDisabled(false);
         
    }


const [cardData, setCardData] = useState({
  card_name: "",
  card_no: "",
  card_expiry: "",
  card_cvv: "",
});

const [errors, setErrors] = useState({});

const handleCardChange = (e) => {
  const { name, value } = e.target;

  setCardData((prev) => ({
    ...prev,
    [name]: value,
  }));

  // clear error when user starts typing
  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};


const validateCard = () => {
  let newErrors = {};

  if (!cardData.card_name.trim()) {
    newErrors.card_name = "Name on card is required";
  }

  if (!/^\d{16}$/.test(cardData.card_no)) {
    newErrors.card_no = "Card number must be 16 digits";
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.card_expiry)) {
    newErrors.card_expiry = "Expiry must be in MM/YY format";
  }

  if (!/^\d{3}$/.test(cardData.card_cvv)) {
    newErrors.card_cvv = "CVV must be 3 digits";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

    
const handlePay = async() => {
  if (!validateCard()) return;
  // proceed with payment
  const items = orderInfo.cartProducts.map(item => ({
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_qty: item.product_qty,
    product_price: item.product_price
  }));


  try {
      const response = await fetch(`${API}/api/auth/createOrder`,{
      method: "POST",
      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_id: user.userId,
                        items,
                        totalOrderPrice: orderInfo?.cartTotalPRICE ? orderInfo?.cartTotalPRICE : orderInfo?.price,
                        totalOrderMRP: orderInfo?.cartTotalMRP ? orderInfo?.cartTotalMRP : orderInfo?.mrp,
                        paymentMode: "Card",
                        paymentStatus: "Success",
                        orderStatus: "Processing",
                        deliverAddress: userAddress

                      }),
    });

    
         if(response.ok){
               fireConfetti();
               swal({
                  title: "Order Placed🎉",
                  text: "Thank You!! Your order has been placed successfully",
                  icon: "success",
                  timer: 3500,        
                  buttons: false, 
                }).then(() => {
                 navigate("/");
              });
             }
    }
    catch (error) {
    console.log(error)
  }
};

console.log(userAddress)
const handleUPIPay = async() => {

  const items = orderInfo.cartProducts.map(item => ({
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_qty: item.product_qty,
    product_price: item.product_price
  }));


  try {
      const response = await fetch(`${API}/api/auth/createOrder`,{
      method: "POST",
      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_id: user.userId,
                        items,
                        totalOrderPrice: orderInfo?.cartTotalPRICE ? orderInfo?.cartTotalPRICE : orderInfo?.price,
                        totalOrderMRP: orderInfo?.cartTotalMRP ? orderInfo?.cartTotalMRP : orderInfo?.mrp,
                        paymentMode: "UPI",
                        paymentStatus: "Success",
                        orderStatus: "Processing",
                        deliverAddress: userAddress
                      }),
    });

         if(response.ok){
               fireConfetti();
               swal({
                  title: "Order Placed🎉",
                  text: "Thank You!! Your order has been placed successfully",
                  icon: "success",
                  timer: 3500,        
                  buttons: false, 
                }).then(() => {
                 navigate("/");
              });
        }
    }
    catch (error) {
    console.log(error)
  }
}

console.log(orderInfo)
  return (
    <>
    <div className="container justify-content-center"style={{ paddingTop : isMobile ? "20%" : "10%" }}>
      <div className="row">
          <div className="col-12 col-md-7 order-2 order-md-1">
            <Box sx={{ width: '100%', marginBottom: "3%"}}>
      <Stepper activeStep={2} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
   <div className="card mb-3 shadow-sm">
  <div className="card-body d-flex flex-column flex-md-row justify-content-md-between align-items-md-center text-md-start">
    <h6 className="mb-1 mb-md-0 me-1" style={{ fontSize: isMobile && "15px"}}>You will get Order Updates on</h6>
    <h6 className="mb-0 text-break" style={{ fontSize: isMobile && "15px"}}><IoMailOutline style={{ fontSize: isMobile ? "22px":"25px"}}/> {user?.email}</h6>
  </div>
</div>
          <div className="card" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}}>
            {loadingAddress ? <div
    className="d-flex justify-content-center align-items-center gap-2"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
   <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div> :
            <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2%" }}>  
                <h5>Delivery Address</h5>
                <Button variant="outlined" size="small" onClick={change} startIcon={<LiaExchangeAltSolid/>}>Change</Button> 
                </div> 
                <div className="row">
                  <div className="col-12 col-md-2 mb-2 mb-md-0 d-flex align-items-center" style={{ color: "#1769aa"}}>
                    <div><IoLocationSharp style={{ marginRight: "5px" }}/></div>
                    <div><b>{userAddress.address_type}</b></div>
                  </div>
                  <div className="col-12 col-md-10"> 
                   <small>
                     <strong>{userAddress.full_name}</strong>, <br/>
                     {userAddress.house_no}, {userAddress.landmark}, {userAddress.area}, {userAddress?.city?.toUpperCase()}, {userAddress?.stateInfo?.name?.toUpperCase()}, {userAddress.pincode}. 
                     Phone: +91 {userAddress.phone}
                   </small>
                  </div>
                </div>
            </div>
            }
          </div>
          <div className="card mt-3" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}}>
            <div className="card-body">
              <h5 className="mb-3">Payment Method</h5>
              <p  style={{
    display: "inline-flex",
    marginRight: isMobile ? "0" : "2%",
    marginBottom: isMobile ? "8px" : "4px",
    padding: "8px",
    cursor: "pointer",
    width: isMobile ? "100%" : "auto",
    justifyContent: "center",
    borderRadius: "4px",
    border:
      paymentMethod === "UPI"
        && `2px solid ${theme.palette.primary.main}`,
    backgroundColor:
         "#DCDCDC",
  }} onClick={()=>setPaymentMethod("UPI")}>Pay Using UPI <img src="/upi.svg" style={{ width: "40px", marginLeft: "5px"}}/><img src="https://hyugalife.com/_next/image?url=%2Fassets%2Fimages%2Ficons%2Fgpay-payment-icon.png&w=64&q=75" style={{ width: "20px", height: "20px", marginLeft: "5px"}}/> <img src="https://hyugalife.com/_next/image?url=%2Fassets%2Fimages%2Ficons%2Fphonepe-payment-icon.png&w=64&q=75" style={{  width: "20px", height: "20px", marginLeft: "5px"}}/> <img src="https://hyugalife.com/_next/image?url=%2Fassets%2Fimages%2Ficons%2Fpaytm-payment-icon.png&w=64&q=75" style={{  width: "20px", height: "20px", marginLeft: "5px"}}/></p>
              <p  style={{
    display: "inline-flex",
    marginRight: isMobile ? "0" : "2%",
    marginBottom: isMobile ? "8px" : "4px",
    padding: "8px",
    cursor: "pointer",
    width: isMobile ? "100%" : "auto",
    justifyContent: "center",
    borderRadius: "4px",
    border:
      paymentMethod === "CARD"
        && `2px solid ${theme.palette.primary.main}`,
    backgroundColor: "#DCDCDC",
  }} onClick={()=>setPaymentMethod("CARD")}>Debit/Credit Card <img src="/visa.svg" style={{ width: "40px", marginLeft: "5px"}}/><img src="/rupay.svg" style={{ width: "40px"}}/><img src="/master.svg"/></p>
              <p  style={{
    display: "inline-flex",
    marginRight: isMobile ? "0" : "2%",
    marginBottom: isMobile ? "8px" : "0",
    padding: "8px",
    cursor: "pointer",
    width: isMobile ? "100%" : "auto",
    justifyContent: "center",
    borderRadius: "4px",
    border:
      paymentMethod === "COD"
        && `2px solid ${theme.palette.primary.main}`,
    backgroundColor
        : "#DCDCDC",
  }} onClick={()=>setPaymentMethod("COD")}>Cash On Delivery <img src="/cash-money-svgrepo-com.svg" style={{ width: "20px", marginLeft: "5px"}}/></p>

              <Divider sx={{ backgroundColor: "black", marginBottom: "5%", marginTop:"2%"}}/>

              {paymentMethod === "UPI" &&
              <>
              <div className="row">
                          <div className="col-9 col-md-10  py-0">
                            <TextField name="upi_id" value={UPI_Id} label="Please enter your UPI ID" variant="standard" size="small" fullWidth 
                            onChange={(e) => {setUPI_Id(e.target.value); setUpiError(""); setVerifyId(null); setDisabled(true)}}
                            error={verifyId === false}
                            helperText={upiError}
                            placeholder="Ex: mobilenumber@upi"
                            FormHelperTextProps={{
                             style: { color: verifyId === false ? "red" : "green" }
                           }}/>
                          </div>  
                          <div className="col-3 col-md-2 my-2 py-0">
                            <Button variant="outlined" size={isMobile ? "medium" : "large"} disabled={UPI_Id ? false : true} onClick={verify}>Verify</Button>
                          </div>
              </div>
              <div>
              <Button variant="contained" fullWidth={isMobile} size={isMobile ? "medium" : "large"} disabled={disabled} sx={{marginTop: "4%"}} onClick={handleUPIPay}>Pay ₹{orderInfo?.cartTotalPRICE ? orderInfo?.cartTotalPRICE.toLocaleString("en-IN") : orderInfo?.price.toLocaleString("en-IN")}</Button>
              </div>
              </>
              }

              {paymentMethod === "CARD" && <>
              <div className="row">
                          <div className="col my-2 py-0">
                            <TextField name="card_name" value={cardData.card_name} label="Name on card" variant="standard" size="small" fullWidth 
                            onChange={handleCardChange}
                            error={!!errors.card_name}
                            placeholder="Ex: Ankit Gupta"
                             helperText={errors.card_name}/>
                          </div>
                          <div className="col my-2 py-0">
                            <TextField name="card_no" value={cardData.card_no} label="Card Number" variant="standard" size="small" fullWidth 
                            onChange={handleCardChange}
                             placeholder="Ex: 1234 5678 9123 4567"
                            error={!!errors.card_no}
                            helperText={errors.card_no}/>
                          </div>
                  </div>
                  <div className="row">
                          <div className="col my-2 py-0">
                            <TextField name="card_expiry" value={cardData.card_expiry} label="Expiry MM/YY" variant="standard" size="small" fullWidth 
                            onChange={handleCardChange}
                            error={!!errors.card_expiry}
                             placeholder="MM/YY"
                            helperText={errors.card_expiry}/>
                          </div>
                          <div className="col my-2 py-0">
                            <TextField name="card_cvv" value={cardData.card_cvv} label="CVV" variant="standard" size="small" fullWidth 
                            onChange={handleCardChange}
                             placeholder="Ex: 123"
                            error={!!errors.card_cvv}
                            helperText={errors.card_cvv}/>
                          </div>
              </div>
              <div className="mt-4">
              <Button variant="contained" fullWidth={isMobile} size="large" onClick={ handlePay } disabled={cardData ? false : true}>Pay ₹{orderInfo?.cartTotalPRICE ? orderInfo?.cartTotalPRICE.toLocaleString("en-IN") : orderInfo?.price.toLocaleString("en-IN")}</Button>
              </div>
              </>
            }

            {paymentMethod === "COD" &&
            <div>
              <Button variant="contained" fullWidth={isMobile} size={isMobile ? "medium" : "large"}>Pay via COD ₹{orderInfo?.cartTotalPRICE ? orderInfo?.cartTotalPRICE.toLocaleString("en-IN") : orderInfo?.price.toLocaleString("en-IN")}</Button>
            </div>
            }
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-5 order-2 order-md-1 mt-3">
          <div className="card" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}}>
            <div className="card-body">
              <h4><BsBoxSeam style={{ marginRight: "3%" }}/>Order Summary ({orderInfo?.cartProducts? orderInfo?.cartProducts?.length : 1} Items)</h4>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8%" }}>
                <p>Price</p>
                <p>₹{orderInfo?.cartTotalMRP ? orderInfo?.cartTotalMRP.toLocaleString("en-IN") : orderInfo?.mrp.toLocaleString("en-IN")}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between"}}>
                <p>Convenience Fee 
                    <Tooltip title="Delivery Charges FREE" arrow>
                      <IoMdInformationCircleOutline style={{ fontSize: "20px", cursor: "pointer", marginLeft: "5px" }}  />
                    </Tooltip>
                </p>
                <p>₹0</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2%" }}>
                <p>Total Discounts
                    <Tooltip title={`FF Discount -₹${orderInfo?.cartTotalMRP ? Number(orderInfo?.cartTotalMRP - orderInfo?.cartTotalPRICE).toLocaleString("en-IN") 
                        : Number(orderInfo?.mrp - orderInfo?.price).toLocaleString("en-IN")}`} arrow>
                      <IoMdInformationCircleOutline style={{ fontSize: "20px", cursor:"pointer", marginLeft: "5px" }} />
                    </Tooltip>
                </p>
                <p style={{ color: "#34A56F" }}>-₹{orderInfo?.cartTotalMRP ? Number(orderInfo?.cartTotalMRP - orderInfo?.cartTotalPRICE).toLocaleString("en-IN") 
                        : Number(orderInfo?.mrp - orderInfo?.price).toLocaleString("en-IN") }</p>
              </div>
              <Divider sx={{ backgroundColor: "black"}}/>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop:"5%" }}>
                <b>Total Amount</b>
                <b>₹{ orderInfo?.cartTotalPRICE ? orderInfo?.cartTotalPRICE.toLocaleString("en-IN") : orderInfo?.price.toLocaleString("en-IN") }</b>
              </div>
              
              <div>
                  <small style={{ color: "#179F5D"}}>You will Save ₹{orderInfo?.cartTotalMRP ? Number(orderInfo?.cartTotalMRP - orderInfo?.cartTotalPRICE).toLocaleString("en-IN") 
                        : Number(orderInfo?.mrp - orderInfo?.price).toLocaleString("en-IN")} on this order </small>
              </div>
            </div>
          </div>
        </div>
      
      </div>

    </div>


    </>
  );
}
