import { useEffect } from "react"
import { useAuth } from "../store/auth-ContextAPI";
const API = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import {Button} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { Card, Chip, Box, Typography, CardContent } from "@mui/material";
import { FaBoxOpen } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";


export default function AllProducts(){

    const {user, token} = useAuth();
    const [allProducts, setAllProducts] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [isloading, setisLoading] = useState(false);

    const getAllProducts = async() => {

      if(!search){
       setisLoading(true);
       }
        try {
            const response = await fetch(`${API}/api/admin/getAllProductsList?name=${search}`,{
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            if(response.ok){
                const data = await response.json();
                setAllProducts(data);
                setisLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
        finally{
          setisLoading(false);
        }
    }

    useEffect(()=>{
           getAllProducts();
    },[search ,token]);


    const deleteProduct = async (id) => {
        toast(
          ({ closeToast }) => (
            <div>
              <p style={{ color: "black" }}>Are you sure you want to delete this user?</p>
              <div className="d-flex gap-1 align-items-center">
              <button
                className="btn btn-outline-danger btn-sm border d-flex gap-1 align-items-center"
                onClick={async () => {
                  // Your delete logic here
                  setisLoading(true);
                  try {
                    const response = await fetch(
                      `${API}/api/admin/deleteProduct/${id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
    
                    if (response.ok) {
                      setisLoading(false);
                      toast.success("Product Deleted Successfully!", {
                        position: "top-center",
                        autoClose: 2000, 
                        style: {
        maxWidth: "80px", // or any width that fits mobile
        width: "auto",
        margin: "0 auto",
        textAlign: "center",
      },
                    });
                      getAllProducts();
                    }
                  } catch (error) {
                    console.log(error);
                  }finally{
                    setisLoading(false);
                  }
                  closeToast();
                }}
              >
                <FaCheck/>Yes
              </button>
              <button
                className="btn btn-primary btn-sm border d-flex gap-1 align-items-center"
                onClick={closeToast}
              >
               <RxCross2/>No
              </button>
              </div>
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
    
    console.log(allProducts);
     const columns = [
        {
          name: "Name",
          selector: (row) => row.name,
          sortable: true,
        },
        {
          name: "Brand",
          selector: (row) => row.brand,
          sortable: true,
          width: "150px"
        },
        {
          name: "Category",
          selector: (row) => row.category,
          sortable: true,
          width: "200px"
        },
        {
          name: "Manufacturer",
          selector: (row) => row.manufacturer,
          sortable: true,
          hide: "sm"
        },
        {
          name: "Supplier",
          selector: (row) => row.supplier,
          sortable: true,
          hide: "sm"
        },
        {
          name: "Stock",
          selector: (row) => <Chip
                          label='InStock'
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: '#C3FDB8',
                            color: 'success.main',
                          }}
                        />,
          sortable: true
        },
        {
              name: "Actions",
              button: "true",
              width: "150px",
              cell: (row) => (
               <div className="d-flex gap-1 align-items-center">
                <button
                className="btn btn-outline-primary btn-sm d-flex gap-1 align-items-center"
                 onClick={() => navigate(`/admin/productVariants/${row._id}`)}
                >
                  <FaEye/>View
                </button>
                <button
                 className="btn btn-outline-danger btn-sm d-flex gap-1 align-items-center"
                 onClick={() => deleteProduct(row._id)}
                >
                  <MdDeleteForever style={{ fontSize: "17px"}}/>Delete
                </button>
                </div>
              )
        }
      ];
    

     const TableHeader = (
        <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
             <h4 style={{ margin: 0, fontWeight: 800, color: '#1976d2', }}>Product Lists </h4>
      
          <TextField
            variant="outlined"
            placeholder="Search Products..."
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
           All Products
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Manage all products in the system
          </Typography>
        </Box>
    </Box>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                  <Card sx={{ width: "100%" }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: 2.5,
                        bgcolor: "lightblue", display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <FaBoxOpen style={{ color: '#1565c0', fontSize: "22px" }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>Total Products</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                            {allProducts.length}
                          </Typography>
                      </Box>
                      </Box>
                      <Box>
                      <Button variant="outlined" startIcon={<FiPlus/>} onClick={()=>{navigate("/admin/addproducts")}}>Add More</Button>
                      </Box>
                    </CardContent>
                  </Card>
        </Box>
        <div className="card shadow-sm">
          <div className="card-body">
            {allProducts ? (
              <div className="table-responsive">
                <DataTable
                  title={TableHeader}
                  columns={columns}
                  data={allProducts}
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
    )
}