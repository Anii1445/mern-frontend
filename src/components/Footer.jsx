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
import "../css/payment-footer.css";
import "../css/footer-logo.css";
import { useTheme, useMediaQuery } from "@mui/material";


export default function Footer() {
  const location = useLocation();
  const path = ["/carts","/checkout","/payment"];
  const { ApiBrands, ApiCategory, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


if(!user || !user.isAdmin){
  if(path.includes(location.pathname)){
    return(
        <>
        <footer style={{ paddingTop: "5rem"}}>
                 <div className="payment-bar text-secondary p-4 bg-secondary-subtle">
    <div className="payment-text">
      <p className="text-dark">
        <GoShieldCheck color="green" /> 100% Safe & Secure payments
      </p>
    </div>

    <div className="payment-icons">
      <img className="payment-img" src="/upi.svg" />
      <img className="payment-img" src="/rupay.svg" />
      <img className="payment-img" src="/visa.svg" />
      <img className="payment-img" src="/cod2.png" />
      <img className="payment-img" src="/master.svg" />
      <img className="payment-img" src="/netbanking2.png" />
    </div>
   {isMobile && 
    <>
    <div style={{ padding: "5%" }}></div>
    
    </>}

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
                                            <b className="footer-logo-main">
                                            <GiBodyBalance style={{fontSize:"25px"}}/> FITNESS</b> 
                                            <b className="footer-logo-sub">1</b>
                                        </NavLink>
                                    </div>
                                </div>
                    <div className="row" style={{ marginTop: "8%"}}>
                        <div className="col-6 col-sm-6 col-md-4 text-center text-md-start mb-4">
                            <div className="text-start text-md-start" style={{ color: "white"}}><h6>Office Address</h6></div>
                            <p className="text-start text-md-start" style={{  color: "white" }}>
                                Fitness First Private Limited<br/>
                                402, Savera Complex,<br/> Andheri - West,<br/>
                                Mumbai - 400053<br/>
                                Operational Hours: 10AM–7PM,<br/>
                                Monday–Sunday
                            </p>
                        </div>
                        
                        <div className="col-6 col-sm-6 col-md-2 text-start text-md-start mb-4">
                            <div style={{ color: "white"}}><h6>Brands</h6></div>
                            {ApiBrands?.map((b,i)=>(
                                <p key={i} onClick={() => {navigate("/"); window.scrollTo(0,0)}} style={{ margin: "2px 0", fontSize: "15px", color: "#99A3A3", cursor: "pointer" }}>{b.brand}</p>
                            ))}
                        </div>
                        <div className="col-6 col-sm-6 col-md-2 text-start text-md-start mb-4">
                            <div style={{ color: "white" }}><h6>Category</h6></div>
                            {ApiCategory.map((c, i)=>(
                                <p key={i} onClick={() => {navigate("/"); window.scrollTo(0,0)}} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer" }}>{c.category}</p>
                            ))}
                        </div>
                        <div className="col-6 col-sm-6 col-md-2 text-start text-md-start mb-4">
                            <div style={{ color: "white"}}><h6>Useful Links</h6></div>
                            <p onClick={() => navigate("/about-us")} style={{ margin: "2px 0" , fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>About Us</p>
                            <p onClick={() => navigate("/faqs")} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>FAQs</p>
                            <p onClick={() => navigate("/blog")} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>Blog</p>
                            <p onClick={() => navigate("/privacy-policy")} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>Privacy Policy</p>
                            <p onClick={() => navigate("/contact-us")} style={{ margin: "2px 0", fontSize: "15px", color:"#99A3A3", cursor: "pointer"}}>Contact Us</p>
                        </div>
                        <div className="col-6 col-sm-6 col-md-2 text-start text-md-start mb-4">
                            <div style={{ color: "white"}}><h6>Contact Us</h6></div>
                            <p style={{ margin: "7px 0" , color:"white"}}><MdEmail className="icon" style={{ backgroundColor: "white", padding: "3px", borderRadius: "5px", marginRight: "10px", color: "#1976d2" }}/>info@fitnessfirst.com</p>
                            <p style={{ color:"white"}}><MdPhone className="icon" style={{ backgroundColor: "white", padding: "3px", borderRadius: "5px", marginRight: "10px", color: "#1976d2" }}/>+91 7700037701</p>
                            <h6 style={{ color: "white"}}>Follow Us </h6><br/>
                            <RiInstagramFill className="icon-social" style={{marginRight: "3%", backgroundColor: "white", padding: "5px", borderRadius: "5px", color: "#1976d2" }}/><FaFacebook className="icon-social" style={{marginRight: "3%", backgroundColor: "white", padding: "5px", borderRadius: "5px", color: "#1976d2" }}/><FaLinkedin className="icon-social" style={{marginRight: "3%", backgroundColor: "white", padding: "5px", borderRadius: "5px", color: "#1976d2" }}/><IoLogoYoutube className="icon-social" style={{ backgroundColor: "white", padding: "5px", borderRadius: "5px", color: "#1976d2" }}/>
                            
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: "3%"}}>
                        <b className="text-start text-white" style={{ margin: "5px"}}><GoShieldCheck color="lightgreen"/> 100% Safe & Secure payments:</b>
                        <div className="col-12 d-flex flex-wrap justify-content-start justify-content-md-start gap-2" style={{ overflow:"hidden"}}>
                            <img src="/upi.svg" className="img"/><img src="/rupay.svg" className="img"/>
                            <img src="/visa.svg" className="img"/><img src="/cod2.png" className="img"/>
                            <img src="/master.svg" className="img"/><img src="/netbanking2.png" className="img"/>
                        </div>
                    </div>
                    <Divider sx={{backgroundColor: "white", margin: "10px 0 12px"}}/>
                    <small style={{ color:"#99A3A3" }}>Copyright © 2025, FitnessFirst, or its affiliates</small>

                </div>

                {isMobile && 
    <>
    <div style={{ padding: "7%" }}></div>
    
    </>}
                </div>
                 
            </footer>
        </>
    )}}
    
}