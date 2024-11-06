require('dotenv').config();
const multer = require('multer');
const upload = multer({dest: 'uploads/'}) // upload folder
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

// All users route (Assuming 'users' is defined somewhere)
app.get("/alluser", (req, res) => {
    const users = []; // Replace with actual users array
    res.render("alluser", {
        users: users, 
    });
});

// User routes
app.use("/api/register", require("./routes/userRoutes")); // Registration route
app.use("/api/login", require("./routes/userRoutes")); // Login route

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
app.post("/profile",upload.single('avatar'),function(req,res,next){
    console.log(req.body)

    console.log(req.file)

    return res.redirect("/home")
})

// Initialize 'upload' variable
// const upload = multer({ storage: storage });

// Example upload route
app.post('/upload', upload.single('myFile'), (req, res) => {
    res.send('File uploaded successfully!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
