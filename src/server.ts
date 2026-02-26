import cors from "cors";
import express from "express";
import { apiRouter } from "./api/routes.js";
import { withRole } from "./api/middleware.js";

const app = express();
const port = Number(process.env.PORT ?? 8080);

app.use(cors());
app.use(express.json());
app.use(withRole);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "eprocurement-dss-ts" });
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`E-Procurement DSS API listening on ${port}`);
});
