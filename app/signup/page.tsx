"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      router.push("/dashboard");
    } else {
      setError(data.error || "An error occurred during sign-up");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-2">
      <h1 className="text-2xl font-bold">Create an account</h1>
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
        <button className="bg-red-600 p-2 text-white" type="submit">
          Continue
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <Link href="/login">Sign in</Link>
    </div>
  );
}
