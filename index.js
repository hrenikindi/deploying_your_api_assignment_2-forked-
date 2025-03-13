const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('static'));

// Handle admin and user access with middleware
const checkAdmin = (req, res, next) => {
  const isAdmin = process.env.is_Admin === 'true';
  if (isAdmin) {
    console.log("Admin privileges granted.");
    req.isAdmin = true;
  } else {
    console.log("Access restricted. Admin only.");
    req.isAdmin = false;
  }
  next();
};

app.use(checkAdmin);

// Route to handle admin/user message
app.get('/api/data', (req, res) => {
  if (req.isAdmin) {
    res.json({ message: "Welcome, Admin!", data: ["Admin Data 1", "Admin Data 2"] });
  } else {
    res.json({ message: "Welcome, User!", data: ["User Data 1", "User Data 2"] });
  }
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});