import { Router } from "express";
import { matchRules } from "../matchRules.js";

const router = Router();

// יצירת אובייקט חדש אשר יביא את הנתונים של שאלון עוסק
router.post("/", (req, res) => {
  const { fullName, bizSize, seats, alcohol, servingFood, gas } = req.body;
  const matchedRules = matchRules({ seats, alcohol, servingFood, gas });

  res.status(201).json({
    msg: "Questionnaire create and send.",
    fullName,
    bizSize,
    seats,
    servingFood,
    gas,
    alcohol,
    matchedRules,
  });
});

export default router;
