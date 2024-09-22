"use client";

import ImageModal from "@/components/Layout/ProductDetail/ImageModal";
import useProduct from "@/components/library/UseProduct";
import useStore from "@/components/library/UseStore";
import UseLoaded from "@/hooks/useLoaded";
import { useMouseOverZoom } from "@/hooks/useMouseZoom";
import { Product } from "@/types/Product";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";
import { formatRupiah } from "@/utils/formatRupiah";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  FaCartPlus,
  FaChevronLeft,
  FaChevronRight,
  FaCircleMinus,
  FaCirclePlus,
} from "react-icons/fa6";

function Page({ params }: { params: { id: number } }) {
  const products = useProduct((state) => state.products);
  const product = products.find((product) => product.id == params.id);
  const [mainImage, setMainImage] = useState(product?.imageUrl[0]?.url);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const isLoaded = UseLoaded();
  const { isSidebarCheckoutOpen, toggleSidebarCheckout } = useStore(
    (state) => ({
      isSidebarCheckoutOpen: state.isSidebarCheckoutOpen,
      toggleSidebarCheckout: state.toggleSidebarCheckout,
    })
  );
  const [isZoomImage, setIsZoomImage] = useState<boolean | null>(false);

  const sourceImage = useRef<HTMLImageElement>(null);
  const targetImage = useRef<HTMLCanvasElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  // call the custom hook
  useMouseOverZoom(sourceImage, targetImage, cursor);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;

      if (container) {
        // console.log(
        //   Math.round(container?.scrollWidth / container?.clientWidth)
        // );
        setShowArrows(container.scrollWidth > container.clientWidth);
      }
    };

    handleScroll();
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, [product?.imageUrl]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const currentCart = JSON.parse(savedCart).find(
        (c: any) => c.id == params.id
      );
      // console.log("detailproduct - current cart", currentCart);
      setCart(currentCart);
      setQuantity(currentCart?.quantity || 1);
    }
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      setIsZoomImage(true);
    };

    const handleMouseLeave = () => {
      setIsZoomImage(false);
    };

    const imageElement = sourceImage.current;

    if (imageElement) {
      imageElement.addEventListener("mouseenter", handleMouseEnter);
      imageElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (imageElement) {
        imageElement.removeEventListener("mouseenter", handleMouseEnter);
        imageElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const addToCart = (product: Product) => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingProductIndex = cart.findIndex(
      (item: { id: number }) => item.id === product.id
    );

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity = product.quantity;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        discount: product.discount,
        imageUrl: product.imageUrl,
        originalPrice: product.originalPrice,
        stock: product.stock - quantity,
        quantity,
      });
      toggleSidebarCheckout();
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleThumbnailClick = (url: string) => {
    setMainImage(url);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`flex flex-col md:flex-row  ${isLoaded && "fade-in-start"}`}
    >
      <div className="max-w-md mx-auto rounded-md" data-fade="1">
        <div className="mb-4 rounded-md">
          <Image
            width={200}
            height={200}
            ref={sourceImage}
            // @ts-ignore
            src={mainImage}
            alt="Product"
            className="w-full h-64 cursor-crosshair object-cover rounded-md bg-white border"
            onClick={openModal}
          />
          <div
            ref={cursor}
            className="border border-emerald-500 absolute pointer-events-none"
          />

          {isZoomImage && (
            <canvas
              ref={targetImage}
              className="absolute pointer-events-none bottom-full translate-y-1/2 left-1/2 -translate-x-1/2 md:translate-y-0 md:translate-x-0 md:bottom-16 md:-left-48 border-4 border-emerald-500 w-64 h-64 z-10 bg-gray-200"
            />
          )}
        </div>

        <div className="relative">
          <div
            className="flex space-x-2 mb-4 overflow-x-auto scroll-smooth scroll-container"
            ref={scrollContainerRef}
          >
            {product?.imageUrl.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(image.url)}
                className="flex-shrink-0"
              >
                <Image
                  width={200}
                  height={200}
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className={` ${
                    mainImage === image.url
                      ? "border-emerald-500 opacity-50"
                      : ""
                  } w-28 h-28 object-cover rounded-md bg-white border`}
                />
              </button>
            ))}
          </div>
          {showArrows && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 glass-effect border rounded-full shadow"
              >
                <FaChevronLeft className="text-black" />
              </button>
              <button
                onClick={scrollRight}
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 glass-effect border rounded-full shadow"
              >
                <FaChevronRight className="text-black" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="md:items-center md:my-auto  w-1/2" data-fade="2">
        <h2 className="text-lg font-bold mb-2">{product?.name}</h2>
        <p className="text-gray-600 mb-2 sm:md-0">{product?.description}</p>

        {product?.stock != 0 ? (
          <div className="flex items-center mx-0 py-2 sm:py-0">
            <button
              className={`${
                (quantity || 1) <= 1
                  ? "text-emerald-200"
                  : " text-emerald-500 hover:text-emerald-600"
              }  `}
              onClick={() => setQuantity((prev) => prev - 1)}
              disabled={(quantity || 1) <= 1}
            >
              <FaCircleMinus />
            </button>
            <span className="mx-2 text-lg font-semibold">{quantity || 1}</span>
            <button
              className=" text-emerald-500 hover:text-emerald-600"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              <FaCirclePlus />
            </button>
          </div>
        ) : (
          <div className="flex items-center mx-0">
            <p className=" bg-red-200 text-red-500 px-2 py-1 text-xs rounded-md">
              Stok tidak tersedia
            </p>
          </div>
        )}

        <p className={`text-gray-900 dark:text-white text-lg font-bold`}>
          {formatRupiah(
            calculateDiscountedPrice(
              product?.originalPrice || 0,
              product?.discount || 0,
              true
            )
          )}
          {product?.discount != 0 && (
            <span className="ml-2 bg-emerald-200 text-emerald-900 px-2 py-1 text-xs rounded-md">
              {product?.discount}% off
            </span>
          )}
        </p>

        {product?.discount != 0 && (
          <p
            className={`text-gray-500  dark:text-gray-300 text-lg font-bold line-through`}
          >
            {formatRupiah(product?.originalPrice || 0)}
          </p>
        )}
        <button
          className={`${
            product?.stock == 0
              ? "disabled mt-4 w-full bg-emerald-300 text-white py-2 rounded-md"
              : "mt-4 w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600"
          }`}
          onClick={handleAddToCart}
          disabled={product?.stock == 0}
        >
          Add to Cart
        </button>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        // @ts-ignore
        mainImage={mainImage}
        images={product?.imageUrl || []}
        onThumbnailClick={handleThumbnailClick}
      />
    </div>
  );
}

export default Page;
