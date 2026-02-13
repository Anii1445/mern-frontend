import Button from "@mui/material/Button";
import { useAuth } from "../store/auth-ContextAPI"
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API = import.meta.env.VITE_API_URL;
import { useTheme, useMediaQuery } from "@mui/material";
import { FaUserEdit } from "react-icons/fa";


export default function PersonalInfo(){

const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {user, token, isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(null);

    const getData = async() => {  
        setLoading(true);     
        try {
            const response = await fetch(`${API}/api/auth/getUserByID/${user?.userId}`,{
            method: "GET",
            headers: {
                 Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if(response.ok){
            setData(await response.json());
            setLoading(false);
        }
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
            if(user?.userId){
                getData();
            }
        },[user])

    return(
        <>
        <div className="container">
            <div className="justify-content-center">
                 {loading ? <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
  <div className="spinner-grow text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div> :  !isLoggedIn ? 
  <div className="text-center" style={{ marginTop: isMobile ? "10%":"22%"}}>
              <img
                src="https://cdn.appthemes.com/wp-content/uploads/2013/03/not-logged-in.png"
                className="img-fluid mx-auto d-block rounded-4"
                style={{ maxWidth: "auto", maxHeight: "auto" }}
              />
              <Button variant="outlined" sx={{ marginTop: "15px" }} onClick={() => navigate("/login")}>
                Please Login!
              </Button>
            </div>
:
                <div className="card shadow-sm" style={{ marginTop: isMobile ? "5%":"10%"}}>
                    <div className="card-body">
                        <div className="d-flex align-items-center flex-sm-row gap-2 justify-content-between align-items-sm-center mb-3">
        
                          <h5>Personal Information</h5>
                          <Button variant="outlined" onClick={() => navigate("edit") } startIcon={<FaUserEdit/>}>Edit</Button>
                        </div>
                        <div className="card">
                            <div className="card-body">
                            
                        <div className="row mb-4">
                            <div className="col-6 col-md-3">
                                <h6>Name:</h6>
                            </div>
                            <div className="col-6 col-md-9">
                                {data?.name}
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-6 col-md-3">
                                <h6>Email Address:</h6>
                            </div>
                            <div className="col-6 col-md-9">
                                {data?.email}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 col-md-3">
                                <h6>Mobile Number:</h6>
                            </div>
                            <div className="col-6 col-md-9">
                                {data?.phone}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>}
            </div>
        </div>
        </>
    )
}











