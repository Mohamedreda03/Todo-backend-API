const express = require("express");
require("dotenv").config();
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes

app.use("/api/todos", require("./routes/todo.route"));
app.use("/api/users", require("./routes/user.route"));

// Error handling middleware

app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Connect to MongoDB

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server listening on port ${process.env.PORT}`);
});
