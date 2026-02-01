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


export default function AdminUsers() {
  const { token } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();


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
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.isAdmin === false ? 'User' : 'Admin',
      sortable: true,
    },
    {
      name: "Actions",
      button: "true",
      width: "160px",
      cell: (row) => (row.isAdmin ?
        <div className="d-flex w-100">
        <button
          className="btn btn-white border border-success btn-sm w-100"
          onClick={() => handleEdit(row._id)}
        >
          <MdEdit style={{ color: "grey" }} /> Edit
        </button>
        </div>
        :
        <div className="d-flex gap-1 w-100">
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
    try {
      const response = await fetch(`${API}/api/admin/users?name=${search}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setAllUsers(data);
      
    } catch (error) {
      console.log(error);
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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h4 style={{ margin: 0 }}>Users List</h4>
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
    <div className="container">
      <div className="justify-content-center">
        <div className="card shadow-sm">
          <div className="card-body">
            {allUsers ? (
              <>
                <DataTable
                  title={TableHeader}
                  columns={columns}
                  data={allUsers}
                  button={true}
                  customStyles={customStyles}
                  pagination
                  highlightOnHover
                />
              </>
            ) : (
              <h3>Access Denied, Not an Admin</h3>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
