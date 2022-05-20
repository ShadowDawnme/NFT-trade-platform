const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const dealRoute = require("./routes/deal");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB connection successful"))
    .catch((err) => {
        console.log("DB connection failed.")
    });

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/deal", dealRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running.");
})
