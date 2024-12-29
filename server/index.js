import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import connectToDatabase from "./config/dbConnect.js";
import addressRouter from "./routes/address.route.js";
import brandRouter from "./routes/brand.route.js";
import cartRouter from "./routes/cart.route.js";
import catRouter from "./routes/category.route.js";
import imgRouter from "./routes/imageUpload.route.js";
import orderRouter from "./routes/order.route.js";
import productRouter from "./routes/product.route.js";
import subCatRouter from "./routes/subCategory.route.js";
import userRouter from "./routes/user.route.js";
import reviewRouter from "./routes/review.route.js";

const app = express();
dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan("combined"));
const port = process.env.PORT || 5000;

//routes call

app.use("/api/user", userRouter);
app.use("/api/category", catRouter);
app.use("/api/subcategory", subCatRouter);
app.use("/api/brand", brandRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/image", imgRouter);

//connect to database
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
