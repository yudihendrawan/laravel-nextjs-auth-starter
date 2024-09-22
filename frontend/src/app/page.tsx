"use client";
import SidebarCheckout from "@/components/Layout/SidebarCheckout";
import useProduct from "@/components/library/UseProduct";
import useStore from "@/components/library/UseStore";
import UseLoaded from "@/hooks/useLoaded";
import { Product } from "@/types/Product";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";
import { formatRupiah } from "@/utils/formatRupiah";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isSidebarCheckoutOpen, toggleSidebarCheckout } = useStore(
    (state) => ({
      isSidebarCheckoutOpen: state.isSidebarCheckoutOpen,
      toggleSidebarCheckout: state.toggleSidebarCheckout,
    })
  );

  const products = useProduct((state) => state.products);
  const router = useRouter();
  const isLoaded = UseLoaded();

  return (
    <main className="">
      <div className={`${isLoaded ? "fade-in-start" : ""}`}>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto mt-11">
          {products.map((product) => (
            <Link
              href={`/detail-product/${product.id}`}
              key={product.id}
              className={`${product.stock == 0 ? "disabled" : ""}`}
            >
              <div
                data-fade="1"
                key={product.id}
                className="relative flex flex-col justify-between h-full overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md "
              >
                <div>
                  <div className="relative overflow-hidden">
                    <Image
                      className="sm:h-48 h-40 w-full object-cover object-center duration-300 hover:scale-105 hover:shadow-lg"
                      src={product.imageUrl[0].url}
                      alt={product.name}
                      width={200}
                      height={200}
                      priority
                    />
                    {(product.discount || product.discount != 0) && (
                      <div className="absolute top-2 left-2 bg-emerald-200 text-emerald-900 px-2 py-1 text-xs rounded-md">
                        {product.discount}% off
                      </div>
                    )}
                    {(product.stock == 0 || !product.stock) && (
                      <div className="absolute top-2 left-2 bg-red-200 text-red-500 px-2 py-1 text-xs rounded-md">
                        Stok habis
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="mb-2 text-lg font-medium dark:text-white text-gray-900">
                      {product.name}
                    </h2>
                    {/* <p className="mb-2 text-base dark:text-gray-300 text-gray-700">
                    {product.description}
                  </p> */}
                    <div className="flex md:items-center sm:flex-row flex-col ">
                      <p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {formatRupiah(
                          calculateDiscountedPrice(
                            product.originalPrice,
                            product.discount,
                            true
                          )
                        )}
                      </p>
                      <p className="text-base font-medium text-gray-500 line-through dark:text-gray-300">
                        {formatRupiah(product.originalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="px-3 py-2">
                  <button
                    className="mt-auto w-full mb-1 self-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
