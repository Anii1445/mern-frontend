import { FaUser } from "react-icons/fa";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaH, FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth-ContextAPI";
import { NavLink } from "react-router-dom";
import "../css/active-item.css";
const API = import.meta.env.VITE_API_URL;

export default function MyAccount() {

    const navigate = useNavigate();
    const {user, LogoutUser} = useAuth();
    
  return (
    <>
      <div className="container">
        <div className="justify-content">
          <div className="row">
            <div className="col-3" style={{ marginTop: "7.2%" }}>
              <div className="card">
                <div className="card-body">
                  <div className="list-group">
                    <NavLink
  to="personal-information"
  className={({ isActive }) =>
    `list-group-item list-group-item-action list-group-item-light ${
      isActive ? "active-item" : ""
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
    `list-group-item list-group-item-action list-group-item-light ${
      isActive ? "active-item" : ""
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
    `list-group-item list-group-item-action list-group-item-light ${
      isActive ? "active-item" : ""
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
    `list-group-item list-group-item-action list-group-item-light ${
      isActive ? "active-item" : ""
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
    `list-group-item list-group-item-action list-group-item-light ${
      isActive ? "active-item" : ""
    }`
  }
  style={{ padding: "30px", textDecoration: "none" }}
>
  <RiLogoutCircleRLine style={{ marginRight: "5%", fontSize: "20px" }} />
  Logout
</NavLink>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
                <Outlet/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
