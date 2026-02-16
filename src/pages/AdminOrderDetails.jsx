import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth-ContextAPI";
import { Divider } from "@mui/material";
import {Tooltip} from "@mui/material";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsBoxSeam } from "react-icons/bs";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
const API = import.meta.env.VITE_API_URL;
import { FaArrowLeft } from "react-icons/fa6";

export default function AdminOrderDetails(){

    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=> {
        const fetchOrderDetails = async () => {
            setIsLoading(true);
            try {
            const response = await fetch(`${API}/api/admin/getOrderById/${id}`,{
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
            }finally{
                setIsLoading(false)
            }
        }

        if(id){
           fetchOrderDetails();
        }

    },[id]);

    console.log(orderDetails)

    return(
            <>
            <div className="container">
                <div className="justify-content-center">
                    {isLoading ?  <div
    className="d-flex justify-content-center align-items-center gap-1"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
    <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div>  : <>
                    <div className="card mb-1 shadow-sm">
                    <div className="card-body">
<div className="d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0">Order Details</h4>
                                    <div>
                        <Button variant="contained" onClick={() => {navigate(`/admin/userOrders/${orderDetails?.user_id}`)}} startIcon={<FaArrowLeft/>}>
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
                                <div>Order ID: <strong>#{orderDetails?._id?.toUpperCase()}</strong> <MdOutlineContentCopy style={{ cursor: "pointer" }}/></div>
                                <div>Order On: <IoCalendarOutline/> <strong>{new Date(orderDetails?.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}</strong></div>
  <div>Items: <strong>{orderDetails?.items?.length}</strong></div>
  <Divider style={{ backgroundColor: "black", marginBottom: "15px", marginTop: "15px"}}/>
  <div>Order Total: <strong>₹{orderDetails?.totalOrderPrice}</strong></div>
  <div>Paid Via: <strong>{orderDetails?.paymentMode}</strong></div>
  <div>Order Status: <strong>{orderDetails?.orderStatus}</strong></div>
    <Divider style={{ backgroundColor: "black", marginBottom: "15px",  marginTop: "15px"}}/>
<div>
    Deliver Address:
    </div>
<div>    
<strong>
    {orderDetails?.deliverAddress?.full_name}, {orderDetails?.deliverAddress?.house_no}, {orderDetails?.deliverAddress?.landmark}, 
    {" "}{orderDetails?.deliverAddress?.area},<br/> {orderDetails?.deliverAddress?.city.toUpperCase()}, {orderDetails?.deliverAddress?.stateInfo?.name.toUpperCase()} - 
    {orderDetails?.deliverAddress?.pincode}
</strong>
<p>Phone: <b>+91 {orderDetails?.deliverAddress?.phone}</b></p></div>
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
                                 <div className="d-flex justify-content-between mb-2">
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
                                <Divider style={{ backgroundColor: "black", marginBottom: "20px"}}/>
                                 <div className="d-flex justify-content-between">
                                    <p>Total Amount</p>
                                    <b>₹{orderDetails?.totalOrderPrice}</b>
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
                                        <img src={o?.variant?.image[0]}  className="img-fluid" style={{maxWidth: "50px"}}/>
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

                               </> }
                </div>
            </div>
    
    
            </>
    )
}