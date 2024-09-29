import ProductModel from "../model/productModel";
import proccesData from "../service/processData";

import { IProduct } from "../types/interface/IProduct";



const consumeMessages = () => {
  proccesData<IProduct>("Order-Topic-Product", "product-group", ProductModel); //for product
};

export default consumeMessages
  