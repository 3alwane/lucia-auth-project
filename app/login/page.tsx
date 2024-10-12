"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "An error occurred during login");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center h-screen justify-center">
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <label htmlFor="username">Username</label>
        <input
          className="border"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          className="border"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button className="bg-red-500 p-2 text-white" type="submit">
          Continue
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <Link className="cursor-pointer" href="/signup">
        Create an account
      </Link>
    </div>
  );
}
