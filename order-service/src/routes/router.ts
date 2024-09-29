import express from 'express';
import OrderController from '../controller/orderController'; 

const controller = new OrderController();
const Router = express.Router();

Router.route('/order')
    // create order
    .post(controller.createOrder.bind(controller))

    // get all order
    .get(controller.getAllOrders.bind(controller))

    // update status of order
    .put(controller.updateOrderItemStatus.bind(controller));

// get orders by userId
Router.get('/getOrderByUser',controller.getOrderByUserId.bind(controller));

// get one specifc order with params id
Router.get('/order/:id',controller.getOrder.bind(controller));

export default Router;
