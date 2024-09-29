import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  img?: string;
  createdAt: Date;
  updatedAt: Date;
  isDelete: boolean;
}

