import { use, useEffect } from "react"
import { useAuth } from "../store/auth-ContextAPI";
const API = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { TextField } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import {Button} from "@mui/material";
import { FaEye } from "react-icons/fa";
import { useTheme, useMediaQuery } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa6";

export default function ProductVariants(){

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {user, token} = useAuth();
    const [productVariants, setProductVariants] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [isloading, setisLoading] = useState(false);
    const { id } = useParams();
    const [filteredVariants, setFilteredVariants] = useState(false);

    const getAllProducts = async() => {

      if(!search){
       setisLoading(true);
       }
        try {
            const response = await fetch(`${API}/api/admin/getProductVariantByID/${id}`,{
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            if(response.ok){
                const data = await response.json();
                setProductVariants(data);
                setFilteredVariants(data); // also set filtered list initially
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


    console.log(productVariants);
     const columns = [
        {
          name: "Flavour",
          selector: (row) => row.flavour,
          sortable: true,
        },
        {
          name: "Weight",
          selector: (row) => row.weight > 999 ? `${row.weight/1000}Kg` : `${row.weight}g`,
          sortable: true,
        },
        {
          name: "MRP",
          selector: (row) => `₹${row.mrp}`,
          sortable: true,
        },
        {
          name: "Unit Price",
          width: isMobile && "150px",
          selector: (row) => `₹${row.price}`,
          sortable: true,
        },
        {
          name: "Stock",
          selector: (row) => `${row.inStock} Unit`,
          sortable: true,
        }
      ];
    

     const TableHeader = (
        <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
        
          <h4 style={{ margin: 0 }}>Variant List <small className="fs-6 text-muted">(Total Variants: {productVariants?.length})</small></h4>
          <TextField
            variant="outlined"
            placeholder="Search Variants..."
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

  useEffect(() => {
  if (!search) {
    setFilteredVariants(productVariants);
  } else {
    const filtered = productVariants.filter((variant) =>
      variant.flavour.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredVariants(filtered);
  }
}, [search, productVariants]);


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

  </div>  : <>
        <div className="card shadow-sm">
          <div className="card-body">
            {filteredVariants ? (
              <div className="table-responsive">
                <DataTable
                  title={TableHeader}
                  columns={columns}
                  data={filteredVariants}
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
        <div className="d-flex justify-content-end mt-2">  
         <Button variant="contained" startIcon={<FaArrowLeft/>} onClick={() => navigate(-1)}>Back</Button>
        </div>
        </>}
      </div>
    </div>
        </>
    )
}