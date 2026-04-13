import express from "express";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import errorMiddleware from "./utils/error-handler.js";
import { notFound } from "./utils/response.util.js";
import Router from "./routes/index.js";
import { connectdb } from "./config/ds.js";


const app = express();
connectdb()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(logger("tiny"));

app.use(express.json({ limit: "10mb" }));

app.set("trust proxy", true);

// handling Routes
app.use("/api/v1", Router);

//handling 404 not found
app.use((req, res) => {
  return notFound(res, {
    ip: req.ip,
    method: req.method,
    url: `${req.protocol}://${req.get("host")}${req.originalUrl} `,
  });
});

// handling errors
app.use(errorMiddleware);

export default app;
