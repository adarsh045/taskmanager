const express = require("express");
const { getOverview } = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/overview", requireAuth, getOverview);

module.exports = router;

