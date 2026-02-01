
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { useAuth } from '../store/auth-ContextAPI';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";
import "../css/hover.css";
import { Carousel } from "bootstrap";
import { useEffect } from 'react';
const API = import.meta.env.VITE_API_URL;

export default function Register() {

    const navigate = useNavigate();
    const [showPasssword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const res_data = await response.json();

            if (response.ok) {

                setUserData({
                    name: "",
                    email: "",
                    phone: "",
                    password: ""
                });
                toast.success("Registered Successfully!", {
                position: "top-center",
                autoClose: 2000, 
             })
                navigate("/login");

            }
            else {

                if (res_data.extraDetails) {
                    for (let e of res_data.extraDetails) {
                        toast.error(e, {
                           position: "top-center",
                           autoClose: 2000, 
                      });
                    }
                }
                toast.error(res_data.msg && res_data.msg, {
                position: "top-center",
                autoClose: 2000, 
             });
            }



        } catch (error) {
            console.log("Registration:", error);
        }
    }

    const handleshowPasssword = () => {
        if (userData.password) {
            setShowPassword(true);
        }
    }

    const hidePassword = () => {
        setShowPassword(false);
    }

     const handleClose = () => {
        navigate("/");
    }

    return (
        <>
        <div className='container'>
            <div><RxCross1
                className="onHover position-absolute"
                style={{
                    backgroundColor: "lightgrey",
                    top: '13px',
                    right: '13px',
                    cursor: 'pointer',
                    fontSize: '2rem',
                    borderRadius: '50%',
                    padding: '8px',
                    transition: 'backgroundColor 0.3s ease'
                }}
                onClick={handleClose}
            />
            </div>

<form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center">
                <div className="border rounded-4" style={{ width: "80%", marginTop: "6%" }}>
              <div className="row">
                <div className="col-6 bg-secondary-subtle rounded-start-4">
                  <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel"
                    data-bs-interval="2500" style={{ position: "relative" }}>

                    <div className="carousel-indicators">
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
            
                    <div className="carousel-inner" style={{ marginTop: "18%"}}>
                      <div className="carousel-item active">
                        <img src="login_slide1.svg" className="d-block" style={{width: "50%", marginLeft: "auto", marginRight: "auto"}} alt="..." />
                        <div className="text-center" style={{ marginTop: "14.8%" }}>
                          <h5>Wide range of Original & Authentication Nutrition Products</h5>
                          <small>
                            We strive to provide 100% authenticate products to our customers.
                          </small>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img src="login_slide2.svg" className="d-block" style={{width: "50%", marginLeft: "auto", marginRight: "auto"}} alt="..." />
                        <div className="text-center" style={{ marginTop: "12%" }}>
                          <h5>Get Personalized Diet Plans and Fitness Advice</h5>
                          <small>
                            Start your journey towards a healthy lifestyle.
                          </small>
                        </div>
                      </div>
                      <div className="carousel-item">
                        <img src="login_slide3.svg" className="d-block" style={{width: "50%", marginLeft: "auto", marginRight: "auto"}} alt="..." />
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
                <div className='col-6' style={{ padding: "7%", marginTop: "5%" }}>
                    <h2 className='text-center mb-4'>Sign-up</h2>

                    <div className='row g-3 needs-validation'>
                        <div className="col-md-6">
                            <TextField type="text" label="Name" variant="outlined" size="small"
                                value={userData.name} onChange={handleChange} name="name" fullWidth
                                required placeholder='e.g Joel'/>
                        </div>
                        <div className="col-md-6">
                            <TextField type="email" label="Email" variant="outlined" size="small"
                                value={userData.email} onChange={handleChange} name="email" fullWidth
                                required placeholder='e.g you@gmail.com' />
                        </div>
                        <div className="col-md-6">
                            <TextField type="text" label="Phone" variant="outlined" size="small"
                                value={userData.phone} onChange={handleChange} name="phone" fullWidth
                                required placeholder='e.g 9876354109'/>
                        </div>
                        <div className="col-md-6">
                            <TextField type={showPasssword ? "text" : "password"} label="Password" variant="outlined" size="small"
                                value={userData.password} onChange={handleChange} name="password"
                                placeholder='***********'

                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" style={{ cursor: "pointer" }}>
                                            {!showPasssword ?
                                                <FaEye onClick={handleshowPasssword} /> :
                                                <FaEyeSlash onClick={hidePassword} />}
                                        </InputAdornment>
                                    ),
                                }}

                                fullWidth required />
                        </div>

                        <div className='col-12'>
                            <Button variant="contained" fullWidth size="large" type="submit">Sign up</Button>
                            <div className='mt-2 text-center'><small>Already have an Account?</small> <NavLink to="/login" className="text-dark">Sign in</NavLink></div>
                        </div>
                    </div>
                    <div style={{ marginTop: "20%"}}>
                    <small>
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

        </>)
}