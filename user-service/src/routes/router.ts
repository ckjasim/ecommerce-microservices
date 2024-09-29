import express from 'express';
import UserController from '../controller/user-controller'; 

const controller = new UserController();
const Router = express.Router();

Router.route('/registerUser').post(controller.registerUser.bind(controller)); 
Router.route('/login').post(controller.login.bind(controller)); 

export default Router;
