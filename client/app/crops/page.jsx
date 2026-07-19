"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";
import "./page.css";

export default function CropsPage() {

  const [crops, setCrops] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const router = useRouter();

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

    fetchCrops();

  }, [router]);

  const fetchCrops = async () => {

    try {

      const response = await api.get("/crops");

      setCrops(response.data.crops);

    } catch (error) {

      console.log(error);

    }

  };

  const requestOrder = async (cropId) => {

    try {

      setLoadingId(cropId);

      const response = await api.post("/orders", {
        cropId,
        quantity: 1,
      });

      alert(response.data.message);

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable to send request"
      );

    } finally {

      setLoadingId(null);

    }

  };

  return (

    <div className="container">

      <h1>Available Crops</h1>

      <div className="grid">

        {crops.map((crop) => (

          <div
            key={crop.id}
            className="card"
          >

            {crop.image && (
              <img
                src={crop.image}
                alt={crop.cropName}
              />
            )}

            <h2>{crop.cropName}</h2>

            <p>
              <strong>Price:</strong> ₹ {crop.price}
            </p>

            <p>
              <strong>Quantity:</strong> {crop.quantity} {crop.unit}
            </p>

            <p>
              <strong>Location:</strong> {crop.location}
            </p>

            <p>{crop.description}</p>

            <button
              disabled={loadingId === crop.id}
              onClick={() => requestOrder(crop.id)}
            >
              {loadingId === crop.id
                ? "Sending..."
                : "📩 Request Order"}
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}