import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface Image {
  product_id: number;
  imageIndex: number;
  url: string;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainImage: string;
  images: Image[];
  onThumbnailClick: (url: string) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  mainImage,
  images,
  onThumbnailClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setShowArrows(container.scrollWidth > container.clientWidth);
      }
    };

    handleScroll();
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, [images]);

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
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    console.log("close");
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex container items-center justify-center bg-black bg-opacity-75"
      onClick={handleOverlayClick}
    >
      <div
        className="relative bg-white p-4 rounded-lg w-full max-w-4xl"
        ref={modalRef}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-black bg-white rounded-full shadow"
        >
          <FaTimes />
        </button>
        <div className="mb-4 flex justify-center">
          <Image
            src={mainImage}
            alt="Main"
            width={800}
            height={800}
            className="max-w-full h-[30vh] sm:h-[50vh] md:h-[70vh] object-cover"
          />
        </div>
        <div className="relative">
          <div
            className="flex space-x-2 overflow-x-auto "
            ref={scrollContainerRef}
          >
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbnailClick(image.url)}
                className="flex-shrink-0"
              >
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className={`w-24 h-24 object-cover rounded-md ${
                    mainImage === image.url ? "border-2 border-primary-300" : ""
                  }`}
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
                <FaChevronLeft />
              </button>
              <button
                onClick={scrollRight}
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 glass-effect border rounded-full shadow"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
