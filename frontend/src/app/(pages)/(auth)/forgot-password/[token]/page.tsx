"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Input from "@/components/Element/Input/Input";
import Button from "@/components/Element/Button/Button";
import toast from "react-hot-toast";

const ResetPassword: React.FC<{ params: { token: string } }> = ({ params }) => {
  const { token } = params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState({
    passwordNotMatch: "Password doesn't match",
  });
  const [formError, setFormError] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
      setFormError((prev) => ({
        ...prev,
        confirmPassword: true,
      }));
    } else {
      setFormError((prev) => ({
        ...prev,
        confirmPassword: false,
      }));
    }
  }, [errorMessage.passwordNotMatch, confirmPassword, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/user/password/reset-password`,
        {
          token,
          password,
          password_confirmation: confirmPassword,
        }
      );

      if (response.status == 201) {
        toast.success(response.data.message);
        router.push("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-900">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-neutral-200">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Please enter your new password.
          </p>
        </div>

        {message && <p className="text-red-500">{message}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="password"
            type="password"
            name="password"
            label="Password"
            required={true}
            iconPosition="Right"
            inputPassword={true}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Input
            id="c_password"
            label="Confirm Password"
            name="c_password"
            type="password"
            iconPosition="Right"
            inputPassword={true}
            isError={formError.confirmPassword}
            errorMessage={errorMessage.passwordNotMatch}
            required={true}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <div className="mt-5 flex justify-end gap-x-2">
            <Button label="Reset Password" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
