import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import { FaArrowTrendUp } from "react-icons/fa6";
const API = import.meta.env.VITE_API_URL;
import { Button } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${API}/api/admin/getAllOrders`,
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
          setLoading(false);
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

  const getLast7DaysData = (orders) => {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  return days.map((day) => {
    const dayOrders = orders.filter(
      (o) => o.createdAt?.split("T")[0] === day
    );

    return {
      date: new Date(day).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      orders: dayOrders.length,
      revenue: dayOrders.reduce(
        (sum, o) => sum + o.totalOrderPrice,
        0
      ),
    };
  });
};


  const chartData = getLast7DaysData(orders);
console.log(orders)


const getBestSellingProducts = (orders, limit = 5) => {
  const map = {};

  orders.forEach(order => {
    order.items?.forEach(item => {
      if (!map[item.productId]) {
        map[item.productId] = {
          productId: item.productId,
          name: item.productName,
          sold: 0,
          revenue: 0
        };
      }

      map[item.productId].sold += item.quantity;
      map[item.productId].revenue += item.quantity * item.price;
    });
  });

  return Object.values(map)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit);
};



  return (
    <div className="container">
      {loading ? (
  <div
    className="d-flex justify-content-center align-items-center gap-2"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
   <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>
  </div>      ) : (
    <>
      <div className="card mb-2">
                    <div className="card-body">

 <h4 className="mb-0">Admin Dashboard</h4>
                        </div>
                        </div> 

      
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

        <div className="card shadow-sm mt-3">
  <div className="card-body">
    <h5 className="mb-3">Sales Overview (Last 7 Days)</h5>

    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="orders"
            stroke="#1976d2"
            strokeWidth={2}
            name="Orders"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2e7d32"
            strokeWidth={2}
            name="Revenue (₹)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>



<div className="card mt-3 shadow-sm">
  <div className="card-header d-flex justify-content-between align-items-center">
    <h5 className="mb-0">Recent Orders</h5>
    <Button
     variant="outlined"    
     size="small"  
     onClick={() => navigate("/admin/users")}
    >
      View All
    </Button>
  </div>

  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 5).map((order) => (
            <tr key={order._id}>
              <td>#{isMobile ? order._id.substr(0,5).toUpperCase()+"...": order._id.toUpperCase()}</td>
              <td>{order.deliverAddress?.full_name}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>₹{order.totalOrderPrice}</td>
              <td>
                <span className={`badge 
                  ${order.status === "Delivered" ? "bg-success" :
                    order.status === "Processing" ? "bg-warning text-dark" :
                    order.status === "Cancelled" ? "bg-danger" :
                    "bg-secondary"}`}>
                  {order.orderStatus}
                </span>
              </td>
              <td>
                <Button
                variant="outlined"
                size="small"
                  onClick={() =>
                    navigate(`/admin/userOrderDetails/${order._id}`)
                  }
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

        </>
      )}
    </div>
  );
}
