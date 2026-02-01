import Button from "@mui/material/Button";
import { useAuth } from "../store/auth-ContextAPI"
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const API = import.meta.env.VITE_API_URL;


export default function PersonalInfo(){

    const {user, token} = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState({});

    const getData = async() => {       
        try {
            const response = await fetch(`${API}/api/auth/getUserByID/${user?.userId}`,{
            method: "GET",
            headers: {
                 Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if(response.ok){
            setData(await response.json())
        }
        } catch (error) {
            console.log(error)
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
                <div className="card" style={{ marginTop:"10%"}}>
                    <div className="card-body">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2%", alignItems: "center" }}>
                          
                          <h5>Personal Information</h5>
                          <Button variant="outlined" onClick={() => navigate("edit") }>Edit</Button>
                        </div>
                        <div className="card">
                            <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-3">
                                <h6>Name:</h6>
                            </div>
                            <div className="col-3">
                                {data?.name}
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-3">
                                <h6>Email Address:</h6>
                            </div>
                            <div className="col-3">
                                {data?.email}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <h6>Mobile Number:</h6>
                            </div>
                            <div className="col-3">
                                {data?.phone}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}