import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import foodRouter from "./routes/foodRoute.js";
import userRoute from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'));
app.use("/api/user",userRoute);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.use((err, req, res, next) => {
  if (err && err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: `Multer error: ${err.code}`,
      field: err.field,
    });
  }
  next(err);
});

app.get("/", (req,res) => {
  res.send("Api Working ");
});

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB Connected Successfully.");
    app.listen(PORT, () => {
      console.log(`server is running on port:http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed.");
    console.error(
      "If you use local MongoDB, make sure the MongoDB service is running on 127.0.0.1:27017."
    );
    console.error(error.message);
  });
