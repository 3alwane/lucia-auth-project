"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashClientWrapper from "./dashClientWrapper";

import { useContextApp } from "../ContextApp";

export default function Dashboard() {
  const { user, setUser } = useContextApp();
  const [loading, setLoading] = useState(true); // Handle loading state
  const router = useRouter(); // Next.js router for redirection

  // Validation logic
  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await fetch("/api/validate-user");
        const data = await response.json();

        // If user is authenticated, store the user data in state
        if (data.isAuthenticated) {
          setUser(data.user);
        } else {
          // Redirect to login if not authenticated
          router.push("/login");
        }
      } catch (error) {
        console.error("Validation error:", error);
        router.push("/login"); // Fallback to redirect in case of error
      } finally {
        setLoading(false); // Set loading to false once validation is done
      }
    };

    validateUser(); // Call validation function on component mount
  }, []);

  console.log(user);
  // Only depend on router

  // Show loading while user is being validated
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render nothing if user is not authenticated and redirection has occurred
  if (!user) {
    return null; // This will prevent further rendering after redirection
  }

  // Render the dashboard once user is authenticated
  return (
    <div>
      <h1>Welcome {user.username}</h1>
      {/* Render DashClientWrapper when the user is available */}
      <DashClientWrapper />
    </div>
  );
}
