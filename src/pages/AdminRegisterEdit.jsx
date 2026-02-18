import { useEffect, useState } from "react"
import { useAuth } from "../store/auth-ContextAPI";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineSaveAs } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { RiLoader2Line } from "react-icons/ri";
import { Box } from "@mui/material";


export default function AdminRegisterEdit(){

    const { token, user } = useAuth();
    const [editData, setEditData] = useState({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

    const getData = async() => {  
        setIsLoading(true);     
        try {
            const response = await fetch(`${API}/api/admin/getUserByID/${user?.userId}`,{
            method: "GET",
            headers: {
                 Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if(response.ok){
            setEditData(await response.json());
            setIsLoading(false);
        }
        } catch (error) {
            console.log(error)
        }
        finally{
            setIsLoading(false);
        }
    }


    useEffect(() => {
        if(user?.userId){
            getData();
        }
    },[user])

    const handleChange = (e) => {
        setEditData({...editData,[e.target.name]:e.target.value})
    }

    const [errors, setErrors] = useState(false);
    const [emailErrors, setEmailErrors] = useState(false);

    const Edit = async() => {
        setButtonLoading(true)
        try {
            const response = await fetch(`http://localhost:5000/api/admin/editUserData/${user?.userId}`,{
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editData)
            });

            const res_data = await response.json();
            if(response.ok){
                setButtonLoading(false);
                toast.success("Data Updated Successfully!", {
                    position: "top-center",
                    autoClose: 2000, 
                    style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             })
                navigate("/admin/users")
            }
            else{
                if (res_data.extraDetails) {
                    setErrors(res_data.extraDetails[0].field)
                        toast.error(res_data.extraDetails[0].message, {
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
                setEmailErrors(res_data.msg)
                toast.error(res_data.msg && res_data.msg, {
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
            setButtonLoading(false);
        } catch (error) {
            console.log(error)
        }finally{
            setButtonLoading(false)
        }
    }

    

    return(
    <>
    <div className="container">
        <div className="justify-content-center">
            {isLoading ?   
          <div
    className="d-flex justify-content-center align-items-center gap-1"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
    <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div> :
            <div className="card">
                <div className="card-body">
                    <h4 className="mb-4">Edit Personal Information</h4>
                    <form className='row g-3'>
                                            <div className="col-md-6">
                                                <TextField type="text" label="Name" variant="outlined" size="small"
                                                    value={editData.name || ""} onChange={handleChange} name="name" fullWidth
                                                    required
                                                    error={errors === "name"} />
                                            </div>
                                            <div className="col-md-6">
                                                <TextField type="email" label="Email" variant="outlined" size="small"
                                                    value={editData.email || ""} onChange={handleChange} name="email" fullWidth
                                                    required
                                                    error={errors === "eamil" || emailErrors === "Email already exists"} />
                                            </div>
                                            <div className="col-md-6">
                                               <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0,
    }}
  >
    {/* Country Code Box */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 1,
        height: "40px",
        border: "1px solid #ccc",
        borderRadius: "4px 0 0 4px",
        backgroundColor: "#f5f5f5",
        fontSize: "14px",
      }}
    >
        <img src="https://up.yimg.com/ib/th/id/OIP.xDGEE9TtQnJi9U7hY4blRwHaHa?pid=Api&rs=1&c=1&qlt=95&w=123&h=123" style={{ width: "20px", marginRight: "2px" }}/>+91
    </Box>

    {/* Phone Input */}
    <TextField
      type="tel"
      label="Phone"
      variant="outlined"
      size="small"
      name="phone"
      value={editData.phone || ""}
      onChange={handleChange}
      fullWidth
      required
      placeholder="9876543210"
      sx={{ "& fieldset": { borderRadius: "0 4px 4px 0" }, backgroundColor: "#f5f5f5" }}
      error={errors === "phone"}
      disabled
    />
  </Box>
                                            </div>
   
                                        </form>

                                        <div className="row g-3 mt-3">
                                            <div className="col-md-6">
                                                <Button variant="outlined" startIcon={buttonLoading? <RiLoader2Line/>:<MdOutlineSaveAs/>} onClick={Edit} sx={{ marginRight: "5px" }}>
                                                   {buttonLoading? "Saving...":"Save"}
                                                </Button>
                                                 <Button startIcon={<RxCross2/>} variant="contained" onClick={() => navigate("/admin/users")}>
                                                   Cancel
                                                </Button>
                                            </div>
                                            
                                        </div>
                </div>
            </div>}
        </div>
    </div>
    
    </>)
}