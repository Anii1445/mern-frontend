import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-ContextAPI";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import "../css/dropdown.css";
import "../css/dropdownUser.css";
import { GiBodyBalance } from "react-icons/gi";
import { IoCartSharp } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { RiLogoutCircleRLine } from "react-icons/ri";
import Box from "@mui/material/Box";
import { PiHeartLight } from "react-icons/pi";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { IoMenu, IoSettingsSharp } from "react-icons/io5";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { LuLogOut } from "react-icons/lu";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { BsSearch } from "react-icons/bs";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import AppBar from "@mui/material/AppBar";
import { VscGraph } from "react-icons/vsc";
import { FaUsers, FaBoxOpen } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineInventory } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import { GiShoppingCart } from "react-icons/gi";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import { setSearchText } from "../store/searchSlice";
import { useDispatch } from "react-redux";
import { useRef } from "react";


export default function Navbar() {

  const navigate = useNavigate();
  const { isLoggedIn, user, token, LogoutUser } = useAuth();
  const { cartTotal } = useSelector((state) => state.checkout);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

useEffect(() => {

   if(isSelecting) {
    setIsSelecting(false);
    return;
  }


  if (!search.trim()) {
    setSuggestions([]);
    setShowDropdown(false);
    return;
  }

  const timer = setTimeout(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/search?q=${encodeURIComponent(search)}`,{
          method: "GET",
          headers: {
             "Content-Type": "application/json",          }
        }
      );

      const data = await res.json();
      if(res.ok){
         setSuggestions(data);
         setShowDropdown(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, 200); // debounce delay

  return () => clearTimeout(timer);
}, [search]);


useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



  return (
    <>
      <Box>
        <CssBaseline />
         <AppBar position="fixed">
          
                   <Toolbar>
             <div className="container">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: 0,
        }}
      >
            
            <Typography
              variant="h6"
              sx={{ flexShrink: 0 }}
            >
              
                <NavLink to="/" style={{textDecoration: "none", color: "white"}}>
                <b style={{ display: "inline", backgroundColor: "white", color: "#1976d2", padding: "10px 8px 8px", fontSize:"22px"}}><GiBodyBalance style={{fontSize:"25px"}}/> FITNESS</b> 
                <b style={{ display: "inline", border: "1px solid white", padding: "9px 15px 7px", fontSize:"22px"}}>1</b>
                </NavLink>
            
            </Typography>

            {/* // ------------------------ Search Bar ---------------------------- // */}
            <Box
 sx={{
            flex: "1 1 auto",
            display: "flex",
            justifyContent: "center",
            minWidth: 0,
          }}
>
            <TextField variant="outlined" size="small" placeholder="Search Products, Brand, Category..."
            slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><BsSearch style={{ color: "white", fontSize: "20px" }}/></InputAdornment>,
            },
          }} 
            onChange={(e) => {setSearch(e.target.value);
              // dispatch(setSearchText(search))
              }}
            value={search}
            onFocus={() => {search && setShowDropdown(true)}}
            onKeyDown={(e) => {
      if (e.key === "Enter") {
        dispatch(setSearchText(search));
        setShowDropdown(false);
        navigate("/");
      }
    }}
          sx={{
    width: "700px",

    /* Text + placeholder */
    "& .MuiOutlinedInput-root": {
      color: "white",
      backgroundColor: "rgba(255,255,255,0.15)",

      "& fieldset": {
        borderColor: "rgba(255,255,255,0.15)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(255,255,255,0.15)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(255,255,255,0.15)",
      },
    },

    "& input::placeholder": {
      color: "rgba(255,255,255,0.7)",
    },
  }}/>

  {showDropdown && suggestions.length > 0 && (
   <Box
    ref={dropdownRef}
    sx={{
      position: "absolute",
      top: "56px",
      width: "46%",
      backgroundColor: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      borderRadius: "6px",
      zIndex: 1300,
      maxHeight: "270px",
      overflowY: "auto",
    }}
  >
     {/* 🔹 Header */}
  {search && (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 16px",
      borderBottom: "1px solid #e0e0e0",
      position: "sticky",
      top: 0,
      backgroundColor: "white",
      zIndex: 1,
    }}
  >
    {/* Yellow vertical line */}
    <Box
      sx={{
        width: "5px",
        height: "22px",
        backgroundColor: "primary.main", // yellow
        borderRadius: "2px",
      }}
    />

    {/* Text */}
    <Typography
      sx={{
        fontSize: "18px",
        fontWeight: 500,
        color: "#222",
      }}
    >
      Suggested Products :{" "}
      <span style={{ fontWeight: 600 }}>{search}</span>
    </Typography>
  </Box>
)}

    {suggestions.map((item) => (
      <>
      <Box
        key={item._id}
        sx={{
          padding: "10px",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#DBE9FA" },
        }}
        onClick={() => {
          setIsSelecting(true);
          setShowDropdown(false);
          setSuggestions([]);
          // dispatch(setSearchText(item.name));
          // setSearch(item.name);
          navigate(`/product/view/${item._id}`);
        }}
        
      >
        <Typography variant="body2" color="black">
          <img src={item.image[0]} 
      width={50}
      style={{ objectFit: "contain", marginRight: "5px" }}/>{item.name}, {item.weight}{item.weightUnit}
        </Typography>
      </Box>
      </>
    ))}
  </Box>)}
</Box>

          
            
            {/* // ------------------- Login Button -------------------- // */}
            <Box sx={{ flexGrow: 1 }} />

{isLoggedIn && <div className="dropdown position-relative">
  <div data-bs-toggle="dropdown" aria-expanded="false">
    <Tooltip title="Account">
      <IconButton size="small">
        <Avatar
          sx={{ width: 32, height: 32, bgcolor: "lightblue", color: "inherit" }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
      </IconButton>
    </Tooltip>
  </div>

  <ul className="dropdown-menu dropdown-menu-end">
    <li>
      <Link to="/myaccount/personal-information" className="dropdown-item account-row"  style={{ color: "#3D3C3A", paddingLeft: "12px" }}>
      <IconButton>
        <Avatar sx={{ width: 28, height: 28, bgcolor: "lightblue", color: "inherit" }}>
          {user?.name?.charAt(0)}
        </Avatar>
      </IconButton>
      <span className="account-item">
        <span className="username">{user?.name}</span>
        <MdKeyboardArrowRight className="arrow-icon" />
      </span>
      </Link>
    </li>
    <li><hr className="dropdown-divider"/></li>
   
    <li><Link to="/myaccount/myorders" className="dropdown-item account-row" style={{ color: "#3D3C3A" }}>
        <IconButton>
          <BsFillBoxSeamFill style={{ fontSize: "21px" }}/>
          </IconButton>
          My Orders
        </Link>
    </li>
    <li><Link to="/login" className="dropdown-item account-row" style={{ color: "#3D3C3A" }} onClick={LogoutUser}>
    <IconButton>
       <RiLogoutCircleRLine style={{ fontSize: "21px" }}/>
    </IconButton>
        Logout
      </Link>
    </li>
  </ul>
</div>}


            {!isLoggedIn && (
              <NavLink
                to="/login"
                style={{ textDecoration: "none", color: "white" }}
              >
                <Button
                  color="inherit"
                  variant="outlined"
                  size="medium"
                  startIcon={<FaUserCircle />}
                  sx={{ textTransform: "" }}
                >
                  Login / Sign Up
                </Button>
              </NavLink>
            )}

            {/* // ----------------- Whislist Icon --------------- // */}
          
             <Tooltip title="Wishlists Items">
              <NavLink to="/whishlist">
              <IconButton
                
                size="small"
                sx={{ ml: 1 }}
              >
                
                  <PiHeartLight
                    style={{ fontSize: "30px", color: "white" }}
                  />
                   
              </IconButton>
              </NavLink>
            </Tooltip>

            {/* // ----------- Cart Icon ---------- // */}
            
            <Tooltip title="Cart Items">
              <NavLink to="/carts">
              <IconButton
                
                size="small"
                sx={{ ml: 1 }}
              >
                <Badge
                  badgeContent={cartTotal ? cartTotal.length : 0}
                  color="warning"
                  overlap="circular"
                  showZero
                >
                  <GiShoppingCart
                    style={{ fontSize: "30px", color: "white" }}
                  />
                </Badge>    
              </IconButton>
              </NavLink>
            </Tooltip>
            </Box>
    </div>
          </Toolbar>
        </AppBar>
 
     

        {/* // ------------------ Mini Variant Drawer (Side Bar) -----------------// */}
        
      </Box>
    </>
  );
}
