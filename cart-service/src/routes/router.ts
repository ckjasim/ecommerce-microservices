import express from "express";
import CartController from "../controller/cart-controller";

const controller = new CartController();
const Router = express.Router();

Router.route("/cart")
  // get all produict in cart
  .get(controller.getCart.bind(controller))
  // upadate or addtocart
  .post(controller.addToCart.bind(controller))
  // remove cart
  .put(controller.removeCart.bind(controller));

export default Router;
