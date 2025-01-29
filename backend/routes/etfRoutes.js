import express from "express";
import { addETF, getTrackedETFs, removeETF, manualUpdate } from "../services/etfService.js";

const router = express.Router();

router.post("/track", (req, res) => {
    const { etfSymbol, threshold, period } = req.body;
    addETF(etfSymbol, threshold, period);
    res.json({ message: `Tracking started for ${etfSymbol}` });
});

router.get("/tracked", (req, res) => {
    res.json(getTrackedETFs());
});

router.post("/remove", (req, res) => {
    const { etfSymbol } = req.body;

    removeETF(etfSymbol);

    res.json({message: `Tracking removed for ${etfSymbol}`})

})

router.get("/update", async (req, res) => {
    const result = await manualUpdate();
    console.log("returning the data");
    res.json(result);
})

export default router;
