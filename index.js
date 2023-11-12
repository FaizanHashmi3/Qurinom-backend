require("dotenv").config();
const express = require("express");
const cors = require('cors');

const db = require("./config/db");
const vendorRoutes = require("./routes/Vendor");
const userRoutes = require("./routes/User");
const productRoutes = require("./routes/Product");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/vendor", vendorRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);

app.listen(PORT, () => console.log(`server started at port`, PORT));