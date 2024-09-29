import express from 'express';
import ProductController from '../controller/product-controller'; 

const controller = new ProductController();
const Router = express.Router();

Router.route("/product")
  // get all product
  .get(controller.getAllProduct.bind(controller))

  // edit product
  .put(controller.editProduct.bind(controller))

  // create product
  .post(controller.createProduct.bind(controller))

  // soft delete product
  .delete(controller.deleteProduct.bind(controller));

export default Router;
