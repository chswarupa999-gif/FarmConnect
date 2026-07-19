"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";
import "./page.css";

export default function FarmerOrdersPage() {

  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!user || user.role !== "FARMER") {
      router.replace("/login");
      return;
    }

    fetchOrders();

  }, [router]);

  const fetchOrders = async () => {

    try {

      const response = await api.get("/orders/farmer");

      setOrders(response.data.orders);

    } catch (error) {

      console.log(error);

    }

  };

  const updateStatus = async (id, status) => {

    try {

      setLoadingId(id);

      await api.put(`/orders/${id}/status`, {
        status,
      });

      alert(`Order ${status.toLowerCase()} successfully`);

      fetchOrders();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable to update order"
      );

    } finally {

      setLoadingId(null);

    }

  };

  return (

    <div className="container">

      <button
        className="backBtn"
        onClick={() => router.push("/farmer-dashboard")}
      >
        ← Dashboard
      </button>

      <h1 className="title">
        🌾 Farmer Orders
      </h1>

      {orders.length === 0 ? (

        <div className="empty">
          No orders found.
        </div>

      ) : (

        <div className="grid">

          {orders.map((order) => (

            <div
              key={order.id}
              className="card"
            >

              {order.crop.image && (

                <img
                  src={order.crop.image}
                  alt={order.crop.cropName}
                  className="cropImage"
                />

              )}

              <h2 className="crop">
                {order.crop.cropName}
              </h2>

              <p>
                <strong>Buyer :</strong> {order.buyer.name}
              </p>

              <p>
                <strong>Phone :</strong> {order.buyer.phone}
              </p>

              <p>
                <strong>Quantity :</strong> {order.quantity} {order.crop.unit}
              </p>

              <p>
                <strong>Total :</strong> ₹{order.totalPrice}
              </p>

              <p>

                <strong>Status :</strong>

                <span
                  className={`status ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>

              </p>

              {order.status === "PENDING" && (

                <div className="buttons">

                  <button
                    className="acceptBtn"
                    disabled={loadingId === order.id}
                    onClick={() =>
                      updateStatus(order.id, "ACCEPTED")
                    }
                  >
                    {loadingId === order.id
                      ? "Processing..."
                      : "✅ Accept"}
                  </button>

                  <button
                    className="rejectBtn"
                    disabled={loadingId === order.id}
                    onClick={() =>
                      updateStatus(order.id, "REJECTED")
                    }
                  >
                    {loadingId === order.id
                      ? "Processing..."
                      : "❌ Reject"}
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

}