import { Image } from "./Image";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
  imageUrl: Image[];
  stock: number;
}
