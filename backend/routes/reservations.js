import express, { Router } from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, (req, res) => {
  res.json({
    message: "Reservation created",
    userId: req.user.id,
  });
});

export default Router;
