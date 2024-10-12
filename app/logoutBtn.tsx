"use client";

import { useAppContext } from "./ContextApp";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { setUser } = useAppContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "GET" });
      const data = await response.json();
      if (data.success) {
        setUser(null);
        router.push("/login");
      } else {
        throw new Error(data.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 p-2 text-white">
      logout
    </button>
  );
}
