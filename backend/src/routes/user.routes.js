const express = require("express");
const { listUsers } = require("../controllers/user.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", listUsers);

module.exports = router;

