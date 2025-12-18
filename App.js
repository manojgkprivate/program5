import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });
  const [editId, setEditId] = useState(null);

  // Fetch data
  const loadData = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add / Update
  const saveData = async () => {
    if (editId) {
      await fetch(`http://localhost:5000/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setEditId(null);
    } else {
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    }
    setForm({ name: "", quantity: "", price: "" });
    loadData();
  };

  // Delete
  const deleteData = async (id) => {
    await fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE"
    });
    loadData();
  };

  // Edit
  const editData = (u) => {
    setForm(u);
    setEditId(u._id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Inventory Management</h2>

      <input placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} />

      <input placeholder="Quantity"
        value={form.quantity}
        onChange={e => setForm({ ...form, quantity: e.target.value })} />

      <input placeholder="Price"
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })} />

      <button onClick={saveData}>
        {editId ? "Update" : "Add"}
      </button>

      <table border="1" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.quantity}</td>
              <td>{u.price}</td>
              <td>
                <button onClick={() => editData(u)}>Edit</button>
                <button onClick={() => deleteData(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
