const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Doctor = require("../model/doctorModel"); // Ensure the correct path to the doctor model

// Register a new doctor
const registerDoctor = asyncHandler(async (req, res) => {
    const { firstName, lastName, specialization, email, phoneNumber, password } = req.body;

    // Validate all required fields
    if (!firstName || !lastName || !specialization || !email || !phoneNumber || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    // Check if the doctor already exists
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
        return res.status(400).json({ message: "Doctor already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new doctor
    const newDoctor = await Doctor.create({
        firstName,
        lastName,
        specialization,
        email,
        phoneNumber,
        password: hashedPassword,
    });

    res.status(201).json({ message: "Doctor registered successfully", doctor: newDoctor });
});

// Get details of all doctors
const getAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find(); // Fetch all doctors from the database

    // Exclude passwords from the response
    const doctorsWithoutPasswords = doctors.map(({ password, ...doctorDetails }) => doctorDetails);

    res.status(200).json({ doctors: doctorsWithoutPasswords });
});

module.exports = { registerDoctor, getAllDoctors };
