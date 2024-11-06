const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: {
        type: String, 
        required: [true, "please add your name"], // Corrected 'require' to 'required'
    },
    lastName: {
        type: String, 
        required: [true, "please add your last name"], // Corrected 'require' to 'required'
    },
    email: {
        type: String, 
        required: [true, "please add your email"], // Corrected error message
    },
    age: {
        type: Number, 
        required: [true, "please add your age"], // Corrected 'require' to 'required'
    },
    bloodGroup: {
        type: String, 
        required: [true, "please add your blood group"], // Corrected 'require' to 'required'
    },
    gender: {
        type: String, 
        required: [true, "please add your gender"], // Corrected 'require' to 'required'
    },
    phoneNumber: {
        type: Number, 
        required: [true, "please add your phone number"], // Corrected 'require' to 'required'
    },
    password: {
        type: String,
        required: [true, "please add your password"], // Corrected 'require' to 'required'
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", userSchema);
