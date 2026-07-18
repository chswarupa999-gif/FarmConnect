"use client";

import { useState } from "react";
import Link from "next/link";
import api from "../services/api";
import "./page.css";

export default function RegisterPage() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "FARMER",
    language: "",
    district: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      alert("Registration Successful");

      window.location.href = "/login";

    } catch (err) {
      console.log(err);
      alert("Registration Failed");
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <h1>🌾 FarmConnect</h1>

        <h2>Create Account</h2>

        <form onSubmit={register}>

          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Role</label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="FARMER">Farmer</option>
              <option value="DEALER">Dealer</option>
            </select>

          </div>

          <div className="input-group">
            <label>Language</label>

            <input
              type="text"
              name="language"
              placeholder="Telugu / Hindi / English"
              value={form.language}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">
            <label>District</label>

            <input
              type="text"
              name="district"
              placeholder="Enter district"
              value={form.district}
              onChange={handleChange}
            />

          </div>

          <button className="register-btn">
            Register
          </button>

        </form>

        <p className="login-link">
          Already have an account?
          <Link href="/login"> Login</Link>
        </p>

      </div>

    </div>
  );
}