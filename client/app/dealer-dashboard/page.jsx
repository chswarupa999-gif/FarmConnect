"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

export default function Dashboard() {

  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "DEALER") {
      router.replace("/login");
      return;
    }

    setUser(parsedUser);

  }, [router]);

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/login");

  };

  return (

    <div className="dashboard">

      <div className="card">

        <button
          className="backBtn"
          onClick={() => router.back()}
        >
          ← Back
        </button>

        <h1>Dealer Dashboard</h1>

        <h2>Welcome, {user?.name}</h2>

        <p>Choose what you want to do</p>

        <button
          onClick={() => router.push("/crops")}
        >
          🌾 Browse Crops
        </button>

        <button
          onClick={() => router.push("/orders")}
        >
          📦 My Orders
        </button>

        <button
          className="logoutBtn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>

  );

}