"use client";

import { useEffect, useState } from "react";
import api from "../services/api";
import "./page.css";

export default function CropsPage() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    fetchCrops();
  }, []);

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
              onClick={() => requestOrder(crop.id)}
            >
              📩 Request Order
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}