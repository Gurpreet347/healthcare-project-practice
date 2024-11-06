const express = require("express");
const router = express.Router();
const { registerDoctor, getAllDoctors } = require("../controllers/doctorController");

// Route to register a new doctor
router.post("/register", registerDoctor);

// Route to get all doctors
router.get("/", getAllDoctors); // This route fetches all doctor details

module.exports = router;
