"use client";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useUserStore } from "@/libs/userStore";

const VerifyEmail: FC = () => {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [hasResent, setHasResent] = useState<boolean | null>(false); // State baru
  const { token: access_token } = useUserStore();

  useEffect(() => {
    const storedToken = localStorage.getItem("temp_token");
    const storedEmail = localStorage.getItem("email");
    const storedResend = localStorage.getItem("resend");
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
      if (storedResend) {
        setHasResent(JSON.parse(storedResend));
      }
      if (access_token) {
        localStorage.removeItem("resend");
      }
      if (!storedToken && !email) {
        router.push("/");
      }
    } else {
      router.back();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResendEmail = async () => {
    if (isResending || hasResent)
      return toast(`Please check your email ${email}.`, {
        icon: "📩",
      });
    setIsResending(true);
    localStorage.setItem("resend", JSON.stringify(true));
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/verify/send/${token}`
      );

      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.message);
        setHasResent(true); // Tandai bahwa email telah dikirim ulang
      }
    } catch (error) {
      const message = error.response?.data.message || "Error occurred";
      toast.error(message);
    }
    setIsResending(false);
  };

  return (
    <>
      {email && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h1>Verify Your Email</h1>
          {email && <h3>{`Verification email sent to: ${email}`}</h3>}
          <p>
            {
              " We've sent a verification link to your email address. Please check your inbox and follow the instructions to confirm your email."
            }
          </p>
          <p>
            {"If you can't find the email, check your spam folder or "}
            <a
              className="text-emerald-500 hover:underline"
              href="#"
              onClick={handleResendEmail}
            >
              {hasResent
                ? "Verification email already resent."
                : "click here to resend the verification email"}
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
};

export default VerifyEmail;
