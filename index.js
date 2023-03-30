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
const MailService = require("./utils/MailService");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
MailService.init();

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
Mongo.connect();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/book", bookRoutes);
app.use("/api/v1/file", fileRoutes);
app.use("/api/v1/auth/payment", paymentRoutes);

app.use(catchError);
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

const socket = require("socket.io");

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (client) => {
  const cookies = cookie.parse(client.request.headers.cookie || "");
  const accessToken = cookies["access_token"];
  console.log(accessToken);
  // handle socket events here
  client.join("room1");
  io.to("room1").emit("message", "A user has joined the room");
  client.on("disconnect", () => {
    console.log("a user disconnect");
  });
});
