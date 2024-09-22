"use client";
import { useState } from "react";
import axios from "axios";
import Input from "@/components/Element/Input/Input";
import Button from "@/components/Element/Button/Button";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/user/forgot-password`,
        {
          email,
        }
      );
      toast.success(response.data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h1>Forgot Password</h1>
      {/* {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>} */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* <button
          type="submit"
          disabled={loading}
          style={{ padding: "0.5rem 1rem" }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button> */}
        <Button label="Send Reset Link" type="submit" isLoading={loading} />
      </form>
    </div>
  );
};

export default ForgotPassword;
