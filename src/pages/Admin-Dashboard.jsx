import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import { FaArrowTrendUp } from "react-icons/fa6";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/getAllOrders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalOrderPrice,
    0
  );

  return (
    <div className="container my-5">
      <div className="card mb-3">
                    <div className="card-body">
 <h4 className="mb-0">Admin Dashboard</h4>
                        </div>
                        </div> 

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="row g-3">
          {/* Total Orders */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">Total Orders <FaArrowTrendUp/></h6>
                <h3 className="fw-bold">{orders.length}</h3>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">Total Revenue <FaArrowTrendUp/></h6>
                <h3 className="fw-bold text-success">
                  ₹{totalRevenue.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">Avg Order Value <FaArrowTrendUp/></h6>
                <h3 className="fw-bold">
                  ₹
                  {orders.length
                    ? (totalRevenue / orders.length).toFixed(2)
                    : 0}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
