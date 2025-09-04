import express from "express";
import commitmentController from "../controllers/commitmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import checkCommitmentOwnership from "../middlewares/commitmentMiddleware.js";

const commitmentRouter = express.Router();

commitmentRouter.get("/", commitmentController.getAll);
commitmentRouter.post("/", authMiddleware, commitmentController.create);
commitmentRouter.get("/:id", authMiddleware, commitmentController.getById);

commitmentRouter.put(
  "/:id",
  authMiddleware,
  checkCommitmentOwnership,
  commitmentController.update
);
commitmentRouter.delete(
  "/:id",
  authMiddleware,
  checkCommitmentOwnership,
  commitmentController.deleteC
);

export default commitmentRouter;
