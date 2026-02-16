import { useEffect, useState } from "react"
import { useAuth } from "../store/auth-ContextAPI"
import { NavLink, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdOutlineContentCopy } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
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

export default function AllUserOrders(){

    const navigate = useNavigate();
    const {token} = useAuth();
    const { id } = useParams();
    const [myOrder, setMyOrder] = useState([]);
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState("all");
    const [isLoading, setIsLoading] = useState(false);

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
          setOpen(false);
      };


      const [ok,setOk] = useState("");

    useEffect(()=>{
        const fetchOrders = async() => {
            setIsLoading(true);
            try {
        const response = await fetch(`${API}/api/admin/getOrderByUser/${id}?months=${order}`,{
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
               }
           })

        if(response.ok){
            const data = await response.json();
            setMyOrder(data);
            setIsLoading(false);
        }
                
           } catch (error) {
                console.log(error)
        }finally{
            setIsLoading(false);
        }
    }

     if (id) {
       fetchOrders();
      }
    },[id, ok]);

    return (
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

  </div>  : myOrder?.length === 0 ? (
                <div className="text-center">
              <img
                src="/wishlist.svg"
                className="img-fluid mx-auto d-block rounded-4"
                style={{ maxWidth: "auto", maxHeight: "auto" }}
              />
              <h5>NOT FOUND!!</h5>
              <small>Currently there is No Order from this User</small>
            </div>) : (
                <>
                <div className="card mb-1">
                   <div className="card-body d-flex justify-content-between align-items-center">
                                           <div><h4>My Order ({myOrder?.length})</h4></div>
                                           <div>
                                           <Button variant="outlined" onClick={handleClickOpen} startIcon={<FaHistory/>}>Sort By Order Date</Button>
                                           </div>
                                           </div>
                                
                        </div>    
                         <div>
                              <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                                <DialogContent>
                                  <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    <FormControl sx={{ m: 1, minWidth: 220 }}>
                                      <InputLabel htmlFor="demo-dialog-native" size="small">Select Order Date</InputLabel>
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
                                  <Button variant="outlined" onClick={() => {handleClose(); setOk(order);}}>Ok</Button>
                                </DialogActions>
                              </Dialog>
                            </div> 

<div className="order-scroll">
                        {myOrder.map((o) => (
                    
                        <div className="card mb-3 shadow-sm">
                            <div className="card-body">
                                <div><small>Order ID: <strong>#{o?._id?.toUpperCase()}</strong></small> <MdOutlineContentCopy style={{ cursor: "pointer" }}/></div>
                                <div><strong style={{ fontSize: "15px" }}>{o.items.length} Item | ₹{o.totalOrderPrice}</strong></div>
                                <div style={{ marginBottom: "10px", fontSize: "15px"}}><NavLink to={`/admin/userOrderDetails/${o._id}`}>View Details</NavLink></div>
                                {o.items.map((i) => (
                                <div className="card mb-2">
                                    <div className="card-body">
                                <div className="row d-flex align-items-center g-3">
                                    <div className="col-md-1 text-center">
                                        <img  className="img-fluid" src={i.variant.image[0]} style={{maxWidth: "50px"}}/>
                                    </div>
                                    <div className="col-md-11">
                                        <div><small>{i.product.name}</small></div>
                                        <div style={{ color: "grey" }}><small>{i.variant.weight > 999 ? `${i.variant.weight/1000}Kg` : `${i.variant.weight}g`}, {i.variant.flavour}</small></div>
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