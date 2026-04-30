const express = require("express");
const { getCurrentUser, login, signup } = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", signup);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
