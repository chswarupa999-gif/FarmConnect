"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <div className="dashboard">

      <div className="card">

        <h1>Dealer Dashboard</h1>

        <h2>Welcome, {user?.name}</h2>

        <p>Choose what you want to do</p>

        <button onClick={() => router.push("/crops")}>
          Browse Crops
        </button>

        <button onClick={() => router.push("/orders")}>
          My Orders
        </button>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </div>
  );
}