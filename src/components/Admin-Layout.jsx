import { useState } from "react";
import "../css/dropdownUser.css";
import { GiBodyBalance } from "react-icons/gi";
import { Outlet, NavLink } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
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
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate  = useNavigate();


  useEffect(() => {
      if (isMobile) {
      setOpen(false);        // Close desktop drawer
     } else {
      setMobileOpen(false);  // Close mobile drawer
     }
  }, [isMobile]);

  return (
    
    <Box>
      <CssBaseline />

      {/* ================= APP BAR ================= */}
      <AppBar position="fixed" open={open}>
        <Toolbar>
          {!open && !isMobile && (
            <IconButton color="inherit" onClick={() => setOpen(true)} style={{ fontSize: "28px", border: "1px solid white", borderRadius: "5px", padding: "5px" }}>
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
                     {isMobile && <Box
                      color="inherit"
                      sx={{ display: { xs: "block", md: "none" }, mr: 1, cursor: "pointer",  border: "1px solid white", borderRadius: "5px", padding: "2px"  }}
                      onClick={() => setMobileOpen(true)}
                    >
                      <IoMenu size={28} />
                    </Box>}
            <Typography
                          sx={{ flexShrink: 0 }}
                        >
                          
                            <NavLink to="/" style={{textDecoration: "none", color: "white"}}>
                            <h6 style={{ display: "inline", backgroundColor: "white", color: "#1976d2", fontSize: isMobile && "14px", padding: "10px 8px 8px"}}><GiBodyBalance style={{fontSize:"25px"}}/> FITNESS</h6> 
                            <h6 style={{ display: "inline", border: "1px solid white", fontSize: isMobile && "14px", padding: "9.5px 10px 7.5px"}}>1</h6>
                            </NavLink>
                        
                        
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          {isLoggedIn && <div className="dropdown position-relative">
            <div data-bs-toggle="dropdown" aria-expanded="false">
              <Tooltip title={ user ? user.name : "Account"}>
                <IconButton size="small">
                  <Avatar
                    sx={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, bgcolor: "lightblue", color: "inherit" }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </div>
          
    <ul className="dropdown-menu dropdown-menu-end">
    <li onClick={()=>navigate("/admin/admin-info")}>
      <Link className="dropdown-item account-row"  style={{ color: "#3D3C3A", paddingLeft: "12px" }}>
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
    <li><Link to="/login" className="dropdown-item account-row" style={{ color: "red" }} onClick={LogoutUser}>
    <IconButton>
       <RiLogoutCircleRLine style={{ fontSize: "21px", color: "red" }}/>
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
        <Toolbar sx={{ display: "flex", gap:"18px", alignItems:"center", backgroundColor: "#DBE9FA" }}>
        
          <IconButton onClick={() => setOpen(false)} style={{ fontSize: "27px",  border: "1px solid grey", borderRadius: "5px", padding: "5px" }}>
            <IoMenu />
          </IconButton>
          <b style={{ fontSize: "18px" }}>{user?.name}</b>
          
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
                     pl: open ? 4.1 : 5,
                     pr: 4.6,
                  }}
                >
                  <Tooltip title={item.text} placement="right">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      fontSize: "23px"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  </Tooltip>
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
    style={{ textDecoration: "none", color: "red" }}
    onClick={LogoutUser}
  >
    <ListItem disablePadding>
      <ListItemButton
        sx={{
          justifyContent: open ? "initial" : "center",
          pl: 4.1,
          pr: 4.6,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
            fontSize: "23px",
            color:"red"
          }}
        >
          <RiLogoutCircleRLine />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          primaryTypographyProps={{
               sx: { color: "red" }
          }}
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
        <Outlet />
      </Box>




       <MuiDrawer
        anchor="left"
        variant="temporary"        
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
          ModalProps={{
          keepMounted: true,         
        }}
        sx={{ display: { xs: "block", md: "none" }, zIndex: 2000 }}
      >
         <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "space-between"
    }}
  >
        <Box sx={{ width: 300, p: 2 }}>
           <Box sx={{ display: "flex", justifyContent: "space-between", gap:"24px", alignItems: "center"}}> 
           <Box sx={{ display: "flex", justifyContent: "left", gap:"24px", alignItems: "center", paddingLeft: "3px"}}>
            <Box>
              <Avatar sx={{ width: 45, height: 45, bgcolor: "lightblue", color: "#1769aa" }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </Box>
            {!isLoggedIn && !user ? 
            <Box sx={{ maxWidth: 150, cursor: "pointer" }} onClick={() => navigate("/login")}><Typography variant="h6" style={{ fontSize:"16px" }}>Login / Signup</Typography></Box>
            :
           <Box sx={{ maxWidth: 150 }}>
               <Typography variant="h6" style={{ fontSize:"18px" }}>Hi,</Typography>
               <Typography variant="h6" style={{ fontSize:"16px", marginTop: "-5px" }} noWrap title={user?.name}>{user?.name}</Typography>
           </Box>            
      }
            </Box>
            <Box>
                <IconButton><RxCross2 style={{ fontSize: "20px", cursor: "pointer", color:"grey" }} onClick={()=>{setMobileOpen(false)}}/></IconButton>
            </Box>
            </Box>
          
      
          <Divider sx={{ my: 1, backgroundColor: "black" }} />
      
          <List>
            <ListItemButton onClick={() => { navigate("/admin/dashboard"); setMobileOpen(false); }}>
              <ListItemIcon><VscGraph style={{fontSize: "20px", color: "#1769aa"}}/></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
      
            <ListItemButton onClick={() => { navigate("/admin/allproducts"); setMobileOpen(false); }}>
              <ListItemIcon><FaBoxOpen style={{fontSize: "20px", color: "#1769aa"}}/></ListItemIcon>
              <ListItemText primary="Products" />
            </ListItemButton>
      
            <ListItemButton onClick={() => { navigate("/admin/users"); setMobileOpen(false); }}>
              <ListItemIcon><FaUsers style={{fontSize: "20px", color: "#1769aa"}}/></ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
      
            
              <ListItemButton onClick={() => { navigate("/admin/servicecenter"); setMobileOpen(false); }}>
                <ListItemIcon><RiCustomerService2Fill style={{fontSize: "20px", color: "#1769aa"}}/></ListItemIcon>
                <ListItemText primary="Service Center" />
              </ListItemButton>
          </List>
        </Box>

        <Box sx={{ mt: "auto", p:2 }}>   
          <Divider sx={{ backgroundColor: "black" }} />
          <List>
          {isLoggedIn && user && (
              <ListItemButton onClick={() => { navigate("/login"); setMobileOpen(false); LogoutUser() }}>
                <ListItemIcon><RiLogoutCircleRLine style={{fontSize: "20px", color: "red"}}/></ListItemIcon>
                <ListItemText primary="Logout"  primaryTypographyProps={{
    sx: { color: "red" }
  }}/>
              </ListItemButton>
            )}
          </List>
        </Box>
        </Box>
      </MuiDrawer>
      
    </Box>
  );
}
