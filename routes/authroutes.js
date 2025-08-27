import express from "express";
import server from "../server.js";

const router = express.Router();

router.post("/register", server.register);
router.post("/login", server.login);

module.exports = router;