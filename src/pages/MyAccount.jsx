import { FaUser } from "react-icons/fa";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaH, FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth-ContextAPI";
import { NavLink } from "react-router-dom";
import "../css/active-item.css";
import { useTheme, useMediaQuery } from "@mui/material";
const API = import.meta.env.VITE_API_URL;

export default function MyAccount() {

    const navigate = useNavigate();
    const {user, LogoutUser} = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    
  return (
    <>
      <div className="container">
        <div className="justify-content-center">
          <div className="row">
            <div className="col-12 col-md-3 d-none d-md-block col-md-3" style={{ paddingTop: isMobile ? "18%" : "7.2%" }}>
              <div className="card shadow-sm">
                <div className="card-body p-0">
                  <div className="list-group">
                    <NavLink
  to="personal-information"
  className={({ isActive }) =>
    `flex-fill ${
      isActive ? "active-item" : "text-dark"
    }`
  }
  style={{ padding: "30px", textDecoration: "none" }}
>
  <FaUser style={{ marginRight: "5%", fontSize: "20px" }} />
  Personal Information
</NavLink>

<NavLink
  to="myorders"
  className={({ isActive }) =>
    `flex-fill ${
      isActive ? "active-item" : "text-dark"
    }`
  }
  style={{ padding: "30px", textDecoration: "none" }}
>
  <BsBoxSeamFill style={{ marginRight: "5%", fontSize: "20px" }} />
  My Orders
</NavLink>

                    <NavLink
  to="addresses"
  className={({ isActive }) =>
    `flex-fill ${
      isActive ? "active-item" : "text-dark"
    }`
  }
  style={{ padding: "30px", textDecoration: "none" }}
>
  <FaLocationDot style={{ marginRight: "5%", fontSize: "20px" }} />
  Addresses
</NavLink>
                    <NavLink
  to="mywishlist"
  className={({ isActive }) =>
    `flex-fill ${
      isActive ? "active-item" : "text-dark"
    }`
  }
  style={{ padding: "30px", textDecoration: "none" }}
>
  <FaHeart style={{ marginRight: "5%", fontSize: "20px" }} />
  My Wishlist
</NavLink>
                    <NavLink
  onClick={LogoutUser}
  to="/login"
  className={({ isActive }) =>
    `${
      isActive ? "active-item" : "text-danger"
    }`
  }
  style={{ padding: "30px", textDecoration: "none" }}
>
  <RiLogoutCircleRLine style={{ marginRight: "5%", fontSize: "20px", color: "red" }} />
  Logout
</NavLink>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-9">
              <div className="d-block d-md-none" style={{ paddingTop: isMobile && "11%",  position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1050,
    background: "white"}} >
  <div className="card rounded-0">
    <div className="card-body p-0">
      <div className="col-12 d-flex overflow-auto">
        {[
          { to: "personal-information", icon: <FaUser />, label: "Profile" },
          { to: "myorders", icon: <BsBoxSeamFill />, label: "Orders" },
          { to: "addresses", icon: <FaLocationDot />, label: "Address" },
          { to: "mywishlist", icon: <FaHeart />, label: "Wishlist" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-fill text-center px-3 py-3 text-decoration-none ${
                isActive ? "active-item" : "text-dark"
              }`
            }
          >
            <div style={{ fontSize: "18px" }}>{item.icon}</div>
            <small>{item.label}</small>
          </NavLink>
        ))}
      </div>
    </div>
  </div>
</div>
<div style={{ height: isMobile && "130px" }} />
                <Outlet/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
