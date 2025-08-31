import express from 'express';
import commitmentController from '../controllers/commitmentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkCommitmentOwnership from '../middlewares/commitmentMiddleware.js';

const commitmentRouter = express.Router();

commitmentRouter.post("/create", authMiddleware, commitmentController.create);

commitmentRouter.get("/:id", commitmentController.getById);
commitmentRouter.get("/", commitmentController.getAll);

commitmentRouter.put("/:id", authMiddleware, checkCommitmentOwnership, commitmentController.update);

commitmentRouter.delete("/:id", authMiddleware, checkCommitmentOwnership, commitmentController.deleteC);

export default commitmentRouter;
