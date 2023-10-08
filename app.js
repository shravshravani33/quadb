const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

const app = express();

app.use(bodyParser.json());

const sequelize = new Sequelize(
  "your_database_name",
  "your_username",
  "your_password",
  {
    host: "localhost",
    dialect: "mysql",̥
  }̥
);̥

// Define the Users model
const User = sequelize.define("user", {
  user_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  user_name: Sequelize.STRING,
  user_email: {
    type: Sequelize.STRING,
    unique: true,
  },
  user_password: Sequelize.STRING,
  user_image: Sequelize.STRING,
  total_orders: Sequelize.INTEGER,
  created_at: Sequelize.DATE,
  last_logged_in: Sequelize.DATE,
});

// Define API endpoints

// Fetch user details by user_id
app.get("/details/:user_id", async (req, res) => {
  try {
    const user = await User.findOne({ where: { user_id: req.params.user_id } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user details
app.put("/update", async (req, res) => {
  try {
    const updatedUser = req.body;
    const user = await User.findOne({
      where: { user_id: updatedUser.user_id },
    });
    if (user) {
      await user.update(updatedUser);
      res.json({ message: "User details updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user image by user_id
app.get("/image/:user_id", async (req, res) => {
  try {
    const user = await User.findOne({ where: { user_id: req.params.user_id } });
    if (user) {
      res.json({ user_image: user.user_image });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Insert a new user
app.post("/insert", async (req, res) => {
  try {
    const newUser = req.body.user_details;
    const user = await User.create(newUser);
    res.json({ message: "User inserted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user by user_id
app.delete("/delete/:user_id", async (req, res) => {
  try {
    const user = await User.findOne({ where: { user_id: req.params.user_id } });
    if (user) {
      await user.destroy();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the Express server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
