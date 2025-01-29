import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import etfRoutes from "./routes/etfRoutes.js";
import { startScheduler } from "./services/etfService.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/etf", etfRoutes);

// Start ETF price monitoring
startScheduler();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
