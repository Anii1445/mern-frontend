import { useAuth } from "../store/auth-ContextAPI";
import "../css/hover.css";
import "../css/category.css";
import "../css/accordion.css";
import "../css/product-img.css";
import { Box } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import "../css/underline.css";
import { PiSortAscendingBold } from "react-icons/pi";
import "../css/product-card.css";
import { useTheme, useMediaQuery } from "@mui/material";
import { FaArrowRight } from "react-icons/fa6";
import { ImStarFull } from "react-icons/im";
import { TiThMenu } from "react-icons/ti";
import { BsGridFill } from "react-icons/bs";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";
import {
  Navigate,
  NavLink,
  useAsyncError,
  useNavigate,
} from "react-router-dom";
import { BsStars } from "react-icons/bs";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { BsCaretUpSquare } from "react-icons/bs";
import { PiHeartDuotone } from "react-icons/pi";
import { BsCart2 } from "react-icons/bs";
import { GiElectric } from "react-icons/gi";
import TextField from "@mui/material/TextField";
import "../css/filter.css";
import { Drawer } from "@mui/material";
import { FaAngleUp } from "react-icons/fa";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch } from "react-redux";
import { setCartTotal, setOrderInfo } from "../store/checkoutSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Carousel } from "bootstrap";
import Pagination from "@mui/material/Pagination";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { FiFilter } from "react-icons/fi";
import { setSearchText } from "../store/searchSlice";
import { RiLoader2Line } from "react-icons/ri";
const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const {
    user,
    ApiWeight,
    token,
    ApiFlavour,
    ApiCategory,
    ApiBrands,
    isLoggedIn,
    authLoading,
  } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productsRef = useRef(null);
  const { searchText } = useSelector((state) => state.search);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const el = document.querySelector("#carouselExampleDark");
    if (el) {
      new Carousel(el, {
        interval: 2500,
        ride: "carousel",
        pause: false,
      });
    }
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [ApiWishlists, setApiWishlists] = useState([]);
  const getWishlists = async () => {
    try {
      const response = await fetch(
        `${API}/api/auth/allWishlistsByID/${user.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      setApiWishlists(data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleWishlist = (productId, variant_id) => {
    if (isLoggedIn) {
      if (ApiWishlists?.some((a) => a.variant_id === variant_id)) {
        // setApiWishlists(ApiWishlists.filter((id) => id !== productId)); // UI changes instantly
        Delete(variant_id); // remove from wishlist
      } else {
        // setApiWishlists([...ApiWishlists, productId]);
        Save(productId, variant_id); // add to wishlist
      }
    } else {
      toast.warning("Hii, Please Login!", {
        position: "top-center",
        autoClose: 2000,
        style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
      });
      navigate("/login");
    }
  };

  const [carts, setCarts] = useState([]);
  const getCartByUser = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch(
          `${API}/api/auth/getUserCart/${user?.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        if (response.ok) {
          setCarts(data);
          dispatch(setCartTotal(data));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (user && user?.userId) {
      getWishlists();
      getCartByUser();
    }
  }, [user]);

  const Delete = async (variant_id) => {
    setWishlistLoading(variant_id);
    try {
      const response = await fetch(
        `${API}/api/auth/deleteWishlistByProductID`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.userId,
            variant_id: variant_id,
          }),
        },
      );
      if (response.ok) {
        getWishlists();
        setWishlistLoading(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWishlistLoading(null);
    }
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let fullDate = `${day} ${months[month]} ${year}`;

  const Save = async (p_id, variant_id) => {
    setWishlistLoading(variant_id);
    try {
      const response = await fetch(`${API}/api/auth/wishlist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.userId,
          product_id: p_id,
          variant_id: variant_id,
          date: fullDate,
        }),
      });

      if (response.ok) {
        toast.success("Added to Wishlist!", {
          position: "top-center",
          autoClose: 2000,
          style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
        });
        getWishlists();
        setWishlistLoading(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWishlistLoading(null);
    }
  };

  // ---------------- Rating Remarks --------------- //
  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.1: "Useless++",
    1.2: "Useless+++",
    1.3: "Useless+++",
    1.4: "Useless+++",
    1.5: "Poor",
    1.6: "Poor+",
    1.7: "Poor++",
    1.8: "Poor+++",
    1.9: "Poor+++",
    2: "Not Good",
    2.1: "Not Good+",
    2.2: "Not Good++",
    2.3: "Not Good+++",
    2.4: "Not Good+++",
    2.5: "Average",
    2.6: "Average+",
    2.7: "Average++",
    2.8: "Average+++",
    2.9: "Average+++",
    3: "Ok",
    3.1: "Ok+",
    3.2: "Ok++",
    3.3: "Ok++",
    3.4: "Ok+++",
    3.5: "Ok+++",
    3.6: "Good",
    3.7: "Good+",
    3.8: "Good++",
    3.9: "Good+++",
    4: "Good+++",
    4.1: "Very Good",
    4.2: "Very Good+",
    4.3: "Very Good++",
    4.4: "Very Good+++",
    4.5: "Very Good+++",
    4.6: "Excellent",
    4.7: "Excellent+",
    4.8: "Excellent++",
    4.9: "Excellent+++",
    5: "Excellent+++",
  };

  const view = (id) => {
    navigate(`/product/view/${id}`);
  };

  const AddtoCart = async (
    id,
    variant_id,
    weight,
    flavour,
    price,
    mrp,
    img,
  ) => {
    setButtonLoading(variant_id);
    if (isLoggedIn) {
      try {
        const response = await fetch(`${API}/api/auth/cart`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.userId,
            product_id: id,
            variant_id: variant_id,
            product_price: price,
            product_flavour: flavour,
            product_weight: weight,
            product_mrp: mrp,
            product_qty: 1,
            product_img: img,
          }),
        });

        if (response.ok) {
          toast.success("Added To Cart!", {
            position: "top-center",
            autoClose: 2000,
            style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
          });
          getCartByUser();
          setButtonLoading(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setButtonLoading(null);
      }
    } else {
      setButtonLoading(null);
      toast.warning("Please Login for better experience!", {
        position: "top-center",
        autoClose: 2000,
        style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
      });
      navigate("/login");
    }
  };

  const BuyNow = async (id, variant_id, weight, flavour, price, mrp, img) => {
    const included = carts.some(
      (a) => a.product_id === id && a.variant_id === variant_id,
    );
    setButtonLoading(variant_id);
    if (isLoggedIn) {
      if (!included) {
        try {
          const response = await fetch(`${API}/api/auth/cart`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.userId,
              product_id: id,
              variant_id: variant_id,
              product_price: price,
              product_flavour: flavour,
              product_weight: weight,
              product_mrp: mrp,
              product_qty: 1,
              product_img: img,
            }),
          });

          if (response.ok) {
            getCartByUser();
            setButtonLoading(null);
            let cartProducts = [
              {
                product_id: id,
                variant_id,
                product_price: price,
                product_qty: 1,
              },
            ];
            dispatch(setOrderInfo({ mrp, price, cartProducts }));
            navigate("/checkout");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setButtonLoading(null);
        }
      } else {
        let cartProducts = [
          { product_id: id, variant_id, product_price: price, product_qty: 1 },
        ];
        dispatch(setOrderInfo({ mrp, price, cartProducts }));
        setButtonLoading(null);
        navigate("/checkout");
      }
    } else {
      setButtonLoading(null);
      toast.warning("Please Login for better experience!", {
        position: "top-center",
        autoClose: 2000,
        style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
      });
      navigate("/login");
    }
  };

  const [AllReviewByCustomers, setAllReviewByCustomers] = useState([]);

  const getReviewByCustomers = async () => {
    try {
      const response = await fetch(`${API}/api/auth/AllProductReview`, {
        method: "GET",
      });

      const data = await response.json();
      setAllReviewByCustomers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReviewByCustomers();
  }, []);

  const weightRanges = [
    { label: "Under 500g", min: 0, max: 500 },
    { label: "500g - 1kg", min: 500, max: 1000 },
    { label: "1kg - 2kg", min: 1000, max: 2000 },
    { label: "2kg - 4kg", min: 2000, max: 4000 },
    { label: "5kg & Above", min: 5000, max: 99999 },
  ];

  const [selectCategory, setSelectCategory] = useState("");
  const [selectBrand, setSelectBrand] = useState("");
  const [selectFlavour, setSelectFlavour] = useState("");
  const [selectWeight, setSelectWeight] = useState(null);
  const [maxValue, setMaxValue] = useState(20000);
  const [sortOrder, setSortOrder] = useState("");
  const [sortProducts, setSortProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState("");

  const sort = async () => {
    try {
      const response = await fetch(`${API}/api/auth/listSortProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: searchText?.trim() ? searchText.trim() : undefined,
          sortBy: "price",
          sortOrder: Number(sortOrder ? sortOrder : 1), // 1 or -1
          brand: selectBrand,
          category: selectCategory,
          flavour: selectFlavour,
          minWeight: selectWeight?.min,
          maxWeight: selectWeight?.max,
          minPrice: 0,
          maxPrice: maxValue,
          page,
          limit: 6,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSortProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // when user searches again, clear filters
    setSelectBrand("");
    setSelectCategory("");
    setSelectFlavour("");
    setSelectWeight(null);
    setSortOrder("");
    setPage(1);
  }, [searchText]);

  useEffect(() => {
    setPage(1);
  }, [
    sortOrder,
    maxValue,
    searchText,
    selectWeight,
    selectBrand,
    selectCategory,
    selectFlavour,
  ]);

  useEffect(() => {
    productsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setLoading(true);
    sort();
  }, [
    sortOrder,
    maxValue,
    selectWeight,
    searchText,
    page,
    selectFlavour,
    selectBrand,
    selectCategory,
  ]);

  const clearAll = () => {
    setSelectBrand("");
    setSelectCategory("");
    setSelectFlavour("");
    setSortOrder("");
  };

  return (
    <>
      <div className="container">
        <div
          className="justify-content-center"
          style={{ paddingTop: isMobile ? "20%" : "10%" }}
        >
          <div className="card mb-4">
            <div className="card-body">
              <div className="text-center mb-1 d-flex align-items-center justify-content-center gap-3">
                <BsStars style={{ color: "orange", fontSize: "30px" }} />
                <h3
                  className="section-title"
                  style={{
                    background: "linear-gradient(90deg, #007bff, #00c6ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  Top Categories For You
                </h3>
                <BsStars style={{ color: "orange", fontSize: "30px" }} />
              </div>

              <div>
                {/* // --------------------------- Shop by category -------------------------- // */}

                <Stack
                  direction="row"
                  // divider={<Divider orientation="vertical" flexItem />}
                  spacing={isMobile ? 1 : 5}
                  sx={{
                    overflowX: "auto", // Enables horizontal scroll
                    whiteSpace: "nowrap", // Prevents wrapping
                    padding: 2, // Optional: Adds space
                    "&::-webkit-scrollbar": {
                      height: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "grey",
                      borderRadius: 4,
                    },
                    "& > *": {
                      flexShrink: 0, // Prevents shrinking of items
                    },
                  }}
                >
                  {ApiCategory.map((c, i) => {
                    return (
                      <Item
                        key={i}
                        onClick={(e) => {
                          setSelectCategory(c.category);
                          dispatch(setSearchText(""));
                          setSelectBrand("");
                          setSelectFlavour("");
                          setSelectWeight("");
                          productsRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                        sx={{ cursor: "pointer", border: "1px solid #D3D3D3" }}
                      >
                        <img src={c.img} className="carousel-img" />
                        <div className="mt-2 carousel-text">{c.category}</div>
                      </Item>
                    );
                  })}
                </Stack>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* // ------------------------- Image Slider --------------------- // */}
{!isMobile && 
      <div
        id="carouselExampleDark"
        className="carousel carousel-dark mb-4 slide"
        data-bs-ride="carousel"
        data-bs-interval="2500"
        // data-bs-pause="hover"
      >
        <div className="carousel-indicators" >
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="0"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="1"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="2"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="3"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="4"
            className="active"
            aria-current="true"
            aria-label="Slide 4"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="5"
            aria-label="Slide 5"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="6"
            aria-label="Slide 6"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to="7"
            aria-label="Slide 7"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item text-center">
            <img
              src="/MuscleBlaze.webp"
              alt="..." 
              style={{ width: "100%", height: "100%"}}
            />
          </div>
          <div className="carousel-item text-center">
            <img
              src="/Avatar.webp"
              alt="..."   
                  style={{ width: "100%", height: "100%"}}
            />
          </div>
          <div className="carousel-item text-center">
            <img
              src="/BigMuscle.webp"
              alt="..."   
                  style={{ width: "100%", height: "100%"}}
            />
          </div>
          <div className="carousel-item active text-center">
            <img
              src="/HK_Vitals.webp"
              alt="..."   
                  style={{ width: "100%", height: "100%"}}
            />
          </div>
          <div className="carousel-item text-center">
            <img
              src="/YogaBar.webp"
              alt="..."   
                  style={{ width: "100%", height: "100%"}}
            />
          </div>
          <div className="carousel-item text-center">
            <img
              src="/Pintola.webp"
              alt="..."   
                  style={{ width: "100%", height: "100%"}}
            />
          </div>
          <div className="carousel-item text-center">
            <img
              src="/MuscleTech.webp"
              alt="..." 
              style={{ width: "100%", height: "100%"}}
            />
          </div>
        </div>

        
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      
      </div>}

      <div className="container">
        <div className="justify-content-center">
          <div className="card mb-4">
            <div className="card-body">
              <div className="text-center mb-1 d-flex align-items-center justify-content-center gap-3">
                <BsStars style={{ color: "orange", fontSize: "30px" }} />
                <h3
                  className="section-title"
                  style={{
                    background: "linear-gradient(90deg, #007bff, #00c6ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  Brand Range
                </h3>
                <BsStars style={{ color: "orange", fontSize: "30px" }} />
              </div>

              <div>
                {/* // --------------------------- Shop by Brand -------------------------- // */}

                <Stack
                  direction="row"
                  spacing={isMobile ? 4 : 8}
                  sx={{
                    overflowX: "auto", // Enables horizontal scroll
                    whiteSpace: "nowrap", // Prevents wrapping
                    padding: 2, // Optional: Adds space
                    "&::-webkit-scrollbar": {
                      height: 3,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "grey",
                      borderRadius: 4,
                    },
                    "& > *": {
                      flexShrink: 0, // Prevents shrinking of items
                    },
                  }}
                >
                  {ApiBrands.map(
                    (b, i) =>
                      b.brand &&
                      b.img && (
                        <img
                          key={i}
                          onClick={(e) => {
                            setSelectBrand(b.brand);
                            dispatch(setSearchText(""));
                            setSelectCategory("");
                            setSelectFlavour("");
                            setSelectWeight("");
                          }}
                          src={b.img}
                          className="carousel-img"
                        />
                      ),
                  )}
                </Stack>
              </div>
            </div>
          </div>

          {/* -------------------- Products Listing Section ------------------------ */}
          {loading ? (
            /* 1️⃣ LOADING STATE */
            <div
              ref={productsRef}
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
            >
              <div className="spinner-grow text-secondary" role="status"></div>
              <div className="text-muted">Loading...</div>
            </div>
          ) : sortProducts.length === 0 ? (
            <div
              ref={productsRef}
              className="text-center"
              style={{ marginTop: "1%" }}
            >
              <img
                src="/no-results.svg"
                style={{ width: isMobile && "100%" }}
              />
              <h5 style={{ marginBottom: "2px", fontSize: isMobile && "18px" }}>
                We tried hard to find results for you.
              </h5>
              <small>Try searching with a different keyword.</small>
            </div>
          ) : (
            <>
              {isMobile && (
                <div className="row mb-3" ref={productsRef}>
                  <div className="col-6">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FiFilter />}
                      onClick={() => setFilterOpen(true)}
                    >
                      Add Filters
                    </Button>
                  </div>
                  <div className="col-6 d-flex justify-content-end">
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel
                        sx={{ fontSize: "12px" }}
                        id="demo-select-small-label"
                      >
                        Sort By
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Sort By"
                        size="small"
                        sx={{
                          fontSize: "13px",
                          height: "34px",
                        }}
                      >
                        <MenuItem
                          sx={{
                            fontSize: "13px",
                            height: "28px",
                          }}
                          value={1}
                        >
                          Price: Low to High
                        </MenuItem>
                        <MenuItem
                          sx={{
                            fontSize: "13px",
                            height: "28px",
                          }}
                          value={-1}
                        >
                          Price: High to Low
                        </MenuItem>
                        {/* <MenuItem value={-1}>Newest: Latest First</MenuItem> */}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              )}

              {!isMobile && (
                <div ref={productsRef} className="row-filter mb-2">
                  <div className="column-filter">
                    <h6
                      style={{ cursor: "pointer" }}
                      onClick={() => setFilterOpen(true)}
                    >
                      <FiFilter
                        style={{ fontSize: "20px", marginRight: "5px" }}
                      />
                      Filters
                    </h6>
                  </div>
                  <div className="column-filter">
                    <h6>
                      All Products{" "}
                      <span style={{ color: "grey", fontSize: "15px" }}>
                        {selectBrand && `/ ${selectBrand}`}{" "}
                        {selectCategory && `/ ${selectCategory}`}{" "}
                        {selectFlavour && `/ ${selectFlavour}`}{" "}
                      </span>
                    </h6>
                  </div>
                  <div className="column-filter d-flex justify-content-end">
                    <FormControl size="small" sx={{ minWidth: 165 }}>
                      <InputLabel
                        
                        id="demo-select-small-label"
                      >
                        Sort By
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Sort By"
                        size="small"
                       
                      >
                        <MenuItem
                         
                          value={1}
                        >
                          Price: Low to High
                        </MenuItem>
                        <MenuItem
                         
                          value={-1}
                        >
                          Price: High to Low
                        </MenuItem>
                        {/* <MenuItem value={-1}>Newest: Latest First</MenuItem> */}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              )}

              <div className="row-category">
                <Box
                  className="filter-column"
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  {/* CATEGORY */}
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<FaAngleUp />}>
                      <Typography className="filter-title">Category</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {ApiCategory.map((c, index) => (
                        <div key={index} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectCategory === c.category}
                            onChange={(e) =>
                              setSelectCategory(
                                e.target.checked ? c.category : "",
                              )
                            }
                          />
                          <label className="form-check-label">
                            {c.category}
                          </label>
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>

                  {/* BRAND */}
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<FaAngleUp />}>
                      <Typography className="filter-title">Brand</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {ApiBrands.map((b, index) => (
                        <div key={index} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectBrand === b.brand}
                            onChange={(e) =>
                              setSelectBrand(e.target.checked ? b.brand : "")
                            }
                          />
                          <label className="form-check-label">{b.brand}</label>
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>

                  {/* WEIGHT */}
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<FaAngleUp />}>
                      <Typography className="filter-title">Weight</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {weightRanges.map((w, i) => (
                        <div key={i} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectWeight?.label === w.label}
                            onChange={(e) =>
                              setSelectWeight(e.target.checked ? w : null)
                            }
                          />
                          <label className="form-check-label">{w.label}</label>
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>

                  {/* PRICE */}
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<FaAngleUp />}>
                      <Typography className="filter-title">Price</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Slider
                        value={maxValue}
                        valueLabelDisplay="auto"
                        onChange={(e, v) => setMaxValue(v)}
                        min={599}
                        max={40000}
                      />
                      <small className="price-range">
                        ₹399 – ₹{maxValue.toLocaleString("en-IN")}
                      </small>
                    </AccordionDetails>
                  </Accordion>

                  {/* FLAVOUR */}
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<FaAngleUp />}>
                      <Typography className="filter-title">Flavour</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {ApiFlavour.map((f, index) => (
                        <div key={index} className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectFlavour === f.flavour}
                            onChange={(e) =>
                              setSelectFlavour(
                                e.target.checked ? f.flavour : "",
                              )
                            }
                          />
                          <label className="form-check-label">
                            {f.flavour}
                          </label>
                        </div>
                      ))}
                    </AccordionDetails>
                  </Accordion>

                  {/* CLEAR */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="clear-filter-btn"
                    onClick={clearAll}
                    sx={{ marginTop: "10px" }}
                  >
                    Clear All Filters
                  </Button>
                </Box>

                <div className="columns">
                  {!isMobile ? (
                    <div
                      style={{
                        marginBottom: "8px",
                        backgroundColor: "#F5F5F5",
                        padding: "6px 6px 6px 6px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <b>{`${totalProducts ? totalProducts : 0} PRODUCTS AVAILABLE`}</b>
                      <b>{`${searchText && `Showing results for "${searchText}"`}`}</b>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginBottom: "8px",
                        fontSize: "15px",
                        backgroundColor: "#F5F5F5",
                        padding: "6px 6px 6px 6px",
                        borderRadius: "5px",
                      }}
                    >
                      <b>{`${totalProducts ? totalProducts : 0} PRODUCTS AVAILABLE`}</b>
                      <br />
                      <b>{`${searchText && `Showing results for "${searchText}"`}`}</b>
                    </div>
                  )}
                  <div className="row g-3">
                    {sortProducts.map((p, index) => {
                      const productReviews = AllReviewByCustomers.filter(
                        (r) => r.variant_id === p.variant[0]._id,
                      );

                      const isLoading = buttonLoading === p.variant[0]._id;

                      const avgRating =
                        productReviews.length > 0
                          ? (
                              productReviews.reduce(
                                (a, b) => a + b.cust_rating,
                                0,
                              ) / productReviews.length
                            ).toFixed(1)
                          : 0;

                      const wishlistLoad = wishlistLoading === p.variant[0]._id;
                      return (
                        <div
                          className="col-12 col-sm-6 col-md-4 align-items-stretch"
                          key={index}
                        >
                          <div className="card h-100 d-flex flex-column onHover product-card"  onClick={(e) => {
                               e.stopPropagation(); view(p._id);
                              }} style={{ cursor: "pointer" }}>
                            <div
                              className="card-header"
                            >
                              <Box
                                sx={{ fontSize: { xs: "24px", sm: "24px" } }}
                              >
                                {wishlistLoad ? (
                                  <RiLoader2Line
                                    style={{
                                      float: "right",
                                      marginBottom: "8px",
                                      color: "grey",
                                    }}
                                  />
                                ) : (
                                  
                                  <PiHeartDuotone
                                    style={{
                                      float: "right",
                                      marginBottom: "8px",
                                      color: ApiWishlists?.some(
                                        (a) =>
                                          a.variant_id === p.variant[0]._id,
                                      )
                                        ? "red"
                                        : "grey",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleWishlist(p._id, p.variant[0]._id);
                                    }} // <-- stops triggering card header click
                                  />
                                )}
                              </Box>
                              <Box
                                sx={{
                                  height: { xs: "180px", sm: "180px" },
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={p?.variant?.[0]?.image?.[0]}
                                  alt="Product_img"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                    // borderRadius: "6px",
                                    // border: "1px solid #ddd",
                                    // padding: "7px 7px 7px 7px",
                                  }}
                                />
                              </Box>
                              <div
                                className="flex-grow-1 d-flex"
                                style={{ justifyContent: "space-between" }}
                              >
                                <div>
                                  <Box
                                    sx={{
                                      color: "white",
                                      fontSize: { xs: "12px", sm: "13px" },
                                    }}
                                  >
                                    <span
                                      className="px-2 py-1 bg-warning"
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "5px",
                                      }}
                                    >
                                      {avgRating || 0} <ImStarFull />
                                    </span>
                                  </Box>
                                </div>
                                <div>
                                  <img
                                    src={`${p.dietaryPreference === "Veg" ? "/veg.svg" : "/non-veg.svg"}`}
                                    style={{
                                      width: "25px",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="card-body flex-grow-1 d-flex flex-column">
                              <div style={{ display: "inline" }}>
                                <small
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontSize: isMobile && "15px"
                                  }}
                                >
                                  <strong>{p.brand.toUpperCase()}</strong> -{" "}
                                  {p.name}
                                </small>
                              </div>
                              <div style={{ display: "inline" }}>
                                <small>{p.variant[0].flavour}</small> |{" "}
                                <small>
                                  {p.variant[0].weight > 999
                                    ? `${p.variant[0].weight / 1000}Kg`
                                    : `${p.variant[0].weight}g`}
                                </small>
                              </div>
                              <div className="mt-3">
                                <h5
                                  style={{
                                    display: "inline",
                                    marginRight: isMobile ? "2%":"5%",
                                    fontWeight: isMobile && "600"
                                  }}
                                >
                                  ₹{p.variant[0].price.toLocaleString("en-IN")}
                                  .00
                                </h5>
                                <span>
                MRP:{" "}
                <del style={{ fontSize: "17px", color: "grey", marginRight: isMobile ? "2%":"5%", }}>₹{p?.variant?.[0]?.mrp}.00</del>
              </span>
                                <b>
                                  <small
                                    style={{
                                      display: "inline",
                                      color: "#34A56F",
                                      fontSize: isMobile && "16px"
                                    }}
                                  >
                                    ({" "}
                                    {Math.round(
                                      ((p.variant[0].mrp - p.variant[0].price) /
                                        p.variant[0].mrp) *
                                        100,
                                    )}
                                    % off )
                                  </small>
                                </b>

                                </div>

                              <div className="mt-auto">
                                {carts.some(
                                  (c) =>
                                    c.product_id === p._id &&
                                    c.variant_id === p.variant[0]._id,
                                ) ? (
                                  <Button
                                    variant="outlined"
                                    startIcon={<FaArrowRight />}
                                    sx={{
                                      fontSize: {
                                        xs: "12px",
                                        sm: "13.5px",
                                        md: "14px",
                                      },
                                      marginBottom: "10px",
                                      marginTop: "5%",
                                    }}
                                    onClick={(e) => {navigate("/carts"); e.stopPropagation(); }}
                                    fullWidth
                                  >
                                    Go To Cart
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outlined"
                                    disabled={isLoading}
                                    startIcon={
                                      isLoading ? (
                                        <RiLoader2Line />
                                      ) : (
                                        <BsCart2 />
                                      )
                                    }
                                    sx={{
                                      fontSize: {
                                        xs: "12px",
                                        sm: "13.5px",
                                        md: "14px",
                                      },
                                      marginBottom: "10px",
                                      marginTop: "5%",
                                    }}
                                    fullWidth
                                    onClick={(e) => {
                                      e.stopPropagation();  
                                      AddtoCart(
                                        p._id,
                                        p.variant[0]._id,
                                        p.variant[0].weight,
                                        p.variant[0].flavour,
                                        p.variant[0].price,
                                        p.variant[0].mrp,
                                        p.variant[0].image[0],
                                      );
                                    }}
                                  >
                                    {isLoading ? "Adding..." : "Add To Cart"}
                                  </Button>
                                )}
                                <Button
                                  variant="contained"
                                  startIcon={<GiElectric />}
                                  fullWidth
                                  sx={{
                                    fontSize: {
                                      xs: "12px",
                                      sm: "13.5px",
                                      md: "14px",
                                    },
                                  }}
                                  onClick={() => {
                                    BuyNow(
                                      p._id,
                                      p.variant[0]._id,
                                      p.variant[0].weight,
                                      p.variant[0].flavour,
                                      p.variant[0].price,
                                      p.variant[0].mrp,
                                      p.variant[0].image[0],
                                    );
                                  }}
                                >
                                  Buy Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <Typography sx={{ mt: { xs: 2, sm: 4 } }}>
            Page: {totalPages > 0 ? page : 0}
          </Typography>
          <Stack spacing={2} sx={{ mt: { xs: 2, sm: 4 } }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              variant="outlined"
              color="primary"
            />
          </Stack>
        </div>
      </div>

      {/* ----------------------- Filter Drawer -----------------------  */}
      <Drawer
        anchor="bottom"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            mb={1}
            sx={{ display: "flex", alignItems: "center", gap: "3px" }}
          >
            <FiFilter /> Add Filters
          </Typography>

          {/* SAME filter-column content */}
          <div className="filter-column">
            {/* Category, Brand, Price, etc */}
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<FaAngleUp />}>
                <Typography className="filter-title">Category</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {ApiCategory.map((c, index) => (
                  <div key={index} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectCategory === c.category}
                      onChange={(e) =>
                        setSelectCategory(e.target.checked ? c.category : "")
                      }
                    />
                    <label className="form-check-label">{c.category}</label>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* BRAND */}
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<FaAngleUp />}>
                <Typography className="filter-title">Brand</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {ApiBrands.map((b, index) => (
                  <div key={index} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectBrand === b.brand}
                      onChange={(e) =>
                        setSelectBrand(e.target.checked ? b.brand : "")
                      }
                    />
                    <label className="form-check-label">{b.brand}</label>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* WEIGHT */}
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<FaAngleUp />}>
                <Typography className="filter-title ">Weight</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {weightRanges.map((w, i) => (
                  <div key={i} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectWeight?.label === w.label}
                      onChange={(e) =>
                        setSelectWeight(e.target.checked ? w : null)
                      }
                    />
                    <label className="form-check-label">{w.label}</label>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>

            {/* PRICE */}
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<FaAngleUp />}>
                <Typography className="filter-title">Price</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Slider
                  value={maxValue}
                  valueLabelDisplay="auto"
                  onChange={(e, v) => setMaxValue(v)}
                  min={599}
                  max={40000}
                />
                <small className="price-range">
                  ₹399 – ₹{maxValue.toLocaleString("en-IN")}
                </small>
              </AccordionDetails>
            </Accordion>

            {/* FLAVOUR */}
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<FaAngleUp />}>
                <Typography className="filter-title">Flavour</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {ApiFlavour.map((f, index) => (
                  <div key={index} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectFlavour === f.flavour}
                      onChange={(e) =>
                        setSelectFlavour(e.target.checked ? f.flavour : "")
                      }
                    />
                    <label className="form-check-label">{f.flavour}</label>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <Button
                fullWidth
                variant="contained"
                size="medium"
                onClick={() => setFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
            <div className="col-6">
              <Button
                variant="contained"
                fullWidth
                size="medium"
                className="clear-filter-btn"
                onClick={() => {
                  clearAll();
                  setFilterOpen(false);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </Box>
      </Drawer>
    </>
  );
}
