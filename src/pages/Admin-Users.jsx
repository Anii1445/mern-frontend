import { useEffect } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import { FiSearch } from "react-icons/fi";
import InputAdornment from "@mui/material/InputAdornment";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BsBoxSeamFill } from "react-icons/bs";
const API = import.meta.env.VITE_API_URL;
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { Card, Chip, Box, Typography, CardContent } from "@mui/material";

export default function AdminUsers() {
  const { token } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const [isloading, setisLoading] = useState(false);

  console.log(allUsers);
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      hide: "sm"
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      hide: "sm"
    },
    {
      name: "Role",
      selector: (row) => row.isAdmin === false ? 'User' : 'Admin',
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => <Chip
                          label='Active'
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: 'rgba(67,233,123,0.15)',
                            color: 'success.main',
                          }}
                        />,
      sortable: true,
    },
    {
      name: "Actions",
      button: "true",
      width: "160px",
      cell: (row) => (row.isAdmin ?
        <div className="d-flex flex-md-row gap-1 w-100">
        <button
          className="btn btn-white border border-success btn-sm w-100"
          onClick={() => handleEdit(row._id)}
        >
          <MdEdit style={{ color: "grey" }} /> Edit
        </button>
        </div>
        :
        <div className="d-flex flex-md-row gap-1 w-100">
        <button
          className="btn btn-white border border-danger btn-sm w-100"
          onClick={() => handleDelete(row._id)}
        >
          <RiDeleteBin6Fill style={{ color: "grey", fontSize: "17px" }} /> Delete
        </button>
        <button
          className="btn btn-white border border-primary btn-sm w-100"
          onClick={() => navigate(`/admin/userOrders/${row._id}`)}
        >
          <BsBoxSeamFill style={{ color: "grey" }} /> Orders
        </button>
        </div>
        
      ),
    },
  ];

  const handleEdit = async (id)=> {
    navigate(`/admin/userEdit/${id}`)
  }

  const handleDelete = async (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this user?</p>
          <button
            className="btn btn-light btn-sm border"
            onClick={async () => {
              // Your delete logic here
              try {
                const response = await fetch(
                  `${API}/api/admin/user/delete/${id}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (response.ok) {
                  toast.success("User Deleted Successfully!", {
                    position: "top-center",
                    autoClose: 2000, 
                    style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
                });
                  getAllUsers();
                }
              } catch (error) {
                console.log(error);
              }
              closeToast();
            }}
          >
            Yes
          </button>
          <button
            className="btn btn-light ms-2 btn-sm border"
            onClick={closeToast}
          >
            No
          </button>
        </div>
      ),
      {
        position: "top-center",  
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const [search, setSearch] = useState("");

  const getAllUsers = async () => {
    
    if(!search){
       setisLoading(true);
    }
    try {
      const response = await fetch(`${API}/api/admin/users?name=${search}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response){
      const data = await response.json();
      setAllUsers(data);
      setisLoading(false);
      }
      
    } catch (error) {
      console.log(error);
    }finally{
      setisLoading(false);
    }
  };

  useEffect(() => {
    if(token){
    getAllUsers();
  }
  }, [token, search]);

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "white",
        color: "grey",
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
  };

  const TableHeader = (
    <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
    
      <h4 style={{ margin: 0, fontWeight: 800, color: '#1976d2', }}>All User Lists </h4>
      <TextField
        variant="outlined"
        placeholder="Search Users..."
        size="small"
        value={search}
        onChange={(e) => {setSearch(e.target.value)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <FiSearch />
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "white",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "grey",
            },
            "&:hover fieldset": {
              borderColor: "grey",
            },
            "&.Mui-focused fieldset": {
              borderColor: "lightgrey",
            },
          },
        }}
      />
    </div>
  );

  return (
    <> 
    <div className="container-fluid container-md">
      <div className="justify-content-center">
        {isloading ?  <div
    className="d-flex justify-content-center align-items-center gap-1"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
    <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div>  : 
  <>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1976d2', mb: 0.5 }}>
            Team Members
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Manage all registered users in the system
          </Typography>
        </Box>
    </Box>
   <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2.5,
              bgcolor: "lightblue", display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FaUsers style={{ color: '#1565c0', fontSize: "22px" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>Total Users</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {allUsers.length}
                </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2.5,
              bgcolor: '#FFE87C', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MdAdminPanelSettings style={{ color: '#D4A017', fontSize: "22px" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>Admins</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {allUsers.filter((a) => a.isAdmin === "true").length}
                </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2.5,
              bgcolor: '#C3FDB8', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FaUserCheck style={{ color: '#12AD2B', fontSize: "22px" }} />
            </Box>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {allUsers.filter((a) => a.isAdmin === "false").length}
                </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

        <div className="card shadow-sm">
          <div className="card-body">
            {allUsers ? (
              <div className="table-responsive">
                <DataTable
                  title={TableHeader}
                  columns={columns}
                  data={allUsers}
                  button={true}
                  customStyles={customStyles}
                  pagination
                  highlightOnHover
                />
              </div>
            ) : (
              <h3>Access Denied, Not an Admin</h3>
            )}
          </div>
        </div>
        </>}
      </div>
    </div>
    </>
  );
}
