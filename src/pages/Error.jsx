import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Error() {

    const navigate = useNavigate();
    return (
        <>
            <div className="row" style={{ marginTop: "10%" }}>
                <div className="row">
                    <div className="col-12 text-center">
                        <h1 style={{fontSize: "200px"}}>404</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 text-center">
                        <h4>Sorry! Page not found</h4>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 text-center">
                        <p>
                            Oops! It seems like  the page you are trying to access doesn't exist.<br/>
                            If you believe there's an issue, feel free to report it, and we'll look
                            into it.
                        </p>                    
                    </div>
                </div>

                <div className="d-flex justify-content-center gap-2">
                    
                        <Button onClick={()=>navigate("/")} variant="outlined" startIcon={<FaArrowLeftLong/>}>Return Home</Button>
                    
                        <Button onClick={()=>navigate("/")} variant="contained">Report Problem</Button>
                    
                </div>

            </div>
        </>
    )
}