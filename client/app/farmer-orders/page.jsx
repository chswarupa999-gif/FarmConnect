"use client";

import { useEffect, useState } from "react";
import api from "../services/api";
import "./page.css";

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

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
    }
  };

  return (
    <div className="container">

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
                <strong>Buyer :</strong>{" "}
                {order.buyer.name}
              </p>

              <p>
                <strong>Phone :</strong>{" "}
                {order.buyer.phone}
              </p>

              <p>
                <strong>Quantity :</strong>{" "}
                {order.quantity} {order.crop.unit}
              </p>

              <p>
                <strong>Total :</strong> ₹
                {order.totalPrice}
              </p>

              <p>
                <strong>Status :</strong>{" "}
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
                    onClick={() =>
                      updateStatus(
                        order.id,
                        "ACCEPTED"
                      )
                    }
                  >
                    ✅ Accept
                  </button>

                  <button
                    className="rejectBtn"
                    onClick={() =>
                      updateStatus(
                        order.id,
                        "REJECTED"
                      )
                    }
                  >
                    ❌ Reject
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