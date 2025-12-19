const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// npm init -y
// npm install express mongoose cors
// node server.js
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/inventorydb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});

const Item = mongoose.model("items", ItemSchema);

// ------------------ API ------------------

// CREATE
app.post("/items", async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.send(item);
});

// READ
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

// UPDATE
app.put("/items/:id", async (req, res) => {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(item);
});

// DELETE
app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.send({ message: "Deleted" });
});

// ------------------ UI ------------------
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Inventory Management</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    input { margin: 5px; }
    button { margin: 5px; }
    table { margin-top: 20px; border-collapse: collapse; }
    th, td { padding: 8px; border: 1px solid black; }
  </style>
</head>
<body>

<h2>Inventory Management</h2>

<input id="name" placeholder="Name">
<input id="qty" placeholder="Quantity">
<input id="price" placeholder="Price">
<button onclick="save()">Add / Update</button>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody id="data"></tbody>
</table>

<script>
let editId = null;

async function loadData() {
  const res = await fetch("/items");
  const data = await res.json();
  let rows = "";
  data.forEach(i => {
    rows += \`
      <tr>
        <td>\${i.name}</td>
        <td>\${i.quantity}</td>
        <td>\${i.price}</td>
        <td>
          <button onclick='edit("\${i._id}", "\${i.name}", \${i.quantity}, \${i.price})'>Edit</button>
          <button onclick='del("\${i._id}")'>Delete</button>
        </td>
      </tr>
    \`;
  });
  document.getElementById("data").innerHTML = rows;
}

async function save() {
  const payload = {
    name: document.getElementById("name").value,
    quantity: Number(document.getElementById("qty").value),
    price: Number(document.getElementById("price").value)
  };

  if (editId) {
    await fetch("/items/" + editId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    editId = null;
  } else {
    await fetch("/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  document.getElementById("name").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("price").value = "";
  loadData();
}

function edit(id, name, qty, price) {
  editId = id;
  document.getElementById("name").value = name;
  document.getElementById("qty").value = qty;
  document.getElementById("price").value = price;
}

async function del(id) {
  await fetch("/items/" + id, { method: "DELETE" });
  loadData();
}

loadData();
</script>

</body>
</html>
  `);
});

// Start server
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
