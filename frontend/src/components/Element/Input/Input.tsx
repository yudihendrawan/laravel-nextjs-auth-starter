"use client";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface InputProps {
  className?: string;
  type: string;
  required?: boolean;
  name: string;
  id: string;
  label: string;
  withResetPassword?: boolean;
  value?: string;
  isError?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  iconPosition?: "Left" | "Right";
  inputPassword?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input = ({
  className,
  type,
  required = false,
  withResetPassword = false,
  isError = false,
  errorMessage = "",
  inputPassword = false,
  iconPosition,
  icon,
  value,
  name,
  id,
  label,
  onChange,
}: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const router = useRouter();
  const onForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div>
      {withResetPassword ? (
        <div className="flex justify-between items-center">
          <label
            htmlFor="password"
            className="block text-sm mb-2 dark:text-white"
          >
            {label}
          </label>
          <button
            type="button"
            tabIndex={-1}
            onClick={onForgotPassword}
            className="inline-flex items-center gap-x-1 text-sm text-emerald-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-emerald-500"
          >
            Forgot password?
          </button>
        </div>
      ) : (
        <label htmlFor={id} className="block text-sm mb-2 dark:text-white">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={inputPassword ? (passwordVisible ? "text" : "password") : type}
          id={id}
          name={name}
          value={value}
          className={clsx(
            "py-3 px-4 block w-full border-neutral-800 border  rounded-lg text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-500 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600",
            className,
            icon && iconPosition === "Left" && "pl-10",
            icon && iconPosition === "Right" && "pr-10"
          )}
          required={required}
          onChange={onChange}
        />
        {icon && (
          <button
            tabIndex={-1}
            type="button"
            className={clsx(
              "absolute inset-y-0  flex items-center pointer-events-none peer-disabled:opacity-50 peer-disabled:pointer-events-none",
              iconPosition === "Left" && "start-0 ps-4",
              iconPosition === "Right" && "end-0 pe-4"
            )}
          >
            {icon}
          </button>
        )}

        {inputPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={togglePassword}
            className={clsx(
              "absolute inset-y-0  flex items-center  ",
              iconPosition === "Left" && "start-0 ps-4",
              iconPosition === "Right" && "end-0 pe-4"
            )}
          >
            {passwordVisible ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
      {isError && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default Input;
