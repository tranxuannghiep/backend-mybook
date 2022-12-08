require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Mongo = require("./config/db");
const catchError = require("./middleware/error");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bookRoutes = require("./routes/bookRoutes");
const fileRoutes = require("./routes/fileRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const mysql_userRoutes = require("./routes/mysql/mysql_userRoutes");
const mysql_bookRoutes = require("./routes/mysql/mysql_bookRoutes");
const cookieParser = require("cookie-parser");
const MailService = require("./utils/MailService");
MailService.init();

const app = express();
app.use(cors({
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
Mongo.connect();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/book", bookRoutes);
app.use("/api/v1/file", fileRoutes);
app.use("/api/v1/auth", paymentRoutes)
app.use("/api/v1/mysql/user", mysql_userRoutes)
app.use("/api/v1/mysql/book", mysql_bookRoutes)

app.use(catchError);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
