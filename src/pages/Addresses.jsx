
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdRadioButtonOff } from "react-icons/io";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { useState } from "react";
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
import { useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { IoWarningOutline } from "react-icons/io5";
import "../css/wave.css"
const API = import.meta.env.VITE_API_URL;

export default function Addresses(){

      const { user, token } = useAuth();
      const [deliver, setDeliver] = useState();
      const [userAddress, setUserAddress] = useState([]); 
      const dispatch = useDispatch();
      const { orderInfo, selectedAddress } = useSelector((state) => state.checkout);
  

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


      const getAllUSerAddress = async () => {
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
          }
        } catch (error) {
          console.log(error);
        }
      };

      const handleEditChange = (e) =>{
        setEditAddress({ ...editAddress, [e.target.name]: e.target.value });
      }
    
       const add = async () => {
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
             });
                setAddress(getInitialAddress(user?.userId));
                setDeliver(data._id);
                getAllUSerAddress();
              }
              else{
                if(data.extraDetails){
                  toast.error(data.extraDetails[0], {
                position: "top-center",
                autoClose: 2000, 
             });
                }
              }
            } catch (error) {
              console.log(error);
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
    
      const edit = async(id) => {
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
             });
            getAllUSerAddress();
          }
          else{
            toast.error(data.extraDetails[0], {
                position: "top-center",
                autoClose: 2000, 
             });
          }
        } catch (error) {
          console.log(error)
        }
      }


        const [editAddress, setEditAddress] = useState({});
        const Edit = async (id) => {
          
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
              }
            } catch (error) {
              console.log(error)
            }
          };
      
         
      
        const Delete = (id) => {
          try {
            confirmAlert({
              customUI: ({ onClose }) => {
                return (
                  <div
                    className="custom-ui p-5 rounded"
                    style={{ backgroundColor: "#F0F8FF", boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)"}}
                  >
                    <h3>
                      <IoWarningOutline color="red" /> Are you sure?
                    </h3>
                    <p>You want to remove this item from the cart?</p>
                    <Button
                      variant="outlined"
                      sx={{ marginRight: "2%" }}
                      onClick={onClose}
                    >
                      No
                    </Button>
                    <Button
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



        const Default = (id) => {
            dispatch(setSelectedAddress(id))
            toast.success("Set as a Default Address", {
                position: "top-center",
                autoClose: 2000, 
             })
        }


useEffect(() => {
    if (user) {
      getStates();
      getCities();
      getAllUSerAddress();
    }
  }, [user]);

    return (
        <>
        <div className="container">
            <div className="justify-content-center">
                <div className="card" style={{ marginTop: "10%" }}>
                    <div className="card-body">
                        <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2%",
                  }}>
                        <h5 className="mb-4">My Addresses</h5>
                        <Button
                    variant="outlined"
                    startIcon={<FiPlus />}
                    size="small"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    Add New Address
                  </Button>
                  </div>

            <div className="row">
                {userAddress.map((u, i) => (
                <>
                <div className="col-6">
                                  <div
                                    key={i}
                                    className="card"
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
                                      
                                          <div className="mb-3 d-flex align-items-center justify-content-between">
                                            <div>
                                             {deliver !== u._id ? <IoMdRadioButtonOff style={{ marginRight: "5px", color: "grey", fontSize: "20px" }} /> :
                                              <MdOutlineRadioButtonChecked style={{ marginRight: "5px", color: "#1769aa", fontSize: "20px" }} />}
                                            <b style={{ backgroundColor: "lightBlue", padding: "5px", borderRadius: "5px"}}>  
                                              {u.address_type} 
                                            </b>
                                            </div>

                                             <div className="justify-content-end">
                                                                      <MdOutlineEdit
                                                                      data-bs-toggle="modal"
                                                                      data-bs-target="#staticBackdrop_1"
                                                                      style={{ color: "grey" }}
                                                                        className="me-2"
                                                                        onClick={(e) => {
                                                                          e.stopPropagation(), Edit(u._id);
                                                                        }}
                                                                      />
                                          
                                                                      <RiDeleteBin6Line
                                                                      style={{ color: "grey" }}
                                                                        onClick={(e) => {
                                                                          e.stopPropagation(), Delete(u._id);
                                                                        }}
                                                                      /> 
                                                                    </div>
                                          </div>
                                          <small>
                                            <strong>{u.full_name}</strong>,<br/>
                                            {u.house_no}, {u.landmark}, {u.area},{" "}
                                            {u.city.toUpperCase()},{" "}
                                            {u.stateInfo.name.toUpperCase()}, {u.pincode}
                                          </small>
                                          <p style={{ marginTop: "5px" }}>
                                             Phone: +91 {u.phone}
                                          </p>
                                                                  <Button
                                                                    variant="contained"
                                                                    disabled={deliver !== u._id && true}
                                                                    startIcon={deliver === u._id && <FaCheckSquare/>}
                                                                    onClick={(e) => {
                                                                      e.stopPropagation(), Default(u._id);
                                                                    }}
                                                                  >
                                                                   Set as Default
                                                                  </Button>
                                          
                                          </div>
                                          </div>
                                          </div>
                                          
                                          </>
                                        ))}
                                          
                                            
                            
                        </div>
                        </div>
                        </div>
                    </div>
                </div>


                 {/* <!---------------------------- Modal Trigger -------------------------------------> */}
                
                      <div
                        className="modal fade"
                        id="staticBackdrop"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                Add New Address
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                onClick={()=>{setAddress(getInitialAddress(user?.userId))}}
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
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col my-2 py-0">
                                  <FormControl size="small" fullWidth>
                                    <InputLabel id="demo-select-small-label">State</InputLabel>
                                    <Select
                                      labelId="demo-select-small-label"
                                      id="demo-select-small"
                                      value={address.state}
                                      label="State"
                                      name="state"
                                      onChange={handleChange}
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
                                      City/ District
                                    </InputLabel>
                                    <Select
                                      labelId="demo-select-small-label"
                                      id="demo-select-small"
                                      value={address.city}
                                      label="City/ District"
                                      name="city"
                                      onChange={handleChange}
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
                                  <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">
                                      Address Type
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
                                      />
                                      <FormControlLabel
                                        value="Office"
                                        control={<Radio size="small" />}
                                        label="Office"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary" onClick={add}>
                                Save And Deliver
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                
                
                      {/* ------------------------ Edit Modal for address ----------------------------- */}
                
                      <div
                        className="modal fade"
                        id="staticBackdrop_1"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                        style={{ marginTop: "2%" }}
                      >
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                Edit Address
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                onClick={()=>{setAddress(getInitialAddress(user?.userId))}}
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="row">
                                <div className="col my-2 py-0">
                                  <TextField
                                    name="full_name"
                                    value={editAddress.full_name}
                                    label="Full Name"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={handleEditChange}
                                  />
                                </div>
                                <div className="col my-2 py-0">
                                  <TextField
                                    name="phone"
                                    value={editAddress.phone}
                                    label="Mobile Number"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col my-2 py-0">
                                  <TextField
                                    name="house_no"
                                    value={editAddress.house_no}
                                    label="Flat/House No./ Apartment(Optional)"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col my-2 py-0">
                                  <TextField
                                    name="area"
                                    value={editAddress.area}
                                    label="Locality/ Area/ Street"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col my-2 py-0">
                                  <TextField
                                    name="landmark"
                                    value={editAddress.landmark}
                                    label="Landmark(Optional)"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={handleEditChange}
                                  />
                                </div>
                                <div className="col my-2 py-0">
                                  <TextField
                                    name="pincode"
                                    value={editAddress.pincode}
                                    label="Pincode"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col my-2 py-0">
                                  <FormControl size="small" fullWidth>
                                    <InputLabel id="demo-select-small-label">State</InputLabel>
                                    <Select
                                      labelId="demo-select-small-label"
                                      id="demo-select-small"
                                      value={editAddress.state || ""}
                                      label="State"
                                      name="state"
                                      onChange={handleEditChange}
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
                                      City/ District
                                    </InputLabel>
                                    <Select
                                      labelId="demo-select-small-label"
                                      id="demo-select-small"
                                      value={editAddress.city || ""}
                                      label="City/ District"
                                      name="city"
                                      onChange={handleEditChange}
                                      fullWidth
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
                                  <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">
                                      Address Type
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
                                      />
                                      <FormControlLabel
                                        value="Office"
                                        control={<Radio size="small" />}
                                        label="Office"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary" onClick={()=>edit(editAddress._id)}>
                                Save And Deliver
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                
                
            
        </>
    )
}