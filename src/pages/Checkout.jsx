import Divider from "@mui/material/Divider";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { FaSave } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line, RiLoader2Line } from "react-icons/ri";
import Stepper from "@mui/material/Stepper";
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineSaveAs } from "react-icons/md";
import { IoIosMoon, IoMdRadioButtonOff } from "react-icons/io";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { useTheme, useMediaQuery } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { FiPlus } from "react-icons/fi";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { FaCheckSquare } from "react-icons/fa";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import { toast } from "react-toastify";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedAddress } from "../store/checkoutSlice";
import { setDeliverAddress } from "../store/checkoutSlice";
import { useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { IoWarningOutline } from "react-icons/io5";
import "../css/wave.css"
const API = import.meta.env.VITE_API_URL;


export default function Checkout() {
  const { user, token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderInfo, selectedAddress } = useSelector((state) => state.checkout);
  const steps = ["Cart", "Add address", "Payment"];
  const [deliver, setDeliver] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(null);
  const [getEditLoading, setGetEditLoading] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const getInitialAddress = (userId) => ({
  full_name: "",
  phone: "",
  house_no: "",
  area: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  address_type: "",
  user_id: userId,
  });

  const [address, setAddress] = useState(()=> getInitialAddress(user?.userId));

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const [errors, setErrors] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  const add = async () => {
    setLoadingButton(true);

    if (isLoggedIn) {
      const payload = {...address, user_id: user?.userId}
      try {
        const response = await fetch(
          `${API}/api/auth/addUserAddress`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();
        if (response.ok) {
          toast.success("Address Added", {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    textAlign: "center",
  },
             });
          setLoadingButton(false);   
          setAddress(getInitialAddress(user?.userId));
          setDeliver(data._id);
          getAllUSerAddress();
          setShowModal(false);
          setErrors("");  
        }
        else{
          if(data.extraDetails){
            setErrors(data.extraDetails[0].field)
            toast.error(data.extraDetails[0].message, {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             });
             setLoadingButton(false);
          }
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoadingButton(false);
      }
    }
  };

  const [states, setStates] = useState([]);
  const getStates = async () => {
    try {
      const response = await fetch(`${API}/api/auth/getStates`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setStates(await response.json());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [cities, setCities] = useState([]);
  const getCities = async () => {
    try {
      const response = await fetch(`${API}/api/auth/getCities`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setCities(await response.json());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [userAddress, setUserAddress] = useState([]);
  const getAllUSerAddress = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API}/api/auth/getUserAddressByID/${user?.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
       const data = await response.json();
      if (response.ok) {
        setDeliver(selectedAddress)
        setUserAddress(data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
  
      getStates();
      getCities();
      getAllUSerAddress();
      setAddress(getInitialAddress(user?.userId));
  
  }, [user, selectedAddress]);


  const [editAddress, setEditAddress] = useState({});
  const Edit = async (id) => {
    setGetEditLoading(id);
      try {
        const response = await fetch(`${API}/api/auth/getAddressByIdForEdit/${id}`,{
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        if(response.ok){
          setEditAddress(await response.json());
          setGetEditLoading(null);
        }
      } catch (error) {
        console.log(error)
      }finally{
        setGetEditLoading(null)
      }
    };

   

  const Delete = (id) => {
    try {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div
              className="custom-ui p-5 rounded"
              style={{ padding: isMobile ? "12px" : "30px",
                   width: isMobile ? "80%" : "400px", margin: "0 auto", backgroundColor: "#F0F8FF", boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)"}}
            >
              <h3>
                <IoWarningOutline color="red" /> Are you sure?
              </h3>
              <p>You want to remove this item from the cart?</p>
              <Button
              size={isMobile ? "small":"medium"}
                variant="outlined"
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
                  const response = await fetch(`${API}/api/auth/deleteUserAddressByID/${id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if(response.ok) {
                    onClose();
                    getAllUSerAddress();
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

  const DeliverHere = (id) => {
    dispatch(setDeliverAddress(id));
    navigate("/payment");
  };

  const handleEditChange = (e) =>{
    setEditAddress({ ...editAddress, [e.target.name]: e.target.value });
  }

  const edit = async(id) => {
    setUpdateLoading(id);
    try {
      const response = await fetch(`${API}/api/auth/editUserAddressByID/${id}`,{
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editAddress)
      });

      const data = await response.json();
      if(response.ok){
        toast.success("Address Updated", {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    textAlign: "center",
  },
             });
        getAllUSerAddress();
        setEditAddress({});
        setUpdateLoading(null);
        setDeliver(id);
        setEditModal(false);
      }
      else{
        if(data.extraDetails[0]){
          setErrors(data.extraDetails[0].field)
        toast.error(data.extraDetails[0].message, {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             });
             setUpdateLoading(null);
      }}
    } catch (error) {
      console.log(error)
    }
    finally{
      setUpdateLoading(null);
    }
  }

  console.log(orderInfo)
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setEditModal] = useState(false);
  return (
    <>
      <div
        className="container justify-content-center"
        style={{ paddingTop: isMobile ? "20%" : "10%" }}
      >
        <div className="row">
          <div className="col-12 col-md-7">
            <Box sx={{ width: "100%", marginBottom: "3%" }}>
              <Stepper activeStep={1} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Button
                    variant="outlined"
                    startIcon={<FiPlus />}
                    onClick={() => setShowModal(true)}
                    sx={{
    borderStyle: "dashed",
    borderWidth: "2px",
  }}
  size="large"
                    fullWidth
                  >
                    Add New Address
            </Button>
            {loading ? <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
   <div className="spinner-grow text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div> : userAddress.length > 0 &&
            <div className="card mt-2" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}}>
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4%",
                  }}
                >
                  <h4>Delivery Address</h4>
                </div>

                {userAddress.map((u, i) => (
                  <div
                    key={i}
                    className="card mt-2"
                    style={{
                      backgroundColor: deliver === u._id ? "#F5F5F5" : "",
                      border: deliver === u._id ? "2px solid #2196f3" : "",
                    }}
                  >
                    <div
                      className="card-body"
                      onClick={() => setDeliver(u._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="row align-items-start">
                        <div className="col-12 col-md-10">
                          <div className="mb-3">
                             {deliver !== u._id ? <IoMdRadioButtonOff style={{ marginRight: "5px", color: "grey", fontSize: "20px" }} /> :
                              <MdOutlineRadioButtonChecked style={{ marginRight: "5px", color: "#1769aa", fontSize: "20px" }} />}
                              <b style={{ backgroundColor: "lightBlue", padding: "5px", borderRadius: "5px"}}>  
                                              {u.address_type} 
                              </b>
                          </div>
                          <div style={{ color: deliver === u._id ? "":"grey"}}>
                          <small>
                            <strong>{u.full_name}</strong>,<br/>
                            {u.house_no}, {u.landmark}, {u.area},{" "}
                            {u.city.toUpperCase()},{" "}
                            {u.stateInfo.name.toUpperCase()}, {u.pincode}
                          </small>
                          <p style={{ marginTop: "5px" }}>
                             Phone: +91 {u.phone}
                          </p>
                          </div>

                          <Button
                            variant="contained"
                             fullWidth={isMobile}
                             size={isMobile ? "small" : "medium"}
                            disabled={deliver !== u._id && true}
                            startIcon={deliver === u._id && <FaCheckSquare/>}
                            onClick={(e) => {
                              e.stopPropagation(), DeliverHere(u._id);
                            }}
                          >
                            Deliver Here
                          </Button>
                        </div>
                        
                          <div className="col-12 col-md-2 d-flex justify-content-end gap-2 mt-2 mt-md-0" 
                          style={{ position: isMobile && "absolute",
                                  top: isMobile && "10px",
                                  right: isMobile && "10px",
                                  display: isMobile && "flex",
                                  gap: isMobile && "10px",
                                  zIndex: isMobile && 2,}}>
                            {deliver === u._id && (
                            <MdOutlineEdit
                              style={{ color: "grey" }}
                              className="me-2"
                              onClick={(e) => {
                                e.stopPropagation(); Edit(u._id); setEditModal(true);
                              }}
                            />)}

                            {deliver !== u._id && (
                              <>
                            <MdOutlineEdit
                            style={{ color: "grey" }}
                              className="me-2"
                              onClick={(e) => {
                                e.stopPropagation(), Edit(u._id); setEditModal(true);
                              }}
                            />

                            <RiDeleteBin6Line
                            style={{ color: "grey" }}
                              onClick={(e) => {
                                e.stopPropagation(), Delete(u._id);
                              }}
                            /> 
                            </>
                            )}
                          </div>
                      
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> }
          </div>

          <div className="col-12 col-md-5 mt-4 mt-md-0">
            <div className="card" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}}  >
              <div className="card-body">
                <h4>
                  <BsBoxSeam style={{ marginRight: "3%" }} />
                  Order Summary ({orderInfo?.cartProducts? orderInfo?.cartProducts?.length : 1} Items)
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8%",
                  }}
                >
                  <p>Price</p>
                  <p>₹{orderInfo?.cartTotalMRP ? orderInfo?.cartTotalMRP.toLocaleString("en-IN") : orderInfo?.mrp.toLocaleString("en-IN")}</p>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    Convenience Fee
                    <Tooltip title="Delivery Charges FREE" arrow>
                      <IoMdInformationCircleOutline
                        style={{
                          fontSize: "20px",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                      />
                    </Tooltip>
                  </p>
                  <p>₹0</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2%",
                  }}
                >
                  <p>
                    Total Discounts
                    <Tooltip
                      title={`FF Discount -₹${orderInfo?.cartTotalMRP ? Number(orderInfo?.cartTotalMRP - orderInfo?.cartTotalPRICE).toLocaleString("en-IN") 
                        : Number(orderInfo?.mrp - orderInfo?.price).toLocaleString("en-IN")}`}
                      arrow
                    >
                      <IoMdInformationCircleOutline
                        style={{
                          fontSize: "20px",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                      />
                    </Tooltip>
                  </p>
                  <p style={{ color: "#34A56F" }}>
                    -₹
                   {orderInfo?.cartTotalMRP ? Number(orderInfo?.cartTotalMRP - orderInfo?.cartTotalPRICE).toLocaleString("en-IN") : Number(orderInfo?.mrp - orderInfo?.price).toLocaleString("en-IN")}
                  </p>
                </div>
                <Divider sx={{ backgroundColor: "black" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5%",
                  }}
                >
                  <b>Total Amount</b>
                  <b>₹{orderInfo?.cartTotalMRP ? orderInfo?.cartTotalPRICE.toLocaleString("en-IN") : orderInfo?.price.toLocaleString("en-IN")}</b>
                </div>
                <div style={{ backgroundColor: "lightgreen", padding: "4px 10px 4px 10px", borderRadius: "6px"}} className="saving-wave mt-2">
                  <small style={{ color: "#3D3C3A" }}>
                    <img src="/total-savings-coin.svg" style={{ marginRight: "5px" }}/>You will Save 
                    <strong> ₹{orderInfo?.cartTotalMRP ? 
                      (orderInfo?.cartTotalMRP - orderInfo?.cartTotalPRICE).toLocaleString("en-IN") : (orderInfo?.mrp - orderInfo?.price).toLocaleString("en-IN")}</strong>{" "}
                    on this order{" "}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isMobile && (
                  <div className="mobile-fixed-buybar d-flex justify-content-between" style={{ backgroundColor: "#b3e5fc" }}>
                            
                             <h5>Total Amount</h5> 
                             <h5>₹{orderInfo?.cartTotalMRP ? orderInfo?.cartTotalPRICE.toLocaleString("en-IN") : orderInfo?.price.toLocaleString("en-IN")}</h5>
                  </div>)}
      </div>

      {/* <!---------------------------- Modal Trigger -------------------------------------> */}

{showModal && 
      <div
        className="modal fade show"
        style={{ display: "block", marginTop: "2%",backgroundColor: "rgba(0,0,0,0.40)"  }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                Add New Address
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={()=>{setAddress(getInitialAddress(user?.userId)); setShowModal(false); setErrors("") }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col my-2 py-0">
                  <TextField
                    name="full_name"
                    value={address.full_name}
                    label="Full Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    error={errors === "full_name"}
                    required
                  />
                </div>
                <div className="col my-2 py-0">
                  <TextField
                    name="phone"
                    value={address.phone}
                    label="Mobile Number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    error={errors === "phone"}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <TextField
                    name="house_no"
                    value={address.house_no}
                    label="Flat/House No./ Apartment(Optional)"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    error={errors === "house_no"}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <TextField
                    name="area"
                    value={address.area}
                    label="Locality/ Area/ Street"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    error={errors === "area"}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <TextField
                    name="landmark"
                    value={address.landmark}
                    label="Landmark(Optional)"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    error={errors === "landmark"}
                    required
                  />
                </div>
                <div className="col my-2 py-0">
                  <TextField
                    name="pincode"
                    value={address.pincode}
                    label="Pincode"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    error={errors === "pincode"}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <FormControl size="small" fullWidth>
                    <InputLabel id="demo-select-small-label">State *</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small-label"
                      value={address.state}
                      label="State"
                      name="state"
                      onChange={handleChange}
                      error={errors === "state"}
                      required
                    >
                      {states.map((s, i) => (
                        <MenuItem key={i} value={s.state_id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="col my-2 py-0">
                  <FormControl size="small" fullWidth>
                    <InputLabel id="demo-select-small-label">
                      City/ District *
                    </InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={address.city}
                      label="City/ District"
                      name="city"
                      onChange={handleChange}
                      error={errors === "city"}
                      required
                      fullWidth
                    >
                      {cities
                        .filter((c) => c.state_id === address.state)
                        .map((c, i) => (
                          <MenuItem key={i} value={c.name}>
                            {c.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <FormControl error={errors === "address_type"}>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Address Type *
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="address_type"
                      value={address.address_type}
                      onChange={handleChange}
                      
                    >
                      <FormControlLabel
                        value="Home"
                        control={<Radio size="small" />}
                        label="Home"
                        sx={{
                           color: errors === "address_type" ? "error.main" : "",
                              "&.Mui-checked": {
                           color: errors === "address_type" ? "error.main" : "",
            },
          }}
                      />
                      <FormControlLabel
                        value="Office"
                        control={<Radio size="small" />}
                        label="Office"
                        sx={{
                            color: errors === "address_type" ? "error.main" : "",
                              "&.Mui-checked": {
                           color: errors === "address_type" ? "error.main" : "",
            },
          }}
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button startIcon={loadingButton ? <RiLoader2Line/>:<FaSave/>} disabled={loadingButton} variant="contained"  onClick={async () => {
                  await add() }} >
                {loadingButton ? "Saving...":"Save Address"}
              </Button>
            </div>
          </div>
        </div>
      </div>}


      {/* ------------------------ Edit Modal for address ----------------------------- */}

{showEditModal && 
      <div
        className="modal fade show"
        style={{ display: "block", marginTop: "2%",backgroundColor: "rgba(0,0,0,0.40)"  }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                Edit Address
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={()=>{setAddress(getInitialAddress(user?.userId)); setEditModal(false); setErrors("")}}
                aria-label="Close"
              ></button>
            </div>
            
            {getEditLoading ? 
              <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "300px" }}
  >
    <div className="spinner-grow text-secondary" role="status">
       <span className="visually-hidden">Loading...</span>
    </div>

  </div> :  <>
            <div className="modal-body">
              <div className="row">
                <div className="col my-2 py-0">
                  <TextField
                    name="full_name"
                    value={editAddress.full_name || ""}
                    label="Full Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleEditChange}
                    error={errors === "full_name"}
                    required
                  />
                </div>
                <div className="col my-2 py-0">
                  <TextField
                    name="phone"
                    value={editAddress.phone || ""}
                    label="Mobile Number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleEditChange}
                    error={errors === "phone"}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <TextField
                    name="house_no"
                    value={editAddress.house_no || ""}
                    label="Flat/House No./ Apartment(Optional)"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleEditChange}
                                        error={errors === "house_no"}
required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <TextField
                    name="area"
                    value={editAddress.area || ""}
                    label="Locality/ Area/ Street"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleEditChange}
                                        error={errors === "area"}
required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <TextField
                    name="landmark"
                    value={editAddress.landmark || ""}
                    label="Landmark(Optional)"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleEditChange}
                                        error={errors === "landmark"}
required
                  />
                </div>
                <div className="col my-2 py-0">
                  <TextField
                    name="pincode"
                    value={editAddress.pincode || ""}
                    label="Pincode"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleEditChange}
                                        error={errors === "pincode"}
required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <FormControl size="small" fullWidth>
                    <InputLabel id="demo-select-small-label">State *</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={editAddress.state || ""}
                      label="State"
                      name="state"
                      onChange={handleEditChange}
                                          error={errors === "state"}
required
                    >
                      {states.map((s, i) => (
                        <MenuItem key={i} value={s.state_id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="col my-2 py-0">
                  <FormControl size="small" fullWidth>
                    <InputLabel id="demo-select-small-label">
                      City/ District *
                    </InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={editAddress.city || ""}
                      label="City/ District"
                      name="city"
                      onChange={handleEditChange}
                      fullWidth
                                          error={errors === "city"}
required
                    >
                      {cities
                        .filter((c) => c.state_id === editAddress.state)
                        .map((c, i) => (
                          <MenuItem key={i} value={c.name}>
                            {c.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div className="col my-2 py-0">
                  <FormControl error={errors === "address_type"}>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Address Type *
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="address_type"
                      value={editAddress.address_type || ""}
                      onChange={handleEditChange}
                    >
                      <FormControlLabel
                        value="Home"
                        control={<Radio size="small" />}
                        label="Home"
                        sx={{
                           color: errors === "address_type" ? "error.main" : "",
                              "&.Mui-checked": {
                           color: errors === "address_type" ? "error.main" : "",
            },
          }}
                      />
                      <FormControlLabel
                        value="Office"
                        control={<Radio size="small" />}
                        label="Office"
                        sx={{
                           color: errors === "address_type" ? "error.main" : "",
                              "&.Mui-checked": {
                           color: errors === "address_type" ? "error.main" : "",
            },
          }}
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            </div>
            <div className="modal-footer gap-2">
              <Button variant="outlined" startIcon={updateLoading?<RiLoader2Line/>:<MdOutlineSaveAs/>} disabled={updateLoading} onClick={()=>edit(editAddress._id)}>
                {updateLoading ? "Updating...": "Update Address"}
              </Button>
              <Button variant="contained" startIcon={<RxCross2/>} onClick={()=>{ setEditAddress({});
                setEditModal(false);}}>
                Cancel
              </Button>
            </div>
            </>}
          </div>
        </div>
      </div>}
    </>
  );
}
