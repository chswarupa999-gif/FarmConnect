"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";
import "./page.css";

export default function MyOrdersPage() {

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

    if (!user || user.role !== "DEALER") {
      router.replace("/login");
      return;
    }

    fetchOrders();

  }, [router]);

  const fetchOrders = async () => {

    try {

      const response = await api.get("/orders/my");

      setOrders(response.data.orders);

    } catch (error) {

      console.log(error);

    }

  };

  const payNow = async (orderId) => {

    try {

      setLoadingId(orderId);

      const { data } = await api.post(
        "/orders/create-payment-order",
        {
          orderId,
        }
      );

      const options = {

        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: data.razorpayOrder.amount,

        currency: data.razorpayOrder.currency,

        name: "FarmConnect",

        description: "Crop Payment",

        order_id: data.razorpayOrder.id,

        handler: async function (response) {

          try {

            await api.post(
              "/orders/verify-payment",
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                orderId,
              }
            );

            alert("Payment Successful");

            fetchOrders();

          } catch (error) {

            console.log(error);

            alert("Payment Verification Failed");

          }

        },

        theme: {
          color: "#2E7D32",
        },

      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Payment Failed"
      );

    } finally {

      setLoadingId(null);

    }

  };

  return (

    <div className="container">

      <button
        className="backBtn"
        onClick={() => router.push("/dealer-dashboard")}
      >
        ← Dashboard
      </button>

      <h1 className="title">
        My Orders
      </h1>

      {orders.length === 0 ? (

        <h2 className="empty">
          No Orders Found
        </h2>

      ) : (

        <div className="grid">

          {orders.map((order) => (

            <div
              key={order.id}
              className="card"
            >

              <h2>{order.crop.cropName}</h2>

              <p>
                <strong>Farmer :</strong> {order.farmer.name}
              </p>

              <p>
                <strong>Quantity :</strong> {order.quantity}
              </p>

              <p>
                <strong>Total :</strong> ₹{order.totalPrice}
              </p>

              <p>
                <strong>Payment :</strong>

                <span
                  className={
                    order.paymentStatus === "PAID"
                      ? "paid"
                      : "pending"
                  }
                >
                  {" "}
                  {order.paymentStatus}
                </span>

              </p>

              <p>
                <strong>Status :</strong>

                <span
                  className={
                    order.status === "COMPLETED"
                      ? "paid"
                      : "pending"
                  }
                >
                  {" "}
                  {order.status}
                </span>

              </p>

              {order.status === "PENDING" && (

                <button
                  className="complete-btn"
                  disabled
                >
                  Waiting For Farmer
                </button>

              )}

              {order.status === "ACCEPTED" &&
                order.paymentStatus === "PENDING" && (

                <button
                  className="complete-btn"
                  disabled={loadingId === order.id}
                  onClick={() => payNow(order.id)}
                >
                  {loadingId === order.id
                    ? "Processing..."
                    : "💳 Pay Now"}
                </button>

              )}

              {order.status === "COMPLETED" && (

                <button
                  className="complete-btn"
                  disabled
                >
                  ✅ Completed
                </button>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

}