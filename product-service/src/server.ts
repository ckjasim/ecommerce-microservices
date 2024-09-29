import express from "express";
import Router from "./routes/router";
import dbConnect from "./config/dbConnect";
import consumeMessages from "./util/consumeMessages";

dbConnect();
consumeMessages()


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use("/api/product-service", Router);

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
