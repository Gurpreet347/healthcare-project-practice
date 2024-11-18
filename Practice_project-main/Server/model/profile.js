const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    avatar: {
        fileName: { type: String, required: true },
        filePath: { type: String, required: true }
    }
});

module.exports = mongoose.model('profile', profileSchema);
