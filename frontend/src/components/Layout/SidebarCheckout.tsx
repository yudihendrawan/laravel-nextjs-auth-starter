"use client";
import { Product } from "@/types/Product";
import { formatRupiah } from "@/utils/formatRupiah";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

interface SidebarCheckoutProps {
  isOpen: boolean;
  toggleSidebarCheckout: () => void;
}

const SidebarCheckout: React.FC<SidebarCheckoutProps> = ({
  isOpen,
  toggleSidebarCheckout,
}) => {
  const [cart, setCart] = useState<Product[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const currentCart = JSON.parse(savedCart);
      setCart(currentCart);
    }
  }, [isOpen]);

  const updateQuantity = (index: number, delta: number) => {
    const updatedCart = cart
      .map((product, i) => {
        if (i === index) {
          return {
            ...product,
            quantity: (product.quantity || 1) + delta,
          };
        }
        return product;
      })
      .filter((product) => product.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      toggleSidebarCheckout();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={sidebarRef}
      id="hs-offcanvas-example"
      className={`hs-overlay transition-all duration-300 transform h-full max-w-full md:max-w-sm w-full z-[80] bg-white border-e dark:bg-neutral-800 dark:border-neutral-700 fixed top-0 end-0 ${
        isOpen ? "-translate-x-0" : "translate-x-full"
      }`}
      role="dialog"
      tabIndex={-1}
      aria-labelledby="hs-offcanvas-example-label"
    >
      <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
        <h3
          id="hs-offcanvas-example-label"
          className="font-bold text-gray-800 dark:text-white"
        >
          Cart
        </h3>
        <button
          type="button"
          className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
          aria-label="Close"
          onClick={toggleSidebarCheckout}
        >
          <span className="sr-only">Close</span>
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
      <div className="p-4">
        {cart.length > 0 ? (
          cart.map((product, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between">
                <div className="flex">
                  <div className="relative">
                    <Image
                      src={product.imageUrl[0].url}
                      alt="product image"
                      width={100}
                      height={100}
                      className="rounded-md w-16 h-14 object-cover"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -left-2  rounded-full border border-transparent bg-gray-200 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-600 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                      aria-label="Remove"
                      onClick={() => removeFromCart(index)}
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        className="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="flex text-sm flex-col">
                    <p className="px-2 ">{product.name}</p>
                    <p className="px-2 font-light text-gray-500 dark:text-neutral-300">
                      Product type
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p>{formatRupiah(product.price * product.quantity)}</p>
                  <div className="flex items-center mx-0 justify-end">
                    <button
                      className={`${
                        product.quantity <= 1
                          ? "text-emerald-200"
                          : " text-emerald-500 hover:text-emerald-600"
                      }`}
                      onClick={() => updateQuantity(index, -1)}
                      disabled={product.quantity <= 1}
                    >
                      <FaCircleMinus />
                    </button>
                    <span className="mx-2 text-lg font-semibold">
                      {product.quantity}
                    </span>
                    <button
                      className=" text-emerald-500 hover:text-emerald-600"
                      onClick={() => updateQuantity(index, 1)}
                    >
                      <FaCirclePlus />
                    </button>
                  </div>
                </div>
              </div>
              <hr className="my-2" />
            </React.Fragment>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default SidebarCheckout;
