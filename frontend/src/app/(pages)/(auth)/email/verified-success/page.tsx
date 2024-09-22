"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Element/Button/Button";

const VerificationSuccessPage: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("temp_token");
    const storedEmail = localStorage.getItem("email");
    setToken(storedToken || "");
    if (!storedToken && !storedEmail) {
      router.push("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoHome = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("temp_token");
    localStorage.setItem("authLogin", JSON.stringify(true));
    router.push("/");
  };

  return (
    <>
      {token && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h1>Email Verified Successfully!</h1>
          <p>
            Thank you for verifying your email address. You can now Login and
            enjoy all the features of our application.
          </p>

          <Button label="Go to Home" onClick={handleGoHome} />
        </div>
      )}
    </>
  );
};

export default VerificationSuccessPage;
