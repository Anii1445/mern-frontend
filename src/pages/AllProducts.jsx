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
        if(token){
           getAllProducts();
        }
    },[user, token]);


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
              name: "Actions",
              button: "true",
              cell: (row) => (
          
                <Button
                 variant="outlined"
                 size="size"
                 startIcon={<FaEye/>}
                 onClick={() => navigate(`/admin/productVariants/${row._id}`)}
                >
                  View
                </Button>
                )
        }
      ];
    

     const TableHeader = (
        <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
        
          <h4 style={{ margin: 0 }}>Products List <small className="fs-6 text-muted">(Total Products: {allProducts?.length})</small></h4>
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
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
    <div className="spinner-grow text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>

  </div>  : 
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
        </div>}
      </div>
    </div>
        </>
    )
}