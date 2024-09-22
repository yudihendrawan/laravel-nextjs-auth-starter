import { Product } from "@/types/Product";
import create from "zustand";

interface ProductState {
  products: Product[];
  setProduct: (newProduct: Product[]) => void;
}

const useProduct = create<ProductState>((set) => ({
  products: [
    {
      id: 1,
      name: "Skincare Product 1",
      description: "A nourishing skincare product to keep your skin glowing.",
      price: 200000,
      originalPrice: 250000,
      discount: 20,
      quantity: 0,
      stock: 20,
      imageUrl: [
        {
          product_id: 1,
          imageIndex: 0,
          url: "https://images.unsplash.com/photo-1600428853876-fb5a850b444f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
    {
      id: 2,
      name: "Skincare Product 2",
      description: "Another great skincare product for your daily routine.",
      price: 180000,
      originalPrice: 220000,
      quantity: 0,
      discount: 25,
      stock: 20,
      imageUrl: [
        {
          product_id: 2,
          imageIndex: 0,
          url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        },
        {
          product_id: 2,
          imageIndex: 1,
          url: "https://images.unsplash.com/photo-1619451427882-6aaaded0cc61?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          product_id: 2,
          imageIndex: 2,
          url: "https://plus.unsplash.com/premium_photo-1679046948909-ab47e96082e7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2tpbiUyMGNhcmV8ZW58MHx8MHx8fDA%3D",
        },
        {
          product_id: 2,
          imageIndex: 3,
          url: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2tpbiUyMGNhcmV8ZW58MHx8MHx8fDA%3D",
        },
        {
          product_id: 2,
          imageIndex: 4,
          url: "https://images.unsplash.com/photo-1552256031-811fa8f0a7b1?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNraW4lMjBjYXJlfGVufDB8fDB8fHww",
        },
      ],
    },
    {
      id: 3,
      name: "Skincare Product 3",
      description: "Another great skincare product for your daily routine.",
      price: 180000,
      originalPrice: 220000,
      quantity: 0,
      discount: 0,
      stock: 0,
      imageUrl: [
        {
          product_id: 3,
          imageIndex: 0,
          url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        },
      ],
    },
    {
      id: 4,
      name: "Skincare Product 4",
      description: "Another great skincare product for your daily routine.",
      price: 180000,
      originalPrice: 220000,
      quantity: 1,
      discount: 0,
      stock: 20,
      imageUrl: [
        {
          product_id: 4,
          imageIndex: 0,
          url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        },
      ],
    },
  ],
  setProduct: (newProduct) => set({ products: newProduct }),
}));

export default useProduct;
