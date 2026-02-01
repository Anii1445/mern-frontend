import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../store/auth-ContextAPI";
import { GiBodyBalance } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { GoShieldCheck } from "react-icons/go";
import Divider from "@mui/material/Divider";
import { MdPhone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { FaLinkedin } from "react-icons/fa";
import "../css/footer.css";



export default function Footer() {
  const location = useLocation();
  const path = ["/carts","/checkout","/payment"];
  const { ApiBrands, ApiCategory, user } = useAuth();
  const navigate = useNavigate();

if(!user || !user.isAdmin){
  if(path.includes(location.pathname)){
    return(
        <>
        <footer style={{ paddingTop: "5rem" }}>
                <div className="text-secondary p-4 bg-secondary-subtle" style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div><p className="text-start text-dark"><GoShieldCheck color="green"/> 100% Safe & Secure payments</p></div>
                    
                    <div><img src="/upi.svg" style={{ marginRight: "5px", height: "40px"}}/><img src="/rupay.svg" style={{ marginRight: "5px", height: "40px"}}/>
                      <img src="/visa.svg" style={{ marginRight: "5px", height: "40px"}}/><img src="/cod2.png" style={{ marginRight: "5px", height: "40px"}}/>
                      <img src="/master.svg" style={{ marginRight: "5px", height: "40px"}}/><img src="/netbanking2.png" style={{ height: "40px"}}/>
                    </div>
                </div>
            </footer>
        </>
    )
  }else{
    return (
        <>
            <footer style={{ paddingTop: "4rem" }}>
                <div className="text-center footer-bg p-4" style={{  background: "linear-gradient(135deg, #1f2933, #36454F, #111827)" }}>
                    <div className="container">
                                <div className="row mt-4">
                                    <div className="col-12 justify-content-start d-flex">
                                        <NavLink to="/" style={{textDecoration: "none", color: "white"}}>
                                            <b style={{ display: "inline", backgroundColor: "white", color: "#1976d2",  padding: "10px 8px 8px", fontSize:"22px"}}>
                                            <GiBodyBalance style={{fontSize:"25px"}}/> FITNESS</b> 
                                            <b style={{ display: "inline", border: "1px solid white",padding: "9px 15px 7px", fontSize:"22px"}}>1</b>
                                        </NavLink>
                                    </div>
                                </div>
                    <div className="row" style={{ marginTop: "4%"}}>
                        <div className="col-2 text-start">
                            <div style={{ marginBottom: "10%", color: "white"}}><h6>Brands</h6></div>
                            {ApiBrands?.map((b,i)=>(
                                <p key={i} onClick={() => {navigate("/"); window.scrollTo(0,0)}} style={{ margin: "2px 0", fontSize: "15px", color: "#99A3A3", cursor: "pointer" }}>{b.brand}</p>
                            ))}
                        </div>
                        <div className="col-2 text-start">
                            <div style={{ marginBottom: "10%", color: "white" }}><h6>Category</h6></div>
                            {ApiCategory.map((c, i)=>(
                                <p key={i} onClick={() => {navigate("/"); window.scrollTo(0,0)}} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer" }}>{c.category}</p>
                            ))}
                        </div>
                        <div className="col-2 text-start">
                            <div style={{ marginBottom: "10%", color: "white"}}><h6>Useful Links</h6></div>
                            <p onClick={() => navigate("/about-us")} style={{ margin: "2px 0" , fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>About Us</p>
                            <p onClick={() => navigate("/faqs")} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>FAQs</p>
                            <p onClick={() => navigate("/blog")} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>Blog</p>
                            <p onClick={() => navigate("/privacy-policy")} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>Privacy Policy</p>
                            <p onClick={() => navigate("/contact-us")} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>Contact Us</p>
                        </div>
                        <div className="col-2 text-start">
                            <div style={{ marginBottom: "10%", color: "white"}}><h6>Contact Us</h6></div>
                            <p style={{ margin: "7px 0" , fontSize: "15px", color:"white"}}><MdEmail style={{ fontSize: "20px", backgroundColor: "white", padding: "3px", fontSize: "25px", borderRadius: "5px", marginRight: "10px", color: "#1976d2" }}/>info@fitnessfirst.com</p>
                            <p style={{ fontSize: "15px", color:"white"}}><MdPhone style={{ fontSize: "20px", backgroundColor: "white", padding: "3px", fontSize: "25px", borderRadius: "5px", marginRight: "10px", color: "#1976d2" }}/>+91 7700037701</p>
                            <h6 style={{ marginBottom: "10%", color: "white"}}>Follow Us </h6><br/>
                            <RiInstagramFill style={{marginRight: "3%", backgroundColor: "white", padding: "5px", fontSize: "40px", borderRadius: "5px", color: "#1976d2" }}/><FaFacebook style={{marginRight: "3%", backgroundColor: "white", padding: "5px", fontSize: "40px", borderRadius: "5px", color: "#1976d2" }}/><FaLinkedin style={{marginRight: "3%", backgroundColor: "white", padding: "5px", fontSize: "40px", borderRadius: "5px", color: "#1976d2" }}/><IoLogoYoutube style={{ backgroundColor: "white", padding: "5px", fontSize: "40px", borderRadius: "5px", color: "#1976d2" }}/>
                            
                        </div>
                        <div className="col-4 text-start">
                            <div style={{ marginLeft: "40%", marginBottom: "5%", color: "white"}}><h6>Office Address</h6></div>
                            <p style={{ marginLeft: "40%", color: "white" }}>
                                Fitness First Private Limited<br/>
                                402, Savera Complex,<br/> Andheri - West,<br/>
                                Mumbai - 400053<br/>
                                Operational Hours: 10AM–7PM,<br/>
                                Monday–Sunday
                            </p>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "3%"}}>
                        <b className="text-start text-white" style={{ margin: "5px"}}><GoShieldCheck color="lightgreen"/> 100% Safe & Secure payments:</b>
                        <div className="col-12 d-flex justify-content-start" style={{ overflow:"hidden"}}>
                            <img src="/upi.svg" style={{ marginRight: "5px", height: "40px"}}/><img src="/rupay.svg" style={{ marginRight: "5px", height: "40px"}}/>
                            <img src="/visa.svg" style={{ marginRight: "5px", height: "40px"}}/><img src="/cod2.png" style={{ marginRight: "5px", height: "40px"}}/>
                            <img src="/master.svg" style={{ marginRight: "5px", height: "40px"}}/><img src="/netbanking2.png" style={{ height: "40px"}}/>
                        </div>
                    </div>
                    <Divider sx={{backgroundColor: "white", margin: "10px 0 12px"}}/>
                    <small style={{ color:"#99A3A3" }}>Copyright © 2025, FitnessFirst, or its affiliates</small>

                </div>
                </div>
            </footer>
        </>
    )}}
    
}