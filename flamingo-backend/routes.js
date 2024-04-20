import express from 'express';

const router = express.Router();

router.get("/test",checkGameArea,(req, res) => {
    res.status(200).json({ message: "Hello world" });
  }
);

export default router;