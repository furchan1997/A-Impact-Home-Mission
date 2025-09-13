import { Router } from "express";

const router = Router();

// יצירת אובייקט חדש אשר יביא את הנתונים של שאלון עוסק
router.post("/", (req, res) => {
  const { fullName, bizSize, seats, alcohol, servingFood, gas } = req.body;

  res.status(201).json({
    msg: "Questionnaire create and send.",
    fullName,
    bizSize,
    seats,
    servingFood,
    gas,
    alcohol,
  });
});

export default router;
