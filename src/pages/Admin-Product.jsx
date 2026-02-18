import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { FaArrowLeft } from "react-icons/fa6";
import { useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import { BiSolidXCircle } from "react-icons/bi";
import Divider from "@mui/material/Divider";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Card, Chip, Box, Typography, CardContent } from "@mui/material";

export default function AdminProduct() {
  const [ApiCategory, setApiCategory] = useState([]);
  const [ApiFlavour, setApiFlavour] = useState([]);
  const [ApiBrands, setApiBrands] = useState([]);
  const [ApiWeight, setApiWeight] = useState([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();


  // Static fields state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [supplier, setSupplier] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [allergens, setAllergens] = useState("");
  const [bestBefore, setBestBefore] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [form, setForm] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [fssai, setFssai] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [proteinPerScoop, setProteinPerScoop] = useState("");
const API = import.meta.env.VITE_API_URL;


  // Dynamic fields state
  const [variant, setVariant] = useState([
    { weight: "", flavour: "", inStock: "", mrp: "", price: "", image: [] },
  ]);

  // Add new dynamic field
  const addNewField = () => {
    setVariant([
      ...variant,
      {
        weight: "",
        flavour: "",
        inStock: "",
        mrp: "",
        price: "",
        image: []
      },
    ]);
  };

  // Delete dynamic field
  // const Delete = (index) => {
  //   const element = document.getElementById(`row${index}`);

  //   if (index > 0) {
  //     element.remove();
  //   }
  // };

  const Delete = (index) => {
    if(index > 0){
    const updated = variant.filter((_, i) => i !== index);
    setVariant(updated);
    }
  };

  // Handling dynamic field change
  const handleChange = (index, field, value) => {
    const dynamicField = [...variant];
    dynamicField[index][field] = value;
    setVariant(dynamicField);
  };

  const handleImageChange = (index, files) => {
  const updatedVariant = [...variant];

  // Append new images instead of replacing
  updatedVariant[index].image = [
    ...updatedVariant[index].image,
    ...files
  ];

  setVariant(updatedVariant);
};


  const getCategory = async () => {
    try {
      const response = await fetch(`${API}/api/admin/category`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setApiCategory(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFlavour = async () => {
    try {
      const response = await fetch(`${API}/api/admin/flavour`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setApiFlavour(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getWeight = async () => {
    try {
      const response = await fetch(`${API}/api/admin/weight`,{
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setApiWeight(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getBrands = async () => {
    try {
      const response = await fetch(`${API}/api/admin/brand`,{
        method:"GET",
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setApiBrands(data);
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getCategory();
    getFlavour();
    getWeight();
    getBrands();
  }, []);
  

  const [errors, setErrors] = useState({});

  // On submit product
  const add = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("supplier", supplier);
      formData.append("manufacturer", manufacturer);
      formData.append("dietaryPreference", dietaryPreference);
      formData.append("form", form);
      formData.append("fssai", fssai);
      formData.append("ingredients", ingredients);
      formData.append("allergens", allergens);
      formData.append("bestBefore", bestBefore);
      formData.append("proteinPerScoop", proteinPerScoop);
      formData.append("servingSize", servingSize);


       // ✅ Send variant as JSON string
      formData.append("variant", JSON.stringify(variant));

      // ✅ Send ALL images with SAME KEY
      variant.forEach((v) => {
        v.image.forEach((file) => {
          formData.append("images", file); 
        });
      });

    try {
      const response = await fetch(
        `${API}/api/admin/add/product`,
        {
          method: "POST",
          headers: {
            Authorization : `Bearer ${token}`,
        },
          body: formData,
        }
      );

      const res_data = await response.json();
      if (response.ok) {
        toast.success("Product Added Successfully!", {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
             });

        navigate("/admin/allproducts");     

        // Reset dynamic fields
        setVariant([
          {
            image: [],
            weight: "",
            flavour: "",
            inStock: "",
            mrp: "",
            price: "",
          },
        ]);
        // Reset all fields
        setName("");
        setBrand("");
        setCategory("");
        setDescription("");
        setSupplier("");
        setManufacturer("");
        setAllergens("");
        setBestBefore("");
        setForm("");
        setIngredients("");
        setFssai("");
        setDietaryPreference("");
        setServingSize("");
        setProteinPerScoop("");
        setErrors("");
      }
      else{
        if (res_data.extraDetails) {
        setErrors(res_data.extraDetails[0].field);

            toast.error(res_data.extraDetails[0].message, {
                       position: "top-center",
                       autoClose: 2000, 
                       style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
                    });
                            
           }
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const removeImage = (variantIndex, imageIndex) => {
  const updatedVariant = [...variant];

  updatedVariant[variantIndex].image =
    updatedVariant[variantIndex].image.filter(
      (_, i) => i !== imageIndex
    );

  setVariant(updatedVariant);
};
console.log(errors)

  return (
    <>
      <div className="container">
        <div className="justify-content-center">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h4 className="pt-2">Add Product</h4>
              <Button variant="contained" size="small" onClick={() => {navigate("/admin/allproducts")}} startIcon={<FaArrowLeft/>}>
                            Back
              </Button> 
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-12 col-md-4 mb-2"> 
                  <TextField
                    type="text"
                    label="Name"
                    variant="outlined"
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    fullWidth
                    required 
                    error={errors === "name"}                
                    />
                </div>
                <div className="col-12 col-md-4 mb-2">
                  <FormControl fullWidth size="small" error={errors === "brand"} >
                          <InputLabel id="demo-simple-small-label">
                            Brand
                          </InputLabel>
                          <Select
                            labelId="demo-simple-small-label"
                            id="demo-simple-small"
                            label="Brand"
                            name="brand"
                            value={brand}
                            onChange={(e) =>
                              setBrand(e.target.value)
                            }
                            required
                          >    
                          <MenuItem value="">
  Select Brand
</MenuItem>               
                            {ApiBrands.map((b, i) => {
                              return (
                                <MenuItem value={b.brand}>
                                  {b.brand}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                </div>
                <div className="col-12 col-md-4 mb-2">
                  <FormControl fullWidth size="small" error={errors === "category"} >
                    <InputLabel id="demo-simple-small-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-small-label"
                      id="demo-simple-small"
                      label="Category"
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <MenuItem value="">
  Select Category
</MenuItem>
                      {ApiCategory.map((c, i) => {
                        return (
                          <MenuItem value={c.category}>{c.category}</MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-12 col-md-8 mb-2">
                  <TextField
                    type="text"
                    label="Product Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="description"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    error={errors === "description"} 
                  />
                </div>

                <div className="col-12 col-md-4">
                  <TextField
                    type="text"
                    label="Supplier"
                    variant="outlined"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    name="supplier"
                    size={isMobile && "small"}
                    fullWidth
                    sx={{ marginBottom: isMobile ? "8px":"12px"}}
                    required
                    error={errors === "supplier"} 
                  />
                  <TextField
                    type="text"
                    label="Manufacturer"
                    variant="outlined"
                    size={isMobile && "small"}
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    name="manufacturer"
                    fullWidth
                    required
                    error={errors === "manufacturer"} 
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-12 col-md-4 mb-2">
                  <TextField
                    type="text"
                     size="small"
                    label="Allergens"
                    variant="outlined"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    name="allergens"
                    fullWidth
                    required
                    error={errors === "allergens"} 
                  />
                  </div>
                  <div className="col-12 col-md-2 mb-2">
                  <FormControl fullWidth size="small" error={errors === "form"} >
                    <InputLabel id="demo-simple-small-label">
                      Form
                    </InputLabel>
                    <Select
                      labelId="demo-simple-small-label"
                      id="demo-simple-small"
                      label="Form"
                      name="form"
                      value={form}
                      onChange={(e) => setForm(e.target.value)}
                      required
                    >
                      <MenuItem value="">
  Select Form
</MenuItem>
                          <MenuItem value="Powder">Powder</MenuItem>
                          <MenuItem value="Capsules">Capsules</MenuItem>
                          <MenuItem value="Liquid">Liquid</MenuItem>
                    </Select>
                  </FormControl>
                  </div>
                  <div className="col-12 col-md-2 mb-2">
                   <TextField
                    type="text"
                     size="small"
                    label="Best Before"
                    variant="outlined"
                    value={bestBefore}
                    onChange={(e) => setBestBefore(e.target.value)}
                    name="bestBefore"
                    fullWidth
                    required
                    error={errors === "bestBefore"} 
                  />
                </div>

                <div className="col-12 col-md-2 mb-2">
                  <FormControl fullWidth size="small" error={errors === "dietaryPreference"} >
                    <InputLabel id="demo-simple-small-label">
                      Dietary Preference
                    </InputLabel>
                    <Select
                      labelId="demo-simple-small-label"
                      id="demo-simple-small"
                      label="Dietary Preference"
                      name="dietaryPreference"
                      value={dietaryPreference}
                      onChange={(e) => setDietaryPreference(e.target.value)}
                      required
                    >
                      <MenuItem value="">
  Select Dietary Preference
</MenuItem>
                          <MenuItem value="Veg">Veg</MenuItem>
                          <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                          <MenuItem value="Vegan">Vegan</MenuItem>
                    </Select>
                  </FormControl>
                  </div>
                  
                <div className="col-12 col-md-2">
                  <TextField
                  size="small"
                    type="text"
                    label="FSSAI Number"
                    variant="outlined"
                    value={fssai}
                    onChange={(e) => setFssai(e.target.value)}
                    name="fssai"
                    fullWidth
                    required
                    error={errors === "fssai"}
                  />
                 
                </div>
                
              </div>
              <div className="row mb-2">
                <div className="col-12 col-md-6 mb-2">
                  <TextField
                    type="text"
                    label="Ingredients"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    name="ingredients"
                    fullWidth
                    required
                    error={errors === "ingredients"}
                  />
                  </div>
              
              
                <div className="col-12 col-md-2 mb-2">
                  <TextField
                  size="small"
                    type="text"
                    label="Serving Size"
                    variant="outlined"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    name="servingSize"
                    fullWidth
                    required
                    error={errors === "servingSize"}
                  />
                 
                </div>
                
                <div className="col-12 col-md-2 mb-2">
                  <TextField
                  size="small"
                    type="text"
                    label="Protein Per scoop"
                    variant="outlined"
                    value={proteinPerScoop}
                    onChange={(e) => setProteinPerScoop(e.target.value)}
                    name="proteinPerScoop"
                    fullWidth
                    required
                    error={errors === "proteinPerScoop"}
                  />
                 
                </div>
              </div>
              <Divider sx={{ backgroundColor: "black", marginTop: "1%"}}/>
              <Button
                variant="outlined"
                sx={{marginTop: isMobile ? "4%":"1%"}}
                size="small"
                startIcon={<IoIosAddCircleOutline />}
                onClick={addNewField}
              >
                Add Variant
              </Button>

              <div className="card mb-3 mt-3">
                <div className="card-body">
                  {variant.map((field, index) => (
                    <div className="row mb-1 g-2" id={`row${index}`} key={index}>

                      <div className="col-12 col-md-4">
                      <input
                          type="file"
                          multiple
                          accept="image/*,.avif,.webp,.svg" 
                          id={`image-upload-${index}`}
                          name="image"
                          style={{ display: "none" }}
                          onChange={(e) =>
                          handleImageChange(index, Array.from(e.target.files))
                         }
                      />
                      <label htmlFor={`image-upload-${index}`} style={{border: "1px solid lightgrey", padding: "7px", backgroundColor: "#EEEEEE", cursor: "pointer", display:"flex", borderRadius: "6px"}}>
                         Upload Images
                      </label>
                      <div className="d-flex gap-2 mt-2 flex-wrap">
                        {field.image.map((file, imgIndex) => (
                         <div key={imgIndex} style={{ position: "relative" }}> 
                         <img
                           key={imgIndex}
                           src={URL.createObjectURL(file)}
                           alt="preview"
                           width={60}
                           height={60}
                           style={{
                           objectFit: "cover",
                           borderRadius: "6px",
                           border: "1px solid #ddd"
                           }}
                            />

                             <div
                              onClick={() => removeImage(index, imgIndex)}
                              style={{
                              position: "absolute",
                              top: "-12px",
                              right: "-8px",
                              border: "none",
                              color: "grey",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                              fontSize: "18px"
                            }}
                            >
                              <BiSolidXCircle/>
                           </div>
                           </div>
                          ))}
                      </div>

                      </div>

                      <div className="col-12 col-md-2 ">
                        <FormControl fullWidth size="small">
                          <InputLabel id="demo-simple-small-label">
                            Weight In Grams
                          </InputLabel>
                          <Select
                            labelId="demo-simple-small-label"
                            id="demo-simple-small"
                            label="Weight In Grams"
                            name="weight"
                            value={field.weight}
                            onChange={(e) =>
                              handleChange(index, "weight", e.target.value)
                            }
                            required
                          >
                            <MenuItem value="">
  Select Weight
</MenuItem>
                            {ApiWeight.map((w,index) => {
                              return(
                                <MenuItem value={w.weight}>{w.weight}</MenuItem>
                              )
                            })}
                            
                          </Select>
                        </FormControl>
                      </div>

                      <div className="col-12 col-md-2">
                        <FormControl fullWidth size="small">
                          <InputLabel id="demo-simple-small-label">
                            Flavour
                          </InputLabel>
                          <Select
                            labelId="demo-simple-small-label"
                            id="demo-simple-small"
                            label="Flavour"
                            name="flavour"
                            value={field.flavour}
                            onChange={(e) =>
                              handleChange(index, "flavour", e.target.value)
                            }
                            required
                          >
                            <MenuItem value="">
  Select Flavour
</MenuItem>
                            {ApiFlavour.map((f, i) => {
                              return (
                                <MenuItem value={f.flavour}>
                                  {f.flavour}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </div>
                      
                      <div className="col-6 col-md-1">
                        <TextField
                          type="text"
                          label="Stock"
                          variant="outlined"
                          value={field.inStock}
                          onChange={(e) =>
                            handleChange(index, "inStock", e.target.value)
                          }
                          name="inStock"
                          size="small"
                          fullWidth
                          required
                        />
                      </div>

                      <div className="col-6 col-md-1">
                        <TextField
                          type="text"
                          label="MRP"
                          variant="outlined"
                          size="small"
                          value={field.mrp}
                          onChange={(e) =>
                            handleChange(index, "mrp", e.target.value)
                          }
                          name="mrp"
                          fullWidth
                          required
                        />
                      </div>


                      <div className="col-6 col-md-1">
                        <TextField
                          type="text"
                          label="Price"
                          variant="outlined"
                          size="small"
                          value={field.price}
                          onChange={(e) =>
                            handleChange(index, "price", e.target.value)
                          }
                          name="price"
                          fullWidth
                          required
                        />
                      </div>
                      <div className="col-12 col-md-1">
                        {isMobile ? <Button
                          variant="outlined"
                          onClick={() => Delete(index)}
                          fullWidth
                          size="medium"
                          startIcon={<MdDeleteForever/>}
                        >
                          {isMobile && "Delete"}
                        </Button> :
                        <Button variant="outlined"
                          onClick={() => Delete(index)}
                          fullWidth
                          size="large">
                              <MdDeleteForever style={{fontSize: "24px"}}/>
                        </Button>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button loading={loading}
                  loadingPosition="start" fullWidth
                  startIcon={ loading && <ImSpinner8 /> } variant="contained" onClick={add}>
                ADD
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
