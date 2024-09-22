"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/admin/login`,
        {
          email,
          password,
        }
      );
      console.log(response);
      setCookie(null, "token", response.data.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const signInGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/oauth/google`;
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        <button type="button" onClick={signInGoogle}>
          Login with Google
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
