"use client";
import Button from "@/components/Element/Button/Button";
import Input from "@/components/Element/Input/Input";
import useLoadingStore from "@/libs/useLoading";
import { useUserStore } from "@/libs/userStore";
import isValidEmail from "@/utils/isValidEmail";
import axios from "axios";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

enum LayoutProps {
  SignIn = "signIn",
  Register = "register",
}

const Modal = ({ isOpen, setIsOpen }: ModalProps) => {
  const loginUser = useUserStore((state) => state.login);
  const { logout } = useUserStore();
  const { isLoading, setIsLoading, isGlobalLoading, setIsGlobalLoading } =
    useLoadingStore();
  const pathName = usePathname();
  const router = useRouter();
  const [formLayout, setFormLayout] = useState<LayoutProps>(LayoutProps.SignIn);
  const [formError, setFormError] = useState({
    fullname: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    passwordNotMatch: "Password doesn't match",
  });
  const [formSignIn, setFormSignIn] = useState({
    email: "",
    password: "",
  });
  const [formSignUp, setFormSignUp] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCloseOutside = (event: MouseEvent) => {
    const modalContent = document.getElementById("modal-content");
    if (modalContent && !modalContent.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const toggleLayout = () => {
    setFormLayout((prevLayout) =>
      prevLayout === LayoutProps.SignIn
        ? LayoutProps.Register
        : LayoutProps.SignIn
    );
  };

  console.log(isGlobalLoading);
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleCloseOutside);
    } else {
      document.removeEventListener("mousedown", handleCloseOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleCloseOutside);
    };
  }, [handleCloseOutside, isOpen]);

  useEffect(() => {
    if (
      formSignUp.confirmPassword &&
      formSignUp.confirmPassword !== formSignUp.password
    ) {
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
  }, [
    errorMessage.passwordNotMatch,
    formSignUp.confirmPassword,
    formSignUp.password,
  ]);

  const onLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/customer/login`,
        {
          email: formSignIn.email,
          password: formSignIn.password,
        }
      );
      // Set cookie token
      setCookie(null, "token", response.data.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      loginUser(response.data.access_token, response.data.user);
      toast.success("Login success");
      setFormSignIn({
        email: "",
        password: "",
      });
      setIsOpen(false);
    } catch (err) {
      console.log("Login failed:", err);
      // @ts-ignore
      let message = err.response.data.message || "Error";
      // setError("Invalid credentials");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  const onRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/customer/register`,
        {
          name: formSignUp.fullname,
          email: formSignUp.email,
          password: formSignUp.password,
          password_confirmation: formSignUp.confirmPassword,
        }
      );

      toast.success("Regiter success");
      setFormSignIn({
        email: "",
        password: "",
      });
      localStorage.setItem("temp_token", response.data.data.uuid);
      localStorage.setItem("email", response.data.data.email);
      router.push("/email/verify-email");
      setIsOpen(false);
    } catch (err) {
      let message = "Error";

      // @ts-ignore
      if (err.response && err.response.data && err.response.data.messages) {
        // @ts-ignore
        const errors = err.response.data.messages;
        // @ts-ignore
        message = Object.values(errors).flat()[0] || "Error";
        // @ts-ignore
      } else if (err.response && err.response.data && err.response.data.error) {
        // @ts-ignore
        message = err.response.data.error;
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserGoogle = async (token: any, code: any) => {
    setIsGlobalLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/customer/${code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        router.push("/");
        loginUser(token, response.data.data);
      } else {
        router.push("/");
        logout();
        setIsGlobalLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsGlobalLoading(false);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const code = urlParams.get("code");

    if (token) {
      setCookie(null, "token", token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      getUserGoogle(token, code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginGoogle = () => {
    window.location.href = "http://127.0.0.1:8000/customer/oauth/google";
  };

  const buttonValidatorSignUp = () => {
    return (
      formSignUp.password.length >= 8 &&
      formSignUp.confirmPassword.length >= 8 &&
      formSignUp.fullname &&
      isValidEmail(formSignUp.email) &&
      !isLoading
    );
  };

  return (
    <>
      {isOpen && (
        <div
          id="modal-signin"
          className="fixed inset-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-auto bg-gray-800 bg-opacity-80"
          role="dialog"
          aria-labelledby="modal-signin-label"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className="mt-7 sm:max-w-lg sm:w-full m-3 sm:mx-auto relative">
            <div
              id="modal-content"
              className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700"
            >
              <div className="p-4 sm:p-7">
                {/* Close Button */}
                <button
                  type="button"
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                    {formLayout === LayoutProps.SignIn ? "Sign in" : "Register"}
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                    {formLayout === LayoutProps.SignIn
                      ? "Don't have an account yet?"
                      : "Alredy have an account?"}

                    <button
                      type="button"
                      className="text-emerald-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-emerald-500"
                      onClick={toggleLayout}
                    >
                      {formLayout === LayoutProps.SignIn
                        ? "Sign up here"
                        : "Sign in here"}
                    </button>
                  </p>
                </div>

                {/* Rest of the form */}
                <div className="mt-5">
                  <button
                    type="button"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    onClick={loginGoogle}
                  >
                    <svg
                      className="w-4 h-auto"
                      width="46"
                      height="47"
                      viewBox="0 0 46 47"
                      fill="none"
                    >
                      <path
                        d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                        fill="#34A853"
                      />
                      <path
                        d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                        fill="#EB4335"
                      />
                    </svg>
                    Sign in with Google
                  </button>

                  <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                    Or
                  </div>

                  {formLayout === LayoutProps.SignIn ? (
                    // login layout
                    <form onSubmit={onLoginSubmit}>
                      <div className="grid gap-y-4">
                        {/* Email Input */}
                        <Input
                          id="email"
                          label="Email Address"
                          name="email"
                          value={formSignIn.email || ""}
                          type="email"
                          required={true}
                          onChange={(e) =>
                            setFormSignIn({
                              ...formSignIn,
                              email: e.target.value,
                            })
                          }
                        />

                        {/* Password Input */}
                        <Input
                          id="password"
                          type="password"
                          name="password"
                          value={formSignIn.password || ""}
                          label="Password"
                          withResetPassword={true}
                          required={true}
                          iconPosition="Right"
                          inputPassword={true}
                          onChange={(e) => {
                            setFormSignIn({
                              ...formSignIn,
                              password: e.target.value,
                            });
                          }}
                        />

                        {/* <button
                          type="submit"
                          className={clsx(
                            "w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent",
                            "bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none"
                          )}
                          disabled={
                            (formSignIn.password.length >= 8 &&
                              isValidEmail(formSignIn.email)) ||
                            isLoading
                              ? false
                              : true
                          }
                          aria-disabled={isLoading ? "true" : "false"}
                        >
                          {isLoading ? (
                            <div className="dot-container">
                              <div className="dot" />
                              <div className="dot" />
                              <div className="dot" />
                            </div>
                          ) : (
                            "Sign in"
                          )}
                        </button> */}
                        <Button
                          label="Sign In"
                          isLoading={isLoading}
                          type="submit"
                          disabled={
                            (formSignIn.password.length >= 8 &&
                              isValidEmail(formSignIn.email)) ||
                            isLoading
                              ? false
                              : true
                          }
                        />
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={onRegisterSubmit}>
                      <div className="grid gap-y-4">
                        {/* Fullname Input */}
                        <Input
                          id="fullname"
                          label="Full Name"
                          name="fullname"
                          type="text"
                          required={true}
                          onChange={(e) =>
                            setFormSignUp({
                              ...formSignUp,
                              fullname: e.target.value,
                            })
                          }
                        />
                        {/* Email Input */}
                        <Input
                          id="email_register"
                          label="Email Address"
                          name="email_register"
                          type="email"
                          required={true}
                          onChange={(e) =>
                            setFormSignUp({
                              ...formSignUp,
                              email: e.target.value,
                            })
                          }
                        />

                        {/* Password Input */}
                        <Input
                          id="password_register"
                          label="Password"
                          name="password_register"
                          type="password"
                          iconPosition="Right"
                          inputPassword={true}
                          required={true}
                          onChange={(e) =>
                            setFormSignUp({
                              ...formSignUp,
                              password: e.target.value,
                            })
                          }
                        />
                        {/* Confirm Password Input */}
                        <Input
                          id="c_password_register"
                          label="Confirm Password"
                          name="c_password_register"
                          type="password"
                          iconPosition="Right"
                          inputPassword={true}
                          isError={formError.confirmPassword}
                          errorMessage={errorMessage.passwordNotMatch}
                          required={true}
                          onChange={(e) =>
                            setFormSignUp({
                              ...formSignUp,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                        <Button
                          label="Sign Up"
                          isLoading={isLoading}
                          type="submit"
                          disabled={!buttonValidatorSignUp()}
                        />
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
