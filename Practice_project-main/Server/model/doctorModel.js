const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please add your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please add your last name"],
    },
    specialization: {
        type: String,
        required: [true, "Please add your specialization"],
    },
    email: {
        type: String,
        required: [true, "Please add your email"],
        unique: true, // Ensure email is unique
    },
    phoneNumber: {
        type: String,
        required: [true, "Please add your phone number"],
    },
    password: {
        type: String,
        required: [true, "Please add your password"],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Doctor", doctorSchema);
