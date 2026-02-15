import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth-ContextAPI";
import { Divider } from "@mui/material";
import {Tooltip} from "@mui/material";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { BsBoxSeam } from "react-icons/bs";
const API = import.meta.env.VITE_API_URL;
import { useTheme, useMediaQuery } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";


export default function OrderDetails(){

    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(null);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(()=> {
        const fetchOrderDetails = async () => {
            setIsLoading(true)
            try {
            const response = await fetch(`${API}/api/auth/getOrderById/${id}`,{
                method: "GET",
                headers: {
                             Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                }
            });

            if(response.ok){
                const data = await response.json();
                setOrderDetails(data[0]);
                setIsLoading(false);
            }
                
            } catch (error) {
                console.log(error)
            }
            finally{
                setIsLoading(false);
            }
        }

        if(id){
           fetchOrderDetails();
        }

    },[id]);

    console.log(orderDetails)

    const copyLink = (a) => {
         navigator.clipboard.writeText(a);
          toast.success("Copied",{
          position: "top-center",
          autoClose: 2000,
         })
      };

    return(
            <>
            <div className="container" style={{ paddingTop: isMobile ? "5%":"10%"}}>
                {isLoading ? <div
    className="d-flex justify-content-center align-items-center gap-2"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
    <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div> :
                <div className="justify-content-center">
                    <div className="card mb-1 shadow-sm">
                    <div className="card-body">
                        <div className="d-flex align-items-center flex-md-row gap-2 justify-content-between align-items-md-center">
                                    <h4 className="mb-0">Order Details</h4>
                                    <div>
                        <Button startIcon={<IoArrowBack/>} variant="contained" onClick={() => {navigate(`/myaccount/myorders`)}}>
                            Back
                        </Button> 
                     </div>
</div>

                        </div>
                        </div>  
                    <div className="row align-items-stretch g-2">
                        <div className="col-12 col-md-6">
                            <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div>Order ID: <strong>{`FF-${orderDetails?._id?.toString().slice(0,13).toUpperCase()}`}</strong> <MdOutlineContentCopy style={{ cursor: "pointer" }}onClick={() => copyLink(orderDetails?._id)}/></div>
                                <div>Order On: <IoCalendarOutline/> <strong>{new Date(orderDetails?.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}</strong></div>
  <div>Items: <strong>{orderDetails?.items?.length}</strong></div>
  <Divider style={{ backgroundColor: "black", marginBottom: "15px", marginTop: "15px"}}/>
  <div>Order Total: <strong>₹{orderDetails?.totalOrderPrice}</strong></div>
  <div>Paid Via: <strong>{orderDetails?.paymentMode}</strong></div>
    <Divider style={{ backgroundColor: "black", marginBottom: "15px",  marginTop: "15px"}}/>
<div>
    Deliver Address:
    </div>
<div>    
<b>
    {orderDetails?.deliverAddress?.full_name}, {orderDetails?.deliverAddress?.house_no},<br/> {orderDetails?.deliverAddress?.landmark}, 
    {" "}{orderDetails?.deliverAddress?.area},<br/> {orderDetails?.deliverAddress?.city.toUpperCase()}, {orderDetails?.deliverAddress?.stateInfo?.name.toUpperCase()} - 
    {orderDetails?.deliverAddress?.pincode}<br/>
</b><br/>
<p style={{ marginBottom: "0px" }}>Phone: <b>+91 {orderDetails?.deliverAddress?.phone}</b></p>
<p>Email: <b>{user?.email}</b></p></div>
                            </div>
                        </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div style={{ marginBottom: "35px" }}><h5><BsBoxSeam style={{ marginRight: "10px", fontSize: "25px" }}/> Order Summary ({orderDetails?.items?.length} Items)</h5></div>
                                <div className="d-flex justify-content-between">
                                    <p>Total Price</p>
                                    <b>₹{orderDetails?.totalOrderMRP}</b>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p>Discount on MRP<Tooltip
                      title={`FF Discount -₹${Number(orderDetails?.totalOrderMRP - orderDetails?.totalOrderPrice).toLocaleString("en-IN")}`}
                      arrow
                    >
                      <IoMdInformationCircleOutline
                        style={{
                          fontSize: "20px",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                      />
                    </Tooltip></p>
                                    <b style={{ color: "green" }}>₹{orderDetails?.totalOrderMRP - orderDetails?.totalOrderPrice}</b>
                                </div>
                                 <div className="d-flex justify-content-between">
                                    <p>Convenience Fee<Tooltip title="Delivery Charges FREE" arrow>
                                                          <IoMdInformationCircleOutline
                                                            style={{
                                                              fontSize: "20px",
                                                              cursor: "pointer",
                                                              marginLeft: "5px",
                                                            }}
                                                          />
                                                        </Tooltip></p>
                                    <p>₹0</p>
                                </div>
                                <Divider style={{ backgroundColor: "black", marginBottom: "15px"}}/>
                                 <div className="d-flex justify-content-between">
                                    <p>Total Amount</p>
                                    <b>₹{orderDetails?.totalOrderPrice}</b>
                                </div>
                                <div style={{ backgroundColor: "lightgreen", padding: "4px 10px 4px 10px", borderRadius: "6px"}} className="saving-wave">
                                   <small style={{ color: "#3D3C3A"}}><img src="/total-savings-coin.svg" style={{ marginRight: "5px" }}/>Yay! You will Save <strong>₹{(orderDetails?.totalOrderMRP - orderDetails?.totalOrderPrice).toLocaleString("en-IN")}</strong> on this order </small>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="col-12 mt-2">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    {orderDetails?.items?.map((o, index) => (
                                                                     
                                    <div className="row d-flex align-items-center g-3">
                                    <div className="col-md-1 d-flex justify-content-center border rounded-3 py-3">
                                        <img  className="img-fluid" src={o?.variant?.image[0]} style={{ maxWidth: "50px", cursor: "pointer" }}  onClick={ ()=> {navigate(`/product/view/${o?.product?._id}`)}}/>
                                    </div>
                                    <div className="col-9 col-md-11">
                                        <div><small>{o?.product?.name}</small></div>
                                        <div style={{ color: "grey" }}><small>{o?.variant?.weight > 999 ? `${o?.variant?.weight/1000}Kg` : `${o?.variant?.weight}g`} | {o?.variant?.flavour}</small></div>
                                        <div style={{ color: "grey" }}><small>Qty: {o?.qty}</small></div>
                                    </div>    
                                      {index < orderDetails?.items?.length - 1 && <Divider sx={{ backgroundColor: "black", margin: "10px 0"}}/>}

                                    </div>

                                   ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
    
    
            </>
    )
}