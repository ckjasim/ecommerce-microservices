import { Request, Response } from "express";
import ProductSchema from "../model/productModel";
import { Model } from "mongoose";
import {IProduct} from "../types/interface/IProduct";

import MessageBroker from "../util/messageBroker";
import { ProductEvent } from "../types/kafkaType";



class ProductController {
  private productModel: Model<IProduct>;
  private Kafka: MessageBroker;


  constructor() {
    this.productModel = ProductSchema;
    this.Kafka = new MessageBroker();

  }

  async createProduct(req: Request, res: Response) {
    try {
      const { name, price, description, category, stock } = req.body;
      if (!name || !price || !description || !category || !stock)
       res.status(400).json("insufficient details")
      const exist = this.productModel.findOne({ name });
      if (!exist) {
        res.status(400).json("Product already exists")
      }else{

        const product = await this.productModel.create({
          name,
          price,
          description,
          category,
          stock,
        });
        await this.Kafka.publish(
          "Product-topic",{data:product},ProductEvent.CREATE
        )
        
        res.status(200).json({
          message: "product created successfully",
          product,
        });
      }
    } catch (error) {
      console.log(error)
      res.status(400).json("internal server error")
      
    }
  }

  async getAllProduct(req: Request, res: Response) {
    try {
      const products = await this.productModel.find();
      res
        .status(200)
        .json({ message: "succesfully fetch all products", data: products });
    } catch (error) {
      console.log(error)
    }
  }
      
  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const product = await this.productModel.findOneAndUpdate(
        { _id: id },
        { isDelete: true },
        { new: true }
      );
      this.Kafka.publish(
        "Product-topic",
        { data: product },
        ProductEvent.UPDATE
      );
      if (!product) {
        this.Kafka.publish(
          "Product-topic",
          { data: product },
          ProductEvent.UPDATE
        );
        res.status(400)
        .json("there is no product on this id");
      }else{

        res
          .status(200)
          .json({ message: "product deleted succefully " });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async editProduct(req: Request, res: Response) {
    try {
      const { id, data } = req.body;
      console.log(id);
      const product = await this.productModel.findOneAndUpdate(
        { _id: id },
        data,
        { new: true }
      );
      if (!product) {
        res.status(400);
        throw new Error("product not found");
      }
      this.Kafka.publish("Product-topic",{data:product},ProductEvent.UPDATE)
      res
        .status(200)
        .json({ message: "product updated successfully", data: product });
    } catch (err) {
      console.log(err);
    }
  }
}

export default ProductController;
