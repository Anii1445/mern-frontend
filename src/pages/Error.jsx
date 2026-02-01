import { NavLink } from "react-router-dom";

export default function Error() {
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

                <div className="row">
                    <div className="col-6">
                        <NavLink to="/" className="btn btn-secondary float-end">Return Home</NavLink>
                    </div>
                    <div className="col-6">
                        <NavLink to="/" className="btn btn-secondary">Report Problem</NavLink>
                    </div>
                </div>

            </div>
        </>
    )
}