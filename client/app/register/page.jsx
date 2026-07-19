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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!form.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (!form.language.trim()) {
      alert("Please enter your language.");
      return;
    }

    if (!form.district.trim()) {
      alert("Please enter your district.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", form);

      alert("Registration Successful");

      window.location.href = "/login";
    } catch (err) {
      console.log(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration Failed");
      }
    } finally {
      setLoading(false);
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
              required
              minLength={3}
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter 10-digit phone number"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              maxLength={10}
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
              required
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
              required
              minLength={6}
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
              required
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
              required
            />
          </div>

          <button
            className="register-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
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