"use client";

import { useEffect, useState } from "react";
import api from "../services/api";
import "./page.css";

export default function MyCrops() {
  const [crops, setCrops] = useState([]);

  const [form, setForm] = useState({
    cropName: "",
    quantity: "",
    unit: "",
    price: "",
    location: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMyCrops();
  }, []);

  const fetchMyCrops = async () => {
    try {
      const res = await api.get("/crops/my");
      setCrops(res.data.crops);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      cropName: "",
      quantity: "",
      unit: "",
      price: "",
      location: "",
      description: "",
    });

    setImage(null);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("cropName", form.cropName);
      formData.append("quantity", form.quantity);
      formData.append("unit", form.unit);
      formData.append("price", form.price);
      formData.append("location", form.location);
      formData.append("description", form.description);

      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await api.put(`/crops/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Crop Updated");
      } else {
        await api.post("/crops", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Crop Added");
      }

      resetForm();
      fetchMyCrops();
    } catch (err) {
      console.log(err);
    }
  };

  const editCrop = (crop) => {
    setEditingId(crop.id);

    setForm({
      cropName: crop.cropName,
      quantity: crop.quantity,
      unit: crop.unit,
      price: crop.price,
      location: crop.location,
      description: crop.description || "",
    });
  };

  const deleteCrop = async (id) => {
    if (!confirm("Delete this crop?")) return;

    try {
      await api.delete(`/crops/${id}`);

      alert("Deleted");

      fetchMyCrops();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">

      <h1>My Crops</h1>

      <div className="form">

        <input
          name="cropName"
          placeholder="Crop Name"
          value={form.cropName}
          onChange={handleChange}
        />

        <input
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />

        <input
          name="unit"
          placeholder="Unit"
          value={form.unit}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button onClick={handleSubmit}>
          {editingId ? "Update Crop" : "Add Crop"}
        </button>

      </div>

      <hr />

      <div className="grid">

        {crops.map((crop) => (

          <div key={crop.id} className="card">

            {crop.image && (
              <img
                src={crop.image}
                alt={crop.cropName}
              />
            )}

            <h3>{crop.cropName}</h3>

            <p><strong>Price:</strong> ₹ {crop.price}</p>

            <p><strong>Quantity:</strong> {crop.quantity} {crop.unit}</p>

            <p><strong>Location:</strong> {crop.location}</p>

            <p><strong>Description:</strong> {crop.description}</p>

            <div className="buttons">

              <button
                className="edit"
                onClick={() => editCrop(crop)}
              >
                Edit
              </button>

              <button
                className="delete"
                onClick={() => deleteCrop(crop.id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}