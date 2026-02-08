import { useState } from "react";
import "../css/dropdownUser.css";
import { GiBodyBalance } from "react-icons/gi";
import { Outlet, NavLink } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Avatar,
  Link
} from "@mui/material";
import "../css/dropdown.css"
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { IoMenu } from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";
import { FaBoxOpen, FaUsers } from "react-icons/fa";
import { useAuth } from "../store/auth-ContextAPI";
import { MdKeyboardArrowRight } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RiCustomerService2Fill } from "react-icons/ri";
import { IoBagSharp } from "react-icons/io5";
import { useTheme, useMediaQuery } from "@mui/material";

const drawerWidth = 240;

/* ---------------- APP BAR ---------------- */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"]),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

/* ---------------- DRAWER ---------------- */
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : theme.spacing(10),
    transition: theme.transitions.create("width"),
    overflowX: "hidden",
  },
}));

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn, LogoutUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  
  return (
    
    <Box>
      <CssBaseline />

      {/* ================= APP BAR ================= */}
      <AppBar position="fixed" open={open}>
        <Toolbar>
          {!open && !isMobile && (
            <IconButton color="inherit" onClick={() => setOpen(true)} style={{ fontSize: "30px" }}>
              <IoMenu />
            </IconButton>
          )}

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
                          sx={{ flexShrink: 0, ml: 2  }}
                        >
                          
                            <NavLink to="/" style={{textDecoration: "none", color: "white"}}>
                            <p style={{ display: "inline", backgroundColor: "white", color: "#1976d2", padding: "10px 8px 8px"}}><GiBodyBalance style={{fontSize:"25px"}}/> FITNESS</p> 
                            <p style={{ display: "inline", border: "1px solid white", padding: "9px 15px 7px"}}>1</p>
                            </NavLink>
                        
                        
          </Typography>

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
    <li><Link to="/login" className="dropdown-item account-row" style={{ color: "#3D3C3A" }} onClick={LogoutUser}>
    <IconButton>
       <RiLogoutCircleRLine style={{ fontSize: "21px" }}/>
    </IconButton>
        Logout
      </Link>
    </li>
  </ul>
          </div>}
</Box>
</div>

        </Toolbar>
      </AppBar>

      {/* ================= DRAWER ================= */}
      {!isMobile && 
      <Drawer variant="permanent" open={open}>
         <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "space-between"
    }}
  >
    <Box>
        <Toolbar sx={{ display: "flex", gap:"15px", alignItems:"center", backgroundColor: "#DBE9FA" }}>
        
          <IconButton onClick={() => setOpen(false)} style={{ fontSize: "30px" }}>
            <IoMenu />
          </IconButton>
          <b style={{ fontSize: "20px" }}>{user?.name}</b>
          
        </Toolbar>

        <Divider sx={{ backgroundColor: "black" }}/>

        <List>
          {[
            { text: "Dashboard", icon: <VscGraph />, path: "/admin/dashboard" },
            { text: "Products", icon: <FaBoxOpen />, path: "/admin/allproducts" },
            { text: "Users", icon: <FaUsers />, path: "/admin/users" },
            { text: "Customer Service", icon: <RiCustomerService2Fill />, path: "/admin/servicecenter" },
          ].map((item) => (
            <NavLink
              to={item.path}
              key={item.text}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    justifyContent: open ? "initial" : "center",
                     pl: open ? 4.6 : 4.6,
                     pr: 4.6,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "20px"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))}

</List>
</Box>
         <Box sx={{ mt: "auto" }}>
  <Divider style={{ backgroundColor: "black" }}/>
<List>
  <NavLink
    to="/login"
    style={{ textDecoration: "none", color: "inherit" }}
    onClick={LogoutUser}
  >
    <ListItem disablePadding>
      <ListItemButton
        sx={{
          justifyContent: open ? "initial" : "center",
          pl: 4.6,
          pr: 4.6,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
            fontSize: "20px"
          }}
        >
          <RiLogoutCircleRLine />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          sx={{ opacity: open ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  </NavLink>
  </List>
</Box>
        </Box>
      </Drawer>}

      {/* ================= MAIN CONTENT ================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: isMobile ? "0px" : open ? `${drawerWidth}px` : "56px",
          transition: "margin 0.3s",
        }}
      >
        <Toolbar />
         <div className="d-block d-md-none" style={{ paddingTop: isMobile && "12%",  position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1050,
    background: "white"}} >
  <div className="card rounded-0">
    <div className="card-body p-0">
      <div className="col-12 d-flex overflow-auto">
        {[
                 { label: "Dashboard", icon: <VscGraph />, path: "/admin/dashboard" },
            { label: "Products", icon: <FaBoxOpen />, path: "/admin/allproducts" },
            { label: "Users", icon: <FaUsers />, path: "/admin/users" },
            { label: "Customer Service", icon: <RiCustomerService2Fill />, path: "/admin/servicecenter" },
                ].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
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
<div style={{ height: isMobile && "70px" }} />

        <Outlet />
      </Box>
    </Box>
  );
}
