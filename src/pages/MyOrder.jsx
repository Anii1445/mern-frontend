import { useEffect, useState } from "react"
import { useAuth } from "../store/auth-ContextAPI"
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaHistory } from "react-icons/fa";
import "../css/scrollBar.css";
const API = import.meta.env.VITE_API_URL;
import { useTheme, useMediaQuery } from "@mui/material";


export default function MyOrder(){

    const navigate = useNavigate();
    const {user, token} = useAuth();
    const [myOrder, setMyOrder] = useState([]);

    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState("all");
    const [loading, setLoading] = useState(null);

const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  useEffect(()=>{
        const fetchOrders = async() => {
            setLoading(true);
            try {
        const response = await fetch(`${API}/api/auth/getOrderByUser/${user.userId}?months=${order}`,{
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
               }
           })

        if(response.ok){
            const data = await response.json();
            setMyOrder(data);
            setLoading(false);
        }
                
           } catch{
                console.log("error")
        }finally{
            setLoading(false);
        }
    }

     if (user?.userId) {
       fetchOrders();
      }
    },[user, token, order]);



     const copyLink = (a) => {
             navigator.clipboard.writeText(a);
              toast.success("Copied",{
              position: "top-center",
              autoClose: 2000,
             })
          };


    return (
        <>
        <div className="container" style={{ paddingTop: isMobile ? "5%" : "10%"}}>
            <div className="justify-content-center">
                {loading ? <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
    <div className="spinner-grow text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div> : myOrder?.length === 0 ? (
                <div className="text-center">
              <img
                src="/wishlist.svg"
                className="img-fluid mx-auto d-block rounded-4"
                style={{ maxWidth: "auto", maxHeight: "auto" }}
              />
              <h5>OOPS!</h5>
              <small>Currently there is No Order Placed!</small>
              <br />
              <Button variant="outlined" sx={{ marginTop: "15px" }} onClick={() => navigate("/")}>
                Explore FF
              </Button>
            </div>) : (
                <> 
                <div className="card mb-1 shadow-sm">
                    <div className="card-body d-md-flex flex-md-row gap-2 justify-content-md-between align-items-md-center">
                        <div><h4 className="mb-0">My Order ({myOrder?.length})</h4></div>
                        <div style={{ marginTop: isMobile && "6px"}}>
                        <Button variant="outlined" onClick={handleClickOpen} startIcon={<FaHistory/>}>Sort By Order Date</Button>
                        </div>
                        </div>
                        </div>   
                         
                          <div>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 320 }}>
              <InputLabel htmlFor="demo-dialog-native" size="small" >Select Order Date</InputLabel>
              <Select
                native
                value={order}
                onChange={(e)=>{setOrder(e.target.value)}}
                input={<OutlinedInput label="Select Order Date" id="demo-dialog-native" />}
                size="small"
              >
                <option value="all">All</option>
                <option value="3">Last 3 months</option>
                <option value="6">Last 6 months</option>
                <option value="9">Last 9 months</option>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button  variant="contained" onClick={handleClose}>Cancel</Button>
          <Button variant="outlined" onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>

<div className="order-scroll">
                        {myOrder.map((o) => (
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <div><small>Order ID: <strong>{`FF-${o?._id?.toString().slice(0,13).toUpperCase()}`}</strong></small> <MdOutlineContentCopy style={{ cursor: "pointer" }}onClick={() => copyLink(o?._id)}/></div>
                                <div><strong style={{ fontSize: "15px" }}>{o.items.length} Item | ₹{o.totalOrderPrice}</strong></div>
                                <div style={{ marginBottom: "10px", fontSize: "15px"}}><NavLink to={`/myaccount/orderDetails/${o._id}`}>View Details</NavLink></div>
                                {o.items.map((i) => (
                                <div className="card mb-2">
                                    <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-3 col-md-1 text-center">
                                        <img className="img-fluid" src={i.variant.image[0]} style={{ maxwidth: "50px", cursor: "pointer"}} onClick={ ()=> {navigate(`/product/view/${i?.product?._id}`)}}/>
                                    </div>
                                    <div className="col-9 col-md-11">
                                        <div><small  className="d-block">{i.product.name}</small></div>
                                        <div><small className="text-muted">{i.variant.weight > 999 ? `${i.variant.weight/1000}Kg` : `${i.variant.weight}g`}, {i.variant.flavour}</small></div>
                                    </div>    
                                </div>
                                </div>
                                </div>
                                
                                ))}
                            </div>
                        </div>
                       
                        
                         ))}
                          </div>
            </>
                 )}     
        </div>
        </div>
        </>
    )
}