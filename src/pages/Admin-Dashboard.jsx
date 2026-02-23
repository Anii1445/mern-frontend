import { useEffect, useState } from "react";
import { useAuth } from "../store/auth-ContextAPI";
import { FaArrowTrendUp } from "react-icons/fa6";
const API = import.meta.env.VITE_API_URL;
import { Button } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { Card, Chip, Box, Typography, CardContent } from "@mui/material";

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


  return (
    <div className="container">
      {loading ? (
  <div
    className="d-flex justify-content-center align-items-center gap-1"
    style={{ minHeight: "clamp(300px, 70vh, 800px)" }}
  >
   <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
    </div>
    <div className="text-muted">Loading...</div>
  </div>      ) : (
    <>
     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1976d2', mb: 0.5 }}>
            Admin Dashboard
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Data insight of all orders
          </Typography>
        </Box>
    </Box>

      
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
    <h4 className="mb-3" style={{ color: '#1565c0' }}>Sales Overview (Last 7 Days)</h4>

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

{console.log(orders)}

<div className="card mt-3 shadow-sm">
  <div className="card-header d-flex justify-content-between align-items-center">
    <h4 className="mb-0" style={{ color: '#1565c0'}}>Recent Orders</h4>
    <Button
     variant="outlined"    
     size="medium"  
     onClick={() => navigate("/admin/users")}
    >
      View All
    </Button>
  </div>

  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead >
          <tr>
            <th style={{ backgroundColor: "#EBF4FA", color: "#625D5D" }}>Order ID</th>
            <th style={{ backgroundColor: "#EBF4FA", color: "#625D5D" }}>User</th>
            <th style={{ backgroundColor: "#EBF4FA", color: "#625D5D" }}>Date</th>
            <th style={{ backgroundColor: "#EBF4FA", color: "#625D5D" }}>Amount</th>
            <th style={{ backgroundColor: "#EBF4FA", color: "#625D5D" }}>Payment Status</th>
            <th style={{ backgroundColor: "#EBF4FA", color: "#625D5D" }}>Payment Mode</th>
            <th style={{ backgroundColor: "#EBF4FA", color: "#625D5D" }}>Status</th>
            <th style={{ backgroundColor: "#EBF4FA", color: "#625D5D" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(-5).map((order) => (
            <tr key={order._id}>
              <td style={{ color: "#454545"}}>#{isMobile ? order._id.substr(0,5).toUpperCase()+"...": order._id.toUpperCase()}</td>
              <td style={{ color: "#454545"}}>{order.deliverAddress?.full_name}</td>
              <td style={{ color: "#454545"}}>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td style={{ color: "#454545"}}>₹{order.totalOrderPrice}</td>
              <td><Chip
                          label={order.paymentStatus}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor:  order.paymentStatus === "Pending" ? '#F8B4B1' : '#C3FDB8',
                            color: order.paymentStatus === "Pending" ? 'error.main' : 'success.main'}}/></td>
              <td style={{ color: "#454545"}}>{order.paymentMode}</td>
              <td>
                <Chip label={order?.orderStatus}
                      size="small"
                      sx={{ 
                           height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor: order.orderStatus === "Delivered" ? "#C3FDB8" :
                                    order.orderStatus === "Processing" ? "#FAF884" :
                                    order.orderStatus === "Cancelled" ? "#FAA596":"#DBE9FA",
                            color: order.orderStatus === "Delivered" ? "success.main" :
                                    order.orderStatus === "Processing" ? "warning.main" :
                                    order.orderStatus === "Cancelled" ? "danger.main":"primary.main"}}/>
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
