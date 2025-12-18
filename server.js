const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema + Model (same file)
const UserSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});

const User = mongoose.model("users", UserSchema);

// CREATE
app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

// READ
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// UPDATE
app.put("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(user);
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted" });
});

// Server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
