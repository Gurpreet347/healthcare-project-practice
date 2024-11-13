require('dotenv').config();
const multer = require('multer');
const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");

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
app.post("/profile", upload.single('avatar'), async(req, res, next) {
    console.log(req.body); // Log form fields
    console.log(req.file); // Log file information
    return res.redirect("/home");
    
});

app.get("/home", async (req, res) => {
    try {
        // Fetch the latest profile from the database
        const profile = await Upload.findOne().sort({ _id: -1 }); // This retrieves the latest profile

        // Render the home page with the profile data
        res.render("home", {
            username: profile ? profile.username : "No Profile Found",
            avatar: profile ? profile.avatar : null
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send("Error fetching profile data.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
