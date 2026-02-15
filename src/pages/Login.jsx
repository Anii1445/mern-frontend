import { useState } from "react";
import { NavLink, useAsyncError, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth-ContextAPI";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import "../css/login.css"
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import "../css/hover.css";
import "../css/carousel.css";
import { useEffect } from "react";
import { RiLoader2Line } from "react-icons/ri";
import { Carousel } from "bootstrap";
const API = import.meta.env.VITE_API_URL;
import { useTheme, useMediaQuery } from "@mui/material";
import {Typography, Box} from "@mui/material";
import { GiBodyBalance } from "react-icons/gi";


export default function Login() {
  const { storeTokenInLS, user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showPasssword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const [isLoading, setLoading] = useState(false);

//  useEffect(() => {
//   if (isLoggedIn && user) {
//     if (user.isAdmin) {
//       navigate("/admin/dashboard", { replace: true });
//     } else {
//       navigate("/", { replace: true });
//     }
//   }
//  }, [isLoggedIn, user]);


  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const res_data = await response.json();
      if (response.ok) {
        storeTokenInLS(res_data.token); //------ Store token in localhost ------//
        toast.success("Login Successful", {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             });
        setUserData({
          email: "",
          password: "",
        });
        setLoading(false);
              
      } else {
        if (res_data.extraDetails) {
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
        setLoading(false);
      }
    } catch (error) {
      console.log("Login", error);
    }finally{ setLoading(false);}
  };

  const handleshowPasssword = () => {
    if (userData.password) {
      setShowPassword(true);
    }
  };

  const hidePassword = () => {
    setShowPassword(false);
  };

  const handleClose = () => {
    navigate("/");
  };

  useEffect(() => {
    const el = document.querySelector("#carouselExampleCaptions");
    if (el) {
      new Carousel(el, {
        interval: 2500,
        ride: "carousel",
        pause: false,
      });
    }
  }, []);

  return (
    <>
      <div className="container">
        <div>
          <RxCross1
            className="onHover position-fixed"
            style={{
              backgroundColor: "lightgrey",
              top: isMobile ? "2%":"13px",
              right: isMobile ? "12px":"15px",
              cursor: "pointer",
              fontSize: "1.8rem",
              borderRadius: "50%",
              padding: "8px",
              zIndex: 1050,
              transition: "backgroundColor 0.3s ease",
            }}
            onClick={handleClose}
          />
        </div>

<form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center">
            <div className="border rounded-4" style={{ marginTop: isMobile ? "35%":"9%", width: isMobile ? "95%" : "75%", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)"}}>
             
              <div className="row g-0">
                <div className="col-12 col-md-6 d-none d-md-block bg-secondary-subtle rounded-start-4">
                  <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel"
                    data-bs-interval="2500" style={{ position: "relative" }}>

                    <div className="carousel-indicators" style={{ bottom: "17%" }}>
                      <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="0"
                        className="active bg-primary"
                        aria-current="true"
                        aria-label="Slide 1"
                      ></button>
                      <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="1"
                        aria-label="Slide 2"
                        className="bg-primary"
                      ></button>
                      <button
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to="2"
                        aria-label="Slide 3"
                        className="bg-primary"
                      ></button>
                    </div>     
            
                    <div className="carousel-inner" style={{ paddingTop: "18%" }}>
                      <div className="carousel-item active">
                        <img src="login_slide1.svg" 
                        className="d-block" style={{ maxWidth: "50%", marginLeft: "auto", marginRight: "auto" }} alt="..." />
                        <div className="text-center" style={{ marginTop: "14.8%" }}>
                          <h5>Wide range of Original & Authentication Nutrition Products</h5>
                          <small>
                            We strive to provide 100% authenticate products to our customers.
                          </small>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img src="login_slide2.svg" 
                       className="d-block" style={{ maxWidth: "50%", marginLeft: "auto", marginRight: "auto" }} alt="..." />
                        <div className="text-center" style={{ marginTop: "12%" }}>
                          <h5>Get Personalized Diet Plans and Fitness Advice</h5>
                          <small>
                            Start your journey towards a healthy lifestyle.
                          </small>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img src="login_slide3.svg" 
                        className="d-block" style={{ maxWidth: "50%", marginLeft: "auto", marginRight: "auto" }} alt="..." />
                        <div className="text-center" style={{ marginTop: "12%" }}>
                          <h5>Great offers on Top Brands</h5>
                          <small>
                            14 days hassle-free return policy.
                          </small>
                        </div>
                      </div>
                    </div>

                    
                    <button
                      class="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide="prev"
                    >
                      <span
                        class="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span class="visually-hidden">Previous</span>
                    </button>
                    <button
                      class="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide="next"
                    >
                      <span
                        class="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span class="visually-hidden">Next</span>
                    </button>

                  </div>
                </div>

                <div className="col-12 col-md-6 px-4 px-md-5 py-4">
                   <Typography
                            sx={{ flexShrink: 0, textAlign: "center", marginBottom: isMobile && "50px", marginTop: "30px" }}
                          >
                              <NavLink to="/" style={{textDecoration: "none"}}>
                              <b className="footer-logo-main"  style={{ border: "1px solid #1976d2"}}><GiBodyBalance style={{fontSize:"25px"}}/> FITNESS</b> 
                              <b className="footer-logo-sub" style={{ backgroundColor: "#1976d2", color: "white", border: "1px solid #1976d2", padding: isMobile ? "6px 10px" : "6px 12px"}}>1</b>
                              </NavLink>
                          
              </Typography>
                  <h2 className="text-center mb-4 mt-2 mt-md-5">Login</h2>

                <div className='row g-3 needs-validation'>
                  <div className="mb-1">
                    <TextField
                      type="email"
                      label="Email"
                      variant="outlined"
                      size="small"
                      value={userData.email}
                      onChange={handleChange}
                      name="email"
                      fullWidth
                      placeholder='e.g you@gmail.com'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaUser />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                  </div>
                  <div className="mb-1">
                    <TextField
                      type={showPasssword ? "text" : "password"}
                      label="Password"
                      variant="outlined"
                      size="small"
                      value={userData.password}
                      onChange={handleChange}
                      name="password"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <RiLockPasswordFill />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{ cursor: "pointer" }}
                          >
                            {!showPasssword ? (
                              <FaEye onClick={handleshowPasssword} />
                            ) : (
                              <FaEyeSlash onClick={hidePassword} />
                            )}
                          </InputAdornment>
                        ),
                      }}
                      required
                      placeholder='******'
                    />
                  </div>

                    <div>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    type="submit"
                    disabled={isLoading}
                    startIcon={isLoading && <RiLoader2Line/>}
                  >
                    {isLoading ? "Logging..." : "Login" }
                  </Button>
                  </div>
                  </div>
                  <div className="mt-2 text-center">
                    <small>Don't have an Account?</small>{" "}
                    <NavLink to="/register" className="text-dark">
                      Sign up
                    </NavLink>
                  </div>

                  <div className="mt-4 mt-md-5 text-center">
                    <small style={{ fontSize: isMobile && "13px"}}>
                      By continuing, I agree to Terms & Conditions & Privacy
                      Policy
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </form>
        </div>
    
    </>
  );
}
