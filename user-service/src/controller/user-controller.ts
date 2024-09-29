import { Request, Response } from "express";
import userSchema, { IUser } from "../model/userModel";
import Jwt from "../util/jwt";
import { Model } from "mongoose";
import MessageBroker from "../util/messageBroker";
import { UserEvent } from "../types/kafkaType";



class UserController {  
  private userModel: Model<IUser>;
  private Jwt: Jwt;
  private Kafka:MessageBroker;


  constructor() {
    this.userModel = userSchema;
    this.Jwt = new Jwt();
    this.Kafka=new MessageBroker();

  }

  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const userData = await this.userModel.findOne({ email });
      if (userData) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await this.userModel.create({ name, email, password });
    
      const token = this.Jwt.generateToken(user._id as string);
      await this.Kafka.publish("User-Topic",{data:user},UserEvent.CREATE)
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      return res.status(201).json({ message: "User created", user });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "An internal server error occurred"});
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userData = await this.userModel.findOne({ email });
      if (!userData) {
        return res.status(400).json({ message: "User doesnt exists" });
      } else {
        const isMatch = userData.comparePassword(password);

        if(!isMatch) {
          return res.status(400).json({ message: "Incorrect password"});
        } else {
          const token = this.Jwt.generateToken(userData._id as string); 
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: "/",
        });
          return res.status(200).json({ message: "User successfully logged in"  });
        }
      }
    } catch (error) {}
  }
}

export default UserController;
