import { NavLink, useLocation, useParams } from "react-router-dom";
import "../css/grid.css";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { FaWhatsapp } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { RiLoader2Line } from "react-icons/ri";
import { PiSortAscendingBold } from "react-icons/pi";
import { FaUsersLine } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { Typography } from "@mui/material";
import { IoMdHome } from "react-icons/io";
import InputAdornment from "@mui/material/InputAdornment";
import { GiCheckMark } from "react-icons/gi";
import { BsBoxSeam } from "react-icons/bs";
import { LuDroplets } from "react-icons/lu";
import { BiBullseye } from "react-icons/bi";
import { BiPulse } from "react-icons/bi";
import { BiSolidZap } from "react-icons/bi";
import { CiDumbbell } from "react-icons/ci";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { FaArrowRight } from "react-icons/fa6";
import { PiUserLight } from "react-icons/pi";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { RxDotFilled } from "react-icons/rx";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useMemo, useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import Rating from "@mui/material/Rating";
import { LuHeart } from "react-icons/lu";
import { IoShareSocial } from "react-icons/io5";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { BsBullseye, BsCart2 } from "react-icons/bs";
import { GiConsoleController, GiElectric } from "react-icons/gi";
import Grid from "@mui/material/Grid";
import "../css/card.css";
import { useAuth } from "../store/auth-ContextAPI";
import Divider from "@mui/material/Divider";
import { MdOutlineSecurity } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GiWeightScale } from "react-icons/gi";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import { PiHeartDuotone } from "react-icons/pi";
import { Swiper, SwiperSlide } from "swiper/react";
import "../css/swiper.css";
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import "../css/zoom.css"
import "../css/scrollBar.css"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "../css/speeddial.css";
import { HiLink } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { setOrderInfo, setCartTotal } from "../store/checkoutSlice";
import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useRef } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
const API = import.meta.env.VITE_API_URL;


export default function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { token, isLoggedIn, user } = useAuth();
  const [selectWeight, setSelectWeight] = useState("");
  const [image, setImage] = useState("");
  const [selectFlavour, setSelectFlavour] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMRP] = useState("");
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [variantID, setVariantID] = useState("");
  const dispatch = useDispatch();
  const [reviewSorting, setReviewSorting] = useState("all");
  const reviewsContainerRef = useRef(null); 
  const [loadingButton, setLoadingButton] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(null);
 
  const copyLink = () => {
     navigator.clipboard.writeText(window.location.href);
      toast.success("Link Copied!",{
      position: "top-center",
      autoClose: 2000,
      style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  },
     })
  };
  console.log(pathname)

  const actions = [
  { icon: <PiTelegramLogoDuotone style={{ fontSize: "20px", color: "#1976d2"}}/>, name: 'Telegram', link: "https://webogram.org/" },
  { icon: <FaWhatsapp style={{ fontSize: "20px", color: "#1976d2"}}/>, name: 'WhatsApp', link: "https://web.whatsapp.com/"},
  { icon: <FaSquareFacebook style={{ fontSize: "20px", color: "#1976d2"}}/>, name: 'Facebook', link: "https://www.facebook.com/" },
  { icon: <FaInstagram style={{ fontSize: "20px", color: "#1976d2"}}/>, name: 'Instagram', link: "https://www.instagram.com/" },
  { icon: <IoIosLink style={{ fontSize: "20px", color: "#1976d2"}}/>, name: 'Copy Link', link:{pathname} }
];

  const review = () => {
    if (!isLoggedIn) {
      toast.warning("Please login or sign-up", {
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

  const getProductByID = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API}/api/auth/product/${id}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Couldn't fetch");
    }
    finally{
      setIsLoading(false);
    }
  };

  const [AllReviewByCustomers, setAllReviewByCustomers] = useState([]);

  const fetchReviews = async () => {
    const res = await fetch(
      `${API}/api/auth/productreviewsorting/${variantID && variantID}?sort=${reviewSorting}&page=1&limit=5`
    );
    const data = await res.json();
    setAllReviewByCustomers(data.reviews);
   };


  useEffect(() => {
  if (reviewsContainerRef.current) {
    reviewsContainerRef.current.scrollTo({top: 0, behavior: "smooth"});
  }
 }, [reviewSorting, variantID]);

  useEffect(() => {
     if(variantID){ fetchReviews() }
  }, [reviewSorting, variantID]);


  
  // const getReviewByCustomers = async () => {
  //   try {
  //     const response = await fetch(
  //       `${API}/api/auth/productReviewsByCustomers/${variantID && variantID}`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //     const data = await response.json();
  //     setAllReviewByCustomers(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  const [productJoin, setProductJoin] = useState([]);
  const getProductJoin = async() => {
    try {
      const response = await fetch(`${API}/api/auth/getProductJoin`,{
        method: "POST",
         headers: {
              "Content-Type": "application/json"
          },
        body: JSON.stringify({
          product_brand: product?.brand,
          product_category: product?.category
        })
      })

      const data = await response.json();
      setProductJoin(data);
    } catch (error) {
      console.log(error)
    }
  }

  // -------------- Overall Rating Calulation ------------------
  let sum = 0;
  let one_star_sum = [];
  let two_star_sum = [];
  let three_star_sum = [];
  let four_star_sum = [];
  let five_star_sum = [];

  for (let i = 0; i < AllReviewByCustomers.length; i++) {
    sum += AllReviewByCustomers[i].cust_rating;
    if (AllReviewByCustomers[i].cust_rating === 1) {
      one_star_sum.push(AllReviewByCustomers[i].cust_rating);
    }
    if (AllReviewByCustomers[i].cust_rating === 2) {
      two_star_sum.push(AllReviewByCustomers[i].cust_rating);
    }
    if (AllReviewByCustomers[i].cust_rating === 3) {
      three_star_sum.push(AllReviewByCustomers[i].cust_rating);
    }
    if (AllReviewByCustomers[i].cust_rating === 4) {
      four_star_sum.push(AllReviewByCustomers[i].cust_rating);
    }
    if (AllReviewByCustomers[i].cust_rating === 5) {
      five_star_sum.push(AllReviewByCustomers[i].cust_rating);
    }
  }
  let averageRating = sum / AllReviewByCustomers.length;

  // -------------- Specific Star Calculation -------------------
  let oneStar = (one_star_sum.length / AllReviewByCustomers.length) * 100;
  let twoStar = (two_star_sum.length / AllReviewByCustomers.length) * 100;
  let threeStar = (three_star_sum.length / AllReviewByCustomers.length) * 100;
  let fourStar = (four_star_sum.length / AllReviewByCustomers.length) * 100;
  let fiveStar = (five_star_sum.length / AllReviewByCustomers.length) * 100;

useEffect(() => {
  getProductByID();
}, [id]);

useEffect(() => {
  if (product?.brand && product?.category) {
    getProductJoin();
  }
}, [product]);


  //  useEffect(()=> {
  //   if(variantID){
  //      getReviewByCustomers();
  //   }
  //  },[variantID]);

  useEffect(() => {
    if (!product?.variant?.length) return;

    setSelectWeight(product?.variant?.[0]?.weight);
    setSelectFlavour(product?.variant?.[0]?.flavour);
    setVariantID(product?.variant?.[0]?._id);
  }, [product]);

  const minus = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const plus = () => {
    setQty(qty + 1);
  };


  const handleCart = async () => {
    setLoadingButton(true)
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
            variant_id: variantID ? variantID : product?.variant?.[0]?._id,
            product_price: price ? price : product?.variant?.[0]?.price,
            product_flavour: selectFlavour
              ? selectFlavour
              : product?.variant?.[0]?.flavour,
            product_weight: selectWeight
              ? selectWeight
              : product?.variant?.[0]?.weight,  
            product_mrp: mrp ? mrp : product?.variant?.[0]?.mrp,
            product_qty: qty,
            product_img: product?.variant?.[0]?.image
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
          setQty(1);
        }
      } catch (error) {
        console.log(error);
      }
      finally{
        setLoadingButton(false);
      }
    } else {
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
      setLoadingButton(false);
    }
  };

  const [rev_title, setRev_Title] = useState("");
  const [rev_description, setRev_Description] = useState("");
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

  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState("");
  const [wishlistLoad, setWishLoad] = useState(null);

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let fullDate = `${day} ${months[month]} ${year}`;
  const add_review = async (e) => {
    e.preventDefault();
    setLoadingReview(true);

    try {
      const response = await fetch(
        `${API}/api/auth/customer_review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user.name,
            product: product._id,
            variant_id: variantID ? variantID : product?.variant?.[0]?._id,
            cust_rating: value,
            cust_title: rev_title,
            cust_description: rev_description,
            product_flavour: selectFlavour
              ? selectFlavour
              : product?.variant?.[0]?.flavour,
            product_weight: selectWeight
              ? selectWeight
              : product?.variant?.[0]?.weight,
          }),
        }
      );

      
      const res_data = await response.json();

      if (response.ok) {
        setShowModal(false);
        setLoadingReview(false);
        toast.success(<div><b>Thankyou!</b> Your review has been submitted successfully</div>, {
                position: "top-center",
                autoClose: 3000,
                 style: {
                 maxWidth: '80px',  
                 width: "auto",
                 textAlign: "center",     
                } 
             });
        fetchReviews();
        setRev_Description("");
        setRev_Title("");
        setValue("");
        setErrors("");
      } else {
        if (res_data.extraDetails) {
          setErrors(res_data.extraDetails[0].field)
          toast.error(res_data.extraDetails[0].message, {
                position: "top-center",
                autoClose: 2000, 
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    textAlign: "center",
  },
             });
             setLoadingReview(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoadingReview(false);
    }
  };

  const [carts, setCarts] = useState([]);
    const getCartByUser = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch(
            `${API}/api/auth/getUserCart/${user.userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  ;
          const data = await response.json()
          if (response.ok) {
            setCarts(data);
            dispatch(setCartTotal(data));
          }
        } catch (error) {
          console.log(error);
        }
      }
    };  

    const BuyNow = async () => {
      const included = carts.some(a => a.variant_id ===  variantID ? variantID : product?.variant?.[0]?._id);
      if(isLoggedIn){
        let cartProducts = [{product_id:product._id, variant_id: variantID ? variantID : product?.variant?.[0]?._id, product_price:price? price : product?.variant?.[0]?.price, product_qty: 1}]
          if(!included){
            await handleCart();
            dispatch(
              setOrderInfo({ 
                 mrp : mrp ? mrp : product?.variant?.[0]?.mrp, 
                 price: price? price : product?.variant?.[0]?.price, 
                 cartProducts
              })
          )
        navigate('/checkout');
        }
    else{
        dispatch(
          setOrderInfo({ 
            mrp : mrp ? mrp : product?.variant?.[0]?.mrp, 
            price: price? price : product?.variant?.[0]?.price, 
            cartProducts
           })
          )
        navigate('/checkout');
      }
    }
    else{
        toast("Please login for better experience!", {
                position: "top-center",
                autoClose: 2000,
                style: {
    maxWidth: "80px", // or any width that fits mobile
    width: "auto",
    margin: "0 auto",
    textAlign: "center",
  }, 
             });
        navigate('/login');
      }
    }


    // ----------------------- Wishlist Logic Section ---------------------------

    const Save = async (p_id, variant_id) => {
      setWishLoad(variant_id)
        try {
            const response = await fetch(
              `${API}/api/auth/wishlist`,
              {
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
              }
            );
    
            if (response.ok) {
              setWishLoad(null);
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
            }
        } catch (error) {
          console.log(error);
        }finally{
          setWishLoad(null);
        }
      };
    
      
    const Delete = async (variant_id) => {
      setWishLoad(variant_id);
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
              variant_id: variant_id
          }),
        }
      );
      if(response.ok){
        setWishLoad(null);
                    toast.error("Removed from Wishlist!", {
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
      }
    } catch (error) {
      console.log(error);
    }
    finally{
      setWishLoad(null)
    }
  };

  

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
            }
          );
    
          const data = await response.json();
          setApiWishlists(data);
        } catch (error) {
          console.log(error);
        }
      };


     useEffect(() => {
      if(user && user.userId){
        getWishlists();
        getCartByUser();
      }
    }, [user, id, selectFlavour, selectWeight]);

    const toggleWishlist = (productId, variant_id) => {

      
          if (!isLoggedIn) {
            toast.warning("Please login!", {
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
            return;
          }


        const exists = ApiWishlists.some(
    a => a.variant_id === variant_id
  );

  if (exists) {
    setApiWishlists(prev =>
      prev.filter(
        a =>
          !(
            a.variant_id === variant_id
          )
      )
    );
    Delete(variant_id);
  } else {
    setApiWishlists(prev => [
      ...prev,
      { variant_id: variant_id}
    ]);
    Save(productId, variant_id);
  }
      };
    

      const allFlavours = useMemo(() => { return[
       ...new Map(
           productJoin
              .flatMap(product => product.variant || [])   // flatten all variants
              .map(variant => [variant.flavour, 
                {
                  flavour: variant.flavour
                }
              ])  // key = flavour
          ).values()
      ];},[productJoin]);

       const availableFlavours = useMemo(() => {
  return [
    ...new Set(
      productJoin
        .flatMap(p => p.variant || [])
        .filter(v => v.weight === selectWeight)
        .map(v => v.flavour)
    )
  ];
}, [productJoin, selectWeight]);


     const allWeight = useMemo(() => {
      return [
       ...new Map(
           productJoin
              .flatMap(product => product.variant || [])   // flatten all variants
              .map(variant => [`${variant.weight}-${variant.weightUnit}`, // 🔑 composite key
                    {
                      weight: variant.weight,
                      weightUnit: variant.weightUnit
                    }]) 
          ).values()
      ];
          },[productJoin])

      const [ prod, setProd] = useState([]);
      useEffect(()=> {[
        setProd(productJoin.find(p =>
              p.variant.some(v => v.weight === selectWeight)
         ))]
      },[selectWeight, product])

 const onSelectWeight = (weight) => {    
      setSelectWeight(weight);
  };

  const onSelectflavour = (f) => {
    setSelectFlavour(f);
  };

useEffect(() => {
  if (!selectWeight) return;

  setSelectFlavour(availableFlavours?.[0]);
}, [selectWeight, availableFlavours]);

useMemo(() => {

        if (!selectFlavour || !selectWeight) return;

        const matchedVariant = productJoin
            .flatMap(p => p.variant || [])
           .find(
             v =>
               v.flavour === selectFlavour &&
               v.weight === selectWeight
             );

  if (matchedVariant) {
    setPrice(matchedVariant.price);
    setMRP(matchedVariant.mrp);
    setImage(matchedVariant.image);
    setVariantID(matchedVariant._id)
  }
}, [selectFlavour, selectWeight, productJoin]);

const [thumbsSwiper, setThumbsSwiper] = useState(null);
const [activeImageIndex, setActiveImageIndex] = useState(0);

const imagesToShow =
  image?.length > 0
    ? image
    : product?.variant?.[0]?.image || [];

const customerRating = AllReviewByCustomers.filter(a => a.variant_id === variantID).map(a => a.cust_rating);
const averageReview = customerRating.length > 0 ? customerRating.reduce((sum,r) => sum + r, 0)/customerRating.length : 0;

const handleActionClick = (action) => {
  window.open(action.link, "_blank", "noopener,noreferrer");
};



return (
    <>
    {isLoading ? <div
              className="d-flex justify-content-center align-items-center gap-1"
              style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
            >
              <div className="spinner-grow spinner-grow-sm text-secondary" role="status"></div>
              <div className="text-muted">Loading...</div>
            </div> :
      <div className="container">

         {/* //------------- Breadcrumbs ------------- // */}

          <div className="d-flex align-items-center" role="presentation" style={{ paddingTop: isMobile ? "20%": "10%" }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/" sx={{ display: "flex", alignItems: "center"}}>
           <IoMdHome style={{ fontSize: isMobile ? "17px":"22px" }}/>
        </Link>
        <Link
          underline="hover"
          color="inherit"
          href="/"
        >
          <div style={{ fontSize: isMobile ? "13px":"15px"}}>{product?.category}</div>
        </Link>
        <Typography sx={{ color: 'text.primary', fontSize: isMobile ? "13px":"15px" }}><div>{product?.name}</div></Typography>
      </Breadcrumbs>
    </div>

    {/* /------------ Breadcrumbs end ------------- / */}
        <div className="row g-3">

{!isMobile && imagesToShow.length > 0 &&(
          <div className="col-12 col-md-1 order-2 order-md-1 border rounded-4">
            <Box sx={{
               width: "100px",
               height: "400px",
               overflow: "hidden",
               flexShrink: 0,
               padding: "10% 0% 10% 0%"
}}>
            <Swiper
             onSwiper={setThumbsSwiper}
             modules={[Thumbs, Navigation, Pagination]}
             spaceBetween={12}
             slidesPerView={4}
             direction="vertical"
             watchSlidesProgress
             navigation
             style={{ height: "100%", marginTop: "20px" }}
            >
            {imagesToShow.map((imgUrl, index)=>(
              <SwiperSlide key={index}>
                    <img src={imgUrl} onClick={()=>setActiveImageIndex(index)} 
                     style={{ maxHeight: "100px", maxWidth: "90%", cursor:"pointer",
                     objectFit: "contain", border: index === activeImageIndex ? "2px solid #2196f3" : "1.5px solid #D3D3D3", borderRadius: "6px" }} />
             </SwiperSlide>
            ))}
            </Swiper>
            </Box>
          </div>)}

          { imagesToShow.length > 0 &&
          <div className="col-12 col-md-5 order-2 order-md-1 rounded-4 text-center position-relative" style={{ backgroundColor: "#EEEE" }}>
           <img src={`${product?.dietaryPreference === "Veg" ? "/veg.svg" : "/non-veg.svg"}`}
              style={{
                 width: "25px",
        position: "absolute",
        top: "22px",
        right: "20px",
        zIndex: 10
              }}
            />
            <Swiper
               modules={[Navigation, Pagination, Thumbs]}
               thumbs={{ swiper: thumbsSwiper }}
               spaceBetween={10}
               slidesPerView={1}
               navigation
               pagination={{ clickable: true }}
>
            {imagesToShow.map((imgUrl,index)=>(
              <SwiperSlide key={index}>
                <div className="zoom-container">
                 <img src={imgUrl} className="zoom-image" style={{  width: isMobile ? "80%" : "80%",
    maxHeight: isMobile ? "350px" : "450px", marginTop: isMobile ? "10%":"2%",
    objectFit: "contain", cursor: "pointer", borderRadius: "6px" }} loading="lazy" />
                </div>
              </SwiperSlide>))}
            </Swiper>
          </div>}
          <div className="col-12 col-md-6 order-3">
            <p className="mb-0">{product?.category}</p>

            <h4 style={{ fontSize: isMobile && "20px" }}>
              {product?.brand} - {product?.name} |{" "}
              {selectWeight ? `${selectWeight > 999 ? `${selectWeight/1000}Kg` : `${selectWeight}g` }`
                : `${product?.variant?.[0]?.weight > 999 ? `${product?.variant?.[0]?.weight/1000}Kg` : `${product?.variant?.[0]?.weight}g` }`} | {''}
              {selectFlavour ? selectFlavour : product?.variant?.[0]?.flavour}  
            </h4>
            <div style={{ marginBottom: "5px" }}>
            <small>
              Visit the
              <NavLink style={{ textDecoration: "none" }}>
                <b> {product?.brand} </b>
              </NavLink>
              store
              <LuChevronRight style={{ fontSize: "20px" }} />
            </small>
            </div>
            <div style={{ marginBottom: "3%", display: "flex",
                  alignItems: "center", gap: isMobile ? "20%":"40%" }}>
                <div onClick={ () => {reviewsContainerRef.current?.scrollIntoView({
                  behavior: "smooth"})} } style={{ cursor: "pointer" }}>
                  <span className="badge bg-success me-2 gap-1 d-inline-flex align-items-center" style={{ fontSize: "14px"}}>
                    {averageReview && Math.round(averageReview * 10)/10} <FaStar/>
                  </span>
                  <strong style={{ color:"grey", fontSize: "14px" }}>({customerRating?.length} Ratings & Reviews)</strong>
                </div>

              <div>
                {wishlistLoad ? 
                <RiLoader2Line className="me-3 bg-secondary-subtle rounded-circle p-2 "
                  style={{ fontSize: "34px", cursor: "pointer" }}/>:
                <PiHeartDuotone
                  className="me-3 bg-secondary-subtle rounded-circle p-2 "
                  style={{ fontSize: "34px", cursor: "pointer", color: ApiWishlists?.some(a => a.variant_id === variantID)
                                ? "red"
                                : "grey" }}
                  onClick={() => toggleWishlist(
                                product?._id,
                                variantID ? variantID : product?.variant?.[0]?._id,
                              )}
                              
                />}
                <span className="share-wrapper">
  <IoShareSocial
    className="bg-secondary-subtle rounded-circle p-2 text-secondary share-btn"
    style={{ fontSize: "32px", cursor: "pointer" }}
  />

  <div className="share-actions">
    {actions.map((a, i) => (
      <span key={i} className="share-icon" >
        <Tooltip title={a.name} placement="right" onClick={() => {if(a.name === "Copy Link"){copyLink();}else{handleActionClick(a);}}}>
              <IconButton>
                   {a.icon}         
              </IconButton>
            </Tooltip>
      </span>
    ))}
  </div>
</span>

              </div>
            </div>
            <div style={{ marginBottom: isMobile ? "10px":"20px"}}>
              <div>
                MRP:{" "}
                <del style={{ fontSize: "17px", color: "grey" }}>{mrp ? `₹${mrp}` : `₹${product?.variant?.[0]?.mrp}`}.00</del>
              </div>
              <h4 style={{ display: "inline", marginRight: "3%" }}>
                Price:{" "}
                {price ? `₹${price.toLocaleString("en-IN")}` : `₹${product?.variant?.[0]?.price.toLocaleString("en-IN")}`}.00
              </h4>
              <h5 style={{ display: "inline", color: "#34A56F" }}>
                ( {price && mrp
                  ? Math.round(((mrp - price) / mrp) * 100)
                  : Math.round(
                      ((product?.variant?.[0]?.mrp -
                        product?.variant?.[0]?.price) /
                        product?.variant?.[0]?.mrp) *
                        100
                    )}
                % off )
              </h5>
              <div style={{ color: "#1AA260", fontSize: "15px" }}>
                Inclusive of all taxes
              </div>
            </div>

<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  }}
>

           {!carts.some(c => c.variant_id === variantID) && 
            <ButtonGroup
              variant="outlined"
              aria-label="Basic button group"
            >
              <Button onClick={minus}>-</Button>
              <Button variant="outlined">{qty}</Button>
              <Button onClick={plus}>+</Button>
            </ButtonGroup>}

           {carts.some(c => c.variant_id === variantID) ?
           !isMobile &&
            <Button
              variant="outlined"
              startIcon={<FaArrowRight />}
              onClick={() => {navigate("/carts")}}
            >
              Go To Cart
            </Button>
            :
            !isMobile &&
            <Button
              variant="outlined"
              disabled={loadingButton}
              startIcon={loadingButton ? <RiLoader2Line/> : <BsCart2 />}
              onClick={handleCart}
            >
              {loadingButton ? "Adding..." : "Add To Cart"}
            </Button>}

            {!isMobile && 
            <Button variant="contained" startIcon={<GiElectric />} onClick={BuyNow}>
              Buy Now
            </Button>}
            </div>
            
            <p className="mb-2" style={{marginTop: isMobile ? "10px":"20px"}}>
              Fullfilled By: <b>{product?.supplier}</b>
            </p>

            <Divider sx={{ backgroundColor: "grey" }}/>
            <div className="mt-2">
              <h5
                className="text-secondary"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img src="/kitchen.svg"
                  style={{ marginRight: "5px", width: "25px" }}
                />
                Select Weight:{" "}
                <small className="text-dark ms-1">
                  {selectWeight && `${selectWeight > 999 ? `${selectWeight/1000}Kg` : `${selectWeight}g`}`}
                </small>
              </h5>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 1 }}
              >
                {allWeight?.map((w, index) => (
                  <Grid xs={4} sm={3} md={2} key={index}>
                    <div
                      className={`card card-hover ${
                        selectWeight === w.weight ? "selected" : ""
                      }`}
                      onClick={() => onSelectWeight(w.weight)}
                    >
                      <div className="card-body text-center">{w.weight > 999 ? `${w.weight/1000}Kg` : `${w.weight}g`}</div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
            <div style={{ marginTop: "4%" }}>
              <h5
                className="text-secondary"
                style={{ alignItems: "center", display: "flex" }}
              >
                <img src="/aisanbowl.svg"
                  style={{
                    width: "25px",
                    marginRight: "5px",
                  }}
                />
                Select Flavour:{" "}
                <small className="text-dark ms-1">
                  {selectFlavour && `${selectFlavour}`}
                </small>
              </h5>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 1 }}
              >
                {allFlavours?.map((f, index) => {
                  const isAvailable = availableFlavours.includes(f.flavour);
                  const isSelected = selectFlavour === f.flavour;

                  return(
                  <Grid xs={4} sm={3} md={2} key={index}>
                    <div
                      className={`card card-hover ${isSelected ? "selected" : ""}
                      ${!isAvailable ? "disabled-card bg-secondary-subtle" : ""}` }

                      onClick={() => {
                        isAvailable && onSelectflavour(f.flavour);
                      }}
                    >
                      <div className="card-body text-center">{f.flavour}</div>
                    </div>
                  </Grid>
                )})}
              </Grid>
            </div>
          </div>
        </div>


        <div className="card mt-4">
          <div className="card-body text-left">
            <div style={{ display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "1px" : "20px",
     color: "#15317E" }}>
              <div className="row">
                <div className="col-2 col-md-2">
                  <MdOutlineSecurity
                    style={{ fontSize: isMobile ? "35px" : "40px"}}
                    className="border bg-primary-subtle rounded-circle p-1"
                  />
                  </div>
                  <div className="col-10 col-md-10">
                <h6 style={{ marginBottom: "0px" }}>
                  100% AUTHENTIC
                </h6>
                <p style={{ marginBottom: "0px", fontSize: isMobile && "15px" }}>Products sourced directly from the Brands!</p>
                </div>
              </div>

              <Divider orientation={isMobile ? "horizontal" : "vertical"} color="black" sx={{marginBottom: isMobile && "3%", marginTop: isMobile && "3%"}} flexItem />
              <div className="row">
                <div className="col-2 col-md-2">
                
                  <FaShippingFast
                    style={{ fontSize: isMobile ? "35px" : "40px"}}
                    className="border bg-primary-subtle rounded-circle p-1 me-3"
                  /></div>
                  <div className="col-10 col-md-10">
                <h6 style={{ marginBottom: "0px" }}>
                  FREE SHIPPING
                </h6>
                <p style={{ marginBottom: "0px", fontSize: isMobile && "15px" }}>Get free delivery on orders above 399!</p>
                </div>
              </div>
              <Divider orientation={isMobile ? "horizontal" : "vertical"} sx={{marginBottom: isMobile && "3%", marginTop: isMobile && "3%"}} color="black" flexItem />

                 <div className="row">
                <div className="col-2 col-md-2">
                  <FaExchangeAlt
                    style={{ fontSize: isMobile ? "34px" : "37px"}}
                    className="border bg-primary-subtle rounded-circle p-1 me-3"
                  />
                  </div>
                  <div className="col-10 col-md-10">
                    <h6 style={{ marginBottom: "0px" }}>
                  EASY RETURNS
                </h6>
                
                <p style={{ marginBottom: "0px", fontSize: isMobile && "15px" }}>Simple and easy exchanges!</p></div>
              </div>

              <Divider orientation={isMobile ? "horizontal" : "vertical"} sx={{marginBottom: isMobile && "3%", marginTop: isMobile && "3%"}} color="black" flexItem />

              <div className="row" >
                <div className="col-2 col-md-2">
                
                  <FaUsersLine
                    style={{ fontSize: isMobile ? "35px" : "40px"}}
                    className="border bg-primary-subtle rounded-circle p-1 me-3"
                  />
                  </div>
                   <div className="col-10 col-md-10">
                  <h6 style={{ marginBottom: "0px" }}>
                  HAPPY CUSTOMERS
                </h6>
                <p style={{ marginBottom: "0px", fontSize: isMobile && "15px" }}>Happy customers across India!</p></div>
              </div>

            </div>
          </div>
        </div>

        {/* // ----------------- Accordion -------------------- // */}

  <div className="accordion mt-4" id="accordionExample">
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        <img src="/description.svg" style={{ marginRight: "10px" }}/>Description
      </button>
    </h2>
    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <small>{product?.description}</small>
        </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        <img src="/product_info.svg" style={{ marginRight: "10px" }}/>Product Information
      </button>
    </h2>
    <div id="collapseTwo" className="accordion-collapse collapse"  data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <div style={{ fontSize: "15px" }}><strong>Dietary Preference</strong>: {product?.dietaryPreference}</div>
        <div style={{ fontSize: "15px" }}><strong>Form</strong>: {product?.form}</div>
        <div style={{ fontSize: "15px" }}><strong>Maximum Shelf Life</strong>: {product?.bestBefore}</div>
        <div style={{ fontSize: "15px" }}><strong>Number of servings</strong>: {selectWeight > 4 ? Math.round(selectWeight/product?.servingSize) : Math.round(selectWeight/product?.servingSize * 1000)}</div>
        <div style={{ fontSize: "15px" }}><strong>Serving Size</strong>: {product?.servingSize}</div>

      </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        <img src="/ingredients.svg" style={{ marginRight: "10px" }}/>Ingredients
      </button>
    </h2>
    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <small>{product?.ingredients}</small> 
      </div>
    </div>
  </div>
    <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
        <img src="/add_info.svg" style={{ marginRight: "10px" }}/>Additional Information
      </button>
    </h2>
    <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <div style={{ fontSize: "15px" }}><strong>FSSAI Number</strong>: {prod?.fssai}</div>
        <div style={{ fontSize: "15px" }}><strong>Manufacturer</strong>: {prod?.manufacturer}</div>    
      </div>
    </div>
  </div>
    <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
        <img src="/manufacture_info.svg" style={{ marginRight: "10px" }}/>Manufacturer Info
      </button>
    </h2>
    <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <small>{prod?.manufacturer}</small>
      </div>
    </div>
  </div>
</div>

  {/* ----------------------------- Table ------------------------------- */}

  {(product?.category === "Whey Protein Concentrate" || product?.category === "Whey Protein Isolate" || product?.category === "Whey Protein") &&
  <>
  <div className="mt-5">
   <h6>Whey Protein Type Comparison</h6>
   <p style={{ fontSize: "12px", color:"grey" }}>Understanding the differences between whey protein types</p>
  
  </div>

  <div className="card">
    <div className="card-body d-flex pb-0">
      <div><BsBoxSeam style={{ fontSize: "20px", marginRight: "10px" }}/></div>
      <div>
        <p style={{ fontSize: "12px", marginBottom: "0px", color: "grey" }}><strong>Current Product: {product.name}, {selectFlavour? selectFlavour : product.flavour}</strong></p>
        <p style={{ fontSize: "12px", color: "grey"}}>Contains {product.category}</p>
      </div>
    </div>
  </div>

  <div style={{ overflowX: "auto" }}>
  <table className="table table-bordered mt-4">
  <thead className="table-light">
    <tr>
      <th scope="col" className="text-center align-middle" style={{color: "#454545"}}>SPECIFICATION</th>
      <th scope="col" className="text-center align-middle pt-4" style={{ backgroundColor: "rgba(220, 208, 255, 0.35)", color: product.category === "Whey Protein Concentrate" ? "#7B61FF":"#454545", borderLeft: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": ""
        , borderRight: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": ""
      }}>{product.category === "Whey Protein Concentrate" && <GiCheckMark/>} Whey Concentrate<p style={{ fontSize:"12px"}}>(Only)</p></th>
      <th scope="col" className="text-center align-middle pt-4" style={{ backgroundColor: "rgba(255,230,232,0.35)", borderLeft: product.category === "Whey Protein" ? "2px solid #F06292": "", borderRight: product.category === "Whey Protein" ? "2px solid #F06292": "", color: "#454545" }}>{product.category === "Whey Protein" && <GiCheckMark/>} Whey Blend<p style={{ fontSize:"12px"}}>(Blend - WPC + WPI)</p></th>
      <th scope="col" className="text-center align-middle pt-4" style={{backgroundColor: "rgba(219,249,219,0.35)", borderLeft: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", borderRight: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", color: product.category === "Whey Protein Isolate" ? "#4CAF50" : "#454545" }}>{product.category === "Whey Protein Isolate" && <GiCheckMark/>} Whey Isolate<p style={{ fontSize:"12px"}}>(Only)</p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" style={{ fontSize: isMobile ? "8px":"13px", verticalAlign: "middle", paddingLeft: "3%", color: "#454545"}} ><BiBullseye style={{ fontSize: isMobile ? "15px" : "20px" }}/> Protein Content</th>
      <td style={{ textAlign: "center", paddingTop: "2%", backgroundColor: "rgba(220, 208, 255, 0.35)", borderLeft: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": ""
        , borderRight: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": "", color: product.category === "Whey Protein Concentrate" ? "#7B61FF":"#454545"}}>70-80% <p style={{ fontSize: "12px"}}>per serving</p></td>
      <td style={{ textAlign: "center", paddingTop: "2%", backgroundColor: "rgba(255,230,232,0.35)", borderLeft: product.category === "Whey Protein" ? "2px solid #F06292": "", borderRight: product.category === "Whey Protein" ? "2px solid #F06292": "", color: product.category === "Whey Protein" ? "#F06292": "#454545" }}>70-80% <p style={{ fontSize: "12px"}}>per serving</p></td>
      <td style={{ textAlign: "center", paddingTop: "2%",backgroundColor:"rgba(219,249,219,0.35)", borderLeft: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", borderRight: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "" , color: product.category === "Whey Protein Isolate" ? "#4CAF50" : "#454545" }}>90-95% <p style={{ fontSize: "12px"}}>per serving</p></td>
    </tr>
    <tr>
      <th scope="row" style={{ fontSize: isMobile ? "8px":"13px", verticalAlign: "middle",  paddingLeft: "3%", color: "#454545"}}><LuDroplets style={{ fontSize: isMobile ? "15px" : "20px"}}/> Lactose Content</th>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(220, 208, 255, 0.35)", borderLeft: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": ""
        , borderRight: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": "", color: product.category === "Whey Protein Concentrate" ? "#7B61FF":"#454545" }}>Higher (3-5%)</td>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(255,230,232,0.35)", borderLeft: product.category === "Whey Protein" ? "2px solid #F06292": "", borderRight: product.category === "Whey Protein" ? "2px solid #F06292": "", color: product.category === "Whey Protein" ? "#F06292": "#454545"}}>Low-Mod (1-3%)</td>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(219,249,219,0.35)", borderLeft: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", borderRight: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", color: product.category === "Whey Protein Isolate" ? "#4CAF50" : "#454545" }}>Minimal (less than 1%)</td>
    </tr>
    <tr>
      <th scope="row" style={{fontSize: isMobile ? "8px":"13px", verticalAlign: "middle", paddingLeft: "3%", color: "#454545"}}><BiSolidZap style={{ fontSize: isMobile ? "15px" : "20px"}}/> Absorption Rate</th>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(220, 208, 255, 0.35)", borderLeft: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": ""
        , borderRight: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": "", color: product.category === "Whey Protein Concentrate" ? "#7B61FF":"#454545"}}>Moderate (2-3 hrs)</td>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(255,230,232,0.35)", borderLeft: product.category === "Whey Protein" ? "2px solid #F06292": "", borderRight: product.category === "Whey Protein" ? "2px solid #F06292": "", color: product.category === "Whey Protein" ? "#F06292": "#454545" }}>Fast 1.2-2.5 hrs</td>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(219,249,219,0.35)", borderLeft: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", borderRight: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", color: product.category === "Whey Protein Isolate" ? "#4CAF50" : "#454545"}}>Very fast 30-60 min</td>
    </tr>
     <tr>
      <th scope="row" style={{ fontSize: isMobile ? "8px":"13px", verticalAlign: "middle", paddingLeft: "3%", color: "#454545"}}><BiPulse style={{ fontSize: isMobile ? "15px" : "20px"}}/> Fat Content</th>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(220, 208, 255, 0.35)", borderLeft: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": ""
        , borderRight: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": "",color: product.category === "Whey Protein Concentrate" ? "#7B61FF":"#454545"}}>3-5%</td>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(255,230,232,0.35)", borderLeft: product.category === "Whey Protein" ? "2px solid #F06292": "", borderRight: product.category === "Whey Protein" ? "2px solid #F06292": "" , color: product.category === "Whey Protein" ? "#F06292": "#454545"}}>1-3%</td>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(219,249,219,0.35)", borderLeft: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", borderRight: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", color: product.category === "Whey Protein Isolate" ? "#4CAF50" : "#454545" }}>Less than 1%</td>
    </tr>
     <tr>
      <th scope="row" style={{ fontSize: isMobile ? "8px":"13px", verticalAlign: "middle", paddingLeft: "3%", color: "#454545"}}><CiDumbbell style={{ fontSize: isMobile ? "15px" : "20px"}}/> BCAA Content</th>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(220, 208, 255, 0.35)", borderLeft: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": ""
        , borderRight: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": "" , color: product.category === "Whey Protein Concentrate" ? "#7B61FF":"#454545"}}>5-5.5g per serving</td>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%",backgroundColor: "rgba(255,230,232,0.35)", borderLeft: product.category === "Whey Protein" ? "2px solid #F06292": "", borderRight: product.category === "Whey Protein" ? "2px solid #F06292": "" , color: product.category === "Whey Protein" ? "#F06292": "#454545"}}>5.5-6g per serving</td>
      <td style={{ textAlign: "center", fontSize: "12px", padding: "2%", backgroundColor: "rgba(219,249,219,0.35)", borderLeft: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", borderRight: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "" , color: product.category === "Whey Protein Isolate" ? "#4CAF50" : "#454545" }}>6-7g per serving</td>
    </tr>
     <tr>
      <th scope="row" style={{ fontSize: isMobile ? "8px":"13px", verticalAlign: "middle", paddingLeft: "3%", color: "#454545"}}><BiBullseye style={{ fontSize: isMobile ? "15px" : "20px"}}/> Ideal For</th>
      <td style={{ textAlign: "center", fontSize: "15px", padding: "2%",backgroundColor: "rgba(220, 208, 255, 0.35)", borderLeft: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": ""
        , borderRight: product.category === "Whey Protein Concentrate" ? "2px solid #7B61FF": "" , color: product.category === "Whey Protein Concentrate" ? "#7B61FF":"#454545"}}><span class="badge rounded-pill mb-1" style={{ backgroundColor: "#9E7BFF", padding: "8px"}} >Muscle build</span> <span class="badge rounded-pill mb-1" style={{ backgroundColor: "#9E7BFF", padding: "8px"}}>Weight gain</span> <span class="badge rounded-pill mb-1" style={{ backgroundColor: "#9E7BFF", padding: "8px"}}>Budget</span></td>
      <td style={{ textAlign: "center", fontSize: "15px", padding: "2%",backgroundColor: "rgba(255,230,232,0.35)", borderLeft: product.category === "Whey Protein" ? "2px solid #F06292": "", borderRight: product.category === "Whey Protein" ? "2px solid #F06292": "", color: product.category === "Whey Protein" ? "#F06292": "#454545"}}><span class="badge rounded-pill mb-1 text-dark" style={{ backgroundColor: "#FAAFBA", padding: "8px"}}>General fitness</span> <span class="badge rounded-pill mb-1 text-dark" style={{ backgroundColor: "#FAAFBA", padding: "8px"}}>Post-workout</span> <span class="badge rounded-pill mb-1 text-dark" style={{ backgroundColor: "#FAAFBA", padding: "8px"}}>Daily use</span></td>
      <td style={{ textAlign: "center", fontSize: "15px", padding: "2%", backgroundColor: "rgba(219,249,219,0.35)", borderLeft: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "", borderRight: product.category === "Whey Protein Isolate" ? "2px solid #4CAF50" : "" , color: product.category === "Whey Protein Isolate" ? "#4CAF50" : "#454545"}}><span class="badge rounded-pill mb-1 text-dark" style={{ backgroundColor: "#C3FDB8", padding: "8px"}}>Lean muscle</span> <span class="badge rounded-pill mb-1 text-dark" style={{ backgroundColor: "#C3FDB8", padding: "8px"}}>Lactose free</span> <span class="badge rounded-pill mb-1 text-dark" style={{ backgroundColor: "#C3FDB8", padding: "8px"}}>Cutting</span></td>
    </tr>
  </tbody>
</table>
</div>
</>
}

        <div style={{ marginTop: "5%" }}>
          <h2 className="text-center" style={{ fontSize: isMobile && "18px" }}>
            {product?.brand} {product?.name} |{" "}
            {selectWeight && selectFlavour
              ? `${selectWeight > 999 ? `${selectWeight/1000}Kg`: `${selectWeight}g`} | ${selectFlavour}`
              : `${product?.variant?.[0]?.weight > 999 ? `${product?.variant?.[0]?.weight}Kg` : `${product?.variant?.[0]?.weight}g`} | ${product?.variant?.[0]?.flavour}`}{" "}
            (Reviews)
          </h2>

          <div className="row mt-4">
            <div className="col-12 col-md-3">
              <div className="card border-0" style={{ backgroundColor: "#F5F5F5"}}>
                <div className="card-body">
                  <h5 style={{ textAlign: isMobile ? "left": "center", marginBottom: isMobile && "3%"}}>Customer Reviews</h5>
                  
                  <div
  className="rating-summary"
  style={{
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    gap: isMobile ? "16px" : "0",
    alignItems: isMobile ? "center" : "stretch",
  }}
>
                  <div style={{
                        justifyContent: "center",
                        textAlign: "center",
                        gap: "8px",
                        marginTop: "8%"
                      }}
                    >
                      <div>
                    <h1 style={{ margin: 0, fontSize: isMobile ? "30px" : "" }}>
                      
                      {averageRating.toFixed(1) === "NaN" ? 0 : averageRating.toFixed(1)}<small style={{ fontSize: isMobile ? "15px":"25px"}}>/5</small>
          
                    </h1>
                    </div>
                    
                    <div>
                      <Rating
                        name="half-rating-read"
                        value={averageRating.toFixed(1)}
                        precision={0.5}
                        size={isMobile ? "medium" : "large"}
                        readOnly
                      />
                      </div>
                      <div className="mb-3">
                       <small style={{ color: "grey" }}>{`Based on ${AllReviewByCustomers.length} customer ratings`}</small>
                      </div>
                  </div>
                  <div className="card" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}}>
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: isMobile ? "3%" : "10%",
                        }}
                      >
                        <span className="d-inline-flex align-items-center gap-1">5 <FaStar className="text-warning"/></span>
                        <div
                          className="progress flex-grow-1"
                          role="progressbar"
                          aria-label="Example 1px high"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ height: "5px", marginBottom: "0" }}
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${fiveStar}%` }}
                          ></div>
                        </div>
                        {fiveStar.toFixed(0) === "NaN" ? 0 : fiveStar.toFixed(0)}%
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: isMobile ? "3%" : "10%",
                        }}
                      >
                        <span className="d-inline-flex align-items-center gap-1">4 <FaStar className="text-warning"/></span>
                        <div
                          className="progress flex-grow-1"
                          role="progressbar"
                          aria-label="Example 1px high"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ height: "5px", marginBottom: "0" }}
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${fourStar}%` }}
                          ></div>
                        </div>
                        {fourStar.toFixed(0) === "NaN" ? 0 : fourStar.toFixed(0)}%
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: isMobile ? "3%" : "10%",
                        }}
                      >
                        <span className="d-inline-flex align-items-center gap-1">3 <FaStar className="text-warning"/></span>
                        <div
                          className="progress flex-grow-1"
                          role="progressbar"
                          aria-label="Example 1px high"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ height: "5px", marginBottom: "0" }}
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${threeStar}%` }}
                          ></div>
                        </div>
                        {threeStar.toFixed(0) === "NaN" ? 0 : threeStar.toFixed(0)}%
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: isMobile ? "3%" : "10%",
                        }}
                      >
                        <span className="d-inline-flex align-items-center gap-1">2 <FaStar className="text-warning"/></span>
                        <div
                          className="progress flex-grow-1"
                          role="progressbar"
                          aria-label="Example 1px high"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ height: "5px", marginBottom: "0" }}
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${twoStar}%` }}
                          ></div>
                        </div>
                        {twoStar.toFixed(0) === "NaN" ? 0 : twoStar.toFixed(0)}%
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: isMobile ? "3%" : "10%",
                        }}
                      >
                        <span className="d-inline-flex align-items-center gap-1">1 <FaStar className="text-warning"/></span>
                        <div
                          className="progress flex-grow-1"
                          role="progressbar"
                          aria-label="Example 1px high"
                          aria-valuenow="25"
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ height: "5px" }}
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${oneStar}%` }}
                          ></div>
                        </div>
                        {oneStar.toFixed(0) === "NaN" ? 0 : oneStar.toFixed(0)}%
                      </div>

                      <Divider
                        variant="middle"
                        sx={{ backgroundColor: "black", marginBottom: "6%" }}
                      />
                      <p style={{ textAlign: "center", fontSize: isMobile && "15px"}}>Have you used this product?</p>

                      {/* <!-- Button trigger modal --> */}
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Button
                      variant="outlined"
                        fullWidth={isMobile}
                        onClick={() => {if(isLoggedIn){
                                  setShowModal(true);
                        }
                      else{
                        review();
                      }}}
                      >
                        Write a Review
                      </Button>
                      </Box>

                      {/* <!-- Modal --> */}
                      {showModal && (
                        <div
                          className="modal fade show"
                          style={{ display: "block", top: "8%",         
                          position: "fixed", backgroundColor: "rgba(0,0,0,0.40)"  }}
                          tabIndex="-1"
                        >
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header align-items-start justify-content-end">
                                <div>
                                  <h1
                                    class="modal-title fs-5"
                                    id="exampleModalLabel"
                                    style={{ textAlign: "left" }}
                                  >
                                    {product.brand} {product.name} |{" "}
                                    {selectWeight && selectFlavour
                                      ? `${selectWeight > 999 ? `${selectWeight/1000}Kg` : `${selectWeight}g`} | ${selectFlavour}`
                                      : `${product?.variant?.[0]?.weight > 999 ? `${product?.variant?.[0]?.weight/1000}Kg` : `${product?.variant?.[0]?.weight}g`} | ${product?.variant?.[0]?.flavour}`}
                                  </h1>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      marginTop: "1%",
                                      textAlign: "left",
                                    }}
                                  >
                                    {selectWeight && selectFlavour
                                      ? `${selectWeight > 999 ? `${selectWeight/1000}Kg` : `${selectWeight}g`} | ${selectFlavour}`
                                      : `${product?.variant?.[0]?.weight > 999 ? `${product?.variant?.[0]?.weight/1000}Kg` : `${product?.variant?.[0]?.weight}g` } | ${product?.variant?.[0]?.flavour}`}
                                  </div>
                                </div>
                                 <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  onClick={() => {setShowModal(false); setRev_Description(""); setRev_Title(""); setValue(""); setErrors("")}}
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div class="modal-body">
                                <div className="row">
                                  <div className="col-4 text-start align-items-center">
                                    Rate this product *
                                  </div>
                                  <div className="col-8 text-start d-flex align-items-center">
                                    <Rating
                                      name="simple-controlled"
                                      value={value}
                                      precision={0.5}
                                      onChange={(event, newValue) => {
                                        setValue(newValue);
                                      }}
sx={{
     "& .MuiRating-iconEmpty": {
      color: errors === "cust_rating" && "red",
    },
  }}                                      
                                    />
                                    <small style={{ marginLeft: "2%" }}>
                                      {value}{" "}
                                      {value && (
                                        <span
                                          style={{
                                            color: "green",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            setValue("");
                                            setErrors("")
                                          }}
                                        >
                                          Clear
                                        </span>
                                      )}
                                    </small>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <label className="form-label float-start">
                                    Title *
                                  </label>

                                  <TextField
                                    type="text"
                                    placeholder="Please enter a suitable title here"
                                    variant="outlined"
                                    size="small"
                                    value={rev_title}
                                    onChange={(e) =>
                                      setRev_Title(e.target.value)
                                    }
                                    error={errors === "cust_title"}
                                    name="title"
                                    fullWidth
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="form-label float-start">
                                    Description *
                                  </label>
                                  <TextField
                                    type="text"
                                    placeholder="Write your review here.."
                                    variant="outlined"
                                    size="small"
                                    value={rev_description}
                                    onChange={(e) =>
                                      setRev_Description(e.target.value)
                                    }
                                    name="description"
                                    error={errors === "cust_description"}
                                    
                                    fullWidth
                                    required
                                  />
                                </div>
                              </div>
                              <div class="modal-footer">
                                <Button
                                  disabled={loadingReview}
                                  onClick={add_review}
                                  variant="contained"  
                                  startIcon={loadingReview && <RiLoader2Line/>}                              >
                                  {loadingReview ? "Publishing..." : "Publish Review" }
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-9" style={{ marginTop : isMobile && "5%"}}>
              <div className="d-flex justify-content-between align-items-center">
                <h6>
                  All Flavour ({AllReviewByCustomers.length} Reviews)
                </h6>
                <div>
                  {AllReviewByCustomers.length > 0 && 
                  <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{ fontSize: "12px" }}>Sort By</InputLabel>
                    <Select
                      size="small"
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      label="Sort By"
                      sx={{
                          fontSize: "13px",
                          height: "34px",
                        }}
                      value={reviewSorting}
                      onChange={(e)=>{setReviewSorting(e.target.value)}}
                       startAdornment={
                                           <InputAdornment position="start">
                                              <PiSortAscendingBold />
                                           </InputAdornment>
                                }
                    >
                      <MenuItem value="all" sx={{
                          fontSize: "13px",
                          height: "34px",
                        }}>All</MenuItem>
                      <MenuItem value="newest" sx={{
                          fontSize: "13px",
                          height: "34px",
                        }}>Newest First</MenuItem>
                      <MenuItem value="rating_desc" sx={{
                          fontSize: "13px",
                          height: "34px",
                        }}>
                        Rating High to Low
                      </MenuItem>
                      <MenuItem value="rating_asc" sx={{
                          fontSize: "13px",
                          height: "34px",
                        }}>
                        Rating Low to High
                      </MenuItem>
                    </Select>
                  </FormControl>}
                </div>
              </div>
              {AllReviewByCustomers.length === 0 ? 
              
              <div
  className="d-flex flex-column justify-content-center align-items-center"
  style={{ minHeight: "50vh" }}
>
  <h5 className="text-muted mb-1">No Reviews Yet</h5>
  <small className="text-secondary">
    Be the first to review this product
  </small>
</div>
 :
<div ref={reviewsContainerRef} className="order-scroll">
             {AllReviewByCustomers.map((r) => {
              return(
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2" >
                    <PiUserLight
                      style={{
                        display: "inline",
                        marginRight: "7px",
                        fontSize: "20px",
                      }}
                    />
                    <div><h6 style={{ display: "inline" }}>{r.user}</h6></div>
                    <img src="/Verified.svg" style={{ width: "20px", marginLeft: "7px"}}/>
                    </div>
                    <div style={{ marginTop: "1%" }}>
                      <div
                        style={{
                          fontSize: "15px",
                          color: "grey",
                          display: "inline",
                        }}
                      >
                        <span className="badge text-bg-success fs-6 d-inline-flex align-items-center"><b>{r.cust_rating}</b>
                        <FaStar style={{ marginLeft: "6px"}}/></span>
                        <b style={{ marginRight: "1%", marginLeft: "1%", color: "#E0E5E5" }}>
                          <RxDotFilled />
                        </b>
                        <b style={{ marginRight: "1%" }}>{new Date(r.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}</b>
                        <b style={{ marginRight: "1%", color: "#E0E5E5" }}>
                          <RxDotFilled />
                        </b>
                        <b>
                          {r.product_weight > 999 ? `${r.product_weight/1000}Kg` : `${r.product_weight}g`} {r.product_flavour}
                        </b>
                      </div>
                    </div>
                    <div style={{ marginTop: "3%" }}>
                      <h5 style={{ fontSize: isMobile && "18px" }}>{r.cust_title}</h5>
                    </div>
                    <div>
                      <small style={{ color: "grey" }}>
                        {r.cust_description}
                      </small>
                    </div>
                  </div>
                </div>
              
              )})}
              </div>
              }
              
            </div>
          </div>
        </div>

        {isMobile && (
  <div className="mobile-fixed-buybar">
    {carts.some(c => c.variant_id === variantID) ?
            <Button
              variant="outlined" fullWidth
              startIcon={<FaArrowRight />}
              onClick={() => {navigate("/carts")}}
            >
                Go To Cart
            </Button>
            :
            <Button
              variant="outlined"
              fullWidth
              disabled={loadingButton}
              startIcon={loadingButton ? <RiLoader2Line/> : <BsCart2 />}
              onClick={handleCart}
            >
              {loadingButton ? "Adding..." : "Add To Cart"}
            </Button>}

    <Button variant="contained" startIcon={<GiElectric />} fullWidth size="large"
    >
      Buy Now
    </Button>
  </div>)}

      </div>}
    </>
  );
}
