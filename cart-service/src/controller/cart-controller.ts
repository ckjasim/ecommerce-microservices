import { Request, Response } from "express";
import CartModel from "../model/cartModel";
import ProductModel from "../model/productModel";
import { AuthRequest } from "../types/api";
import MessageBroker from "../util/messageBroker";
import { CartEvent } from "../types/events";



import { Model } from "mongoose";
import ICart from "../types/interface/ICart";
import IProduct from "../types/interface/IProduct";

class CartController {
  private Kafka: MessageBroker;

  private cartModel: Model<ICart>;
  private productModel: Model<IProduct>;
  constructor() {
    this.Kafka = new MessageBroker();

    this.cartModel = CartModel;
    this.productModel = ProductModel;
  }

  async addToCart(req: AuthRequest, res: Response) {
    try {
      const { id, qty = 1 } = req.body;

      const userId = req.user;

      const updatedCart = await this.cartModel.findOneAndUpdate(
        { userId, "items.productId": id },
        {
          $set: {
            "items.$.quantity": qty,
          },
        },
        { new: true }
      );
      if (updatedCart) {
        await this.Kafka.publish("Cart-Topic",{data:updatedCart},CartEvent.UPDATE)

        return res.status(200).json({
          message: "Product quantity updated in cart",
          data: updatedCart,
        });
      } else {
        const newCart = await this.cartModel.findOneAndUpdate(
          { userId },
          {
            $push: {
              items: { productId: id, quantity: qty },
            },
          },
          { new: true, upsert: true }
        );
        await this.Kafka.publish("Cart-Topic",{data:newCart},CartEvent.UPSERT)

        return res.status(200).json({
          message: "Product added to cart",
          data: newCart,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "internal server error",
      });
    }
  }

  async getCart(req: AuthRequest, res: Response) {
    try {
      const cart = await this.cartModel.findOne({ userId: req.user }).populate("items.productId")
      return res.status(200).json({ message: "cart found", data: cart });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "internal server error",
      });
    }
  }

  async removeCart(req: AuthRequest, res: Response) {
    try {
      const {id}=req.body
      const product=await this.productModel.findById({_id:id});
      if(!product) return res.status(200).json({ message: "there is no product is availble on this id" })
      const cart = await this.cartModel.findOneAndUpdate(
        { userId: req.user },
        { $pull: { items: { productId: id } } },
        { new: true }
      );
      if(!cart) return res.status(200).json({ message: "there is no cart is availble on this id" })
        await this.Kafka.publish("Cart-Topic",{data:cart},CartEvent.UPDATE)

      return res.status(200).json({message:"product removed from cart",data:cart})
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "internal server error",
      });
    }
  }
}

export default CartController;
