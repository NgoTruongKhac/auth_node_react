import express from "express";
import http from "http";
import { connectDB } from "./src/database/mongodb.js";
import { PORT } from "./src/configs/env.js";
import { authRouter } from "./src/routes/auth.route.js";
import { userRouter } from "./src/routes/user.route.js";
import { conversationRouter } from "./src/routes/conversation.route.js";
import { messageRouter } from "./src/routes/message.route.js";
import { notificationRouter } from "./src/routes/notification.route.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import { SESSION_KEY, CLIENT_DOMAIN } from "./src/configs/env.js";
import { errorHandler } from "./src/middlewares/errors/error.middleware.js";
import cors from "cors";
import passport from "passport";
import "./src/configs/passport.config.js";
import { socketServer } from "./src/configs/socket.config.js";

const app = express();

const server = http.createServer(app);

connectDB();

socketServer(server);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_DOMAIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize()); // <-- Khởi tạo Passport
app.use(passport.session()); // <-- Sử dụng session với Passport

app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/notification", notificationRouter);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
