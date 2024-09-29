import express from "express";
import Router from "./routes/router";
import dbConnect from "./config/dbConnect";

dbConnect();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use("/api/user-service", Router);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
