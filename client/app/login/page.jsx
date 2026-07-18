"use client";

import { useState } from "react";
import api from "../services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./page.css";

export default function LoginPage() {

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await api.post("/auth/login", {
        phone,
        password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Redirect based on role
      if (response.data.user.role === "FARMER") {
        router.push("/farmer-dashboard");
      } else {
        router.push("/dealer-dashboard");
      }

    } catch (error) {
      console.log(error);
      alert("Invalid phone or password");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>🌾 FarmConnect</h1>
        <h2>Login</h2>
        

        <form onSubmit={handleLogin}>

          <div className="input-group">
            <label>Phone Number</label>

            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

        </form>

        <div className="register-link">
          Don't have an account?{" "}
          <Link href="/register">
            Register
          </Link>
        </div>

      </div>

    </div>
  );
}