"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

export default function FarmerDashboard() {

  const router = useRouter();

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

  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (

    <div className="dashboard">

      <div className="header">

        <button
          className="backBtn"
          onClick={() => router.back()}
        >
          ← Back
        </button>

        <h1 className="title">
          🌾 Farmer Dashboard
        </h1>

        <button
          className="logoutBtn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      <p className="subtitle">
        Manage your crops and orders easily.
      </p>

      <div className="cards">

        <Link href="/my-crops" className="card">

          <h2>🌱 My Crops</h2>

          <p>
            Add, edit and delete your crop listings.
          </p>

          <button className="cardBtn">
            Manage Crops →
          </button>

        </Link>

        <Link href="/farmer-orders" className="card">

          <h2>📦 Orders</h2>

          <p>
            Accept or reject dealer requests.
          </p>

          <button className="cardBtn">
            View Orders →
          </button>

        </Link>

      </div>

    </div>

  );

}