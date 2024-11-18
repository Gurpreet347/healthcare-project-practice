require('dotenv').config();
const multer = require('multer');
const Upload = multer({ dest: 'uploads/' });
const Profile = require('./model/profile'); // Import your Profile model
const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
// const user = require('./views/users');

dotenv.config();
connectDb(); // Connect to the database
const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); // Ensure this points to the right directory

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Working');
});

// Register Handlebars partials
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Home route
app.get("/home", (req, res) => {
    res.render("home", {
        username: "Guri",
        posts: "time pass"
    });
});

// All users route
app.get("/alluser", (req, res) => {
    const users = []; // Replace with actual users array
    res.render("alluser", {
        users: users, 
    });
});

// User routes
// app.use("/api/register", require("./routes/userRoutes")); // Registration route
app.use("/api", require("./routes/userRoutes")); // Login route

// Error handling middleware
app.use(errorHandler); // Use your error handler middleware

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Make sure the 'uploads' directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Corrected random number generation
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// Initialize 'upload' variable with the correct configuration
const upload = multer({ storage: storage });

// Upload route for single file upload
app.post('/upload', upload.single('myFile'), (req, res) => {
    console.log(req.file); // Log the uploaded file details
    res.send('File uploaded successfully!');
});

// Profile route for avatar upload
app.post("/profile", upload.single('avatar'), async (req, res, next) => {
    try {
        const profileData = {
            avatar: {
                fileName: req.file.filename,
                filePath: req.file.path
            }
        };

        const newProfile = new Profile(profileData);
        await newProfile.save();

        console.log("Profile saved:", newProfile);
        res.redirect("/home");
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).send("Error saving profile.");
    }
});


app.get("/home", async (req, res) => {
    try {
        const profile = await Profile.findOne().sort({ _id: -1 }); // Use Profile model

        res.render("home", {
            username: profile ? "User" : "No Profile Found", // Adjust if needed
            avatar: profile ? profile.avatar.filePath : null
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send("Error fetching profile data.");
    }
});


app.get("/getPhotos", async (req, res) => {
    try {
        // Assuming Upload is a model for your database
        const uploads = await Upload.find(); // Fetch all uploaded photos from the database
        res.render("users", { uploads }); // Pass the photos to the template

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching photos");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
