import React, { useState, useEffect } from "react";
import axios from "axios";
import HealthCheck from "./components/HealthCheck";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "/api";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/items`);
      setItems(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch items");
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/items`, {
        name: newItem,
      });
      setItems([...items, response.data.data]);
      setNewItem("");
    } catch (err) {
      setError("Failed to add item");
    }
  };

  const toggleItem = async (id) => {
    const item = items.find((i) => i.id === id);
    try {
      await axios.put(`${API_URL}/items/${id}`, {
        completed: !item.completed,
      });
      setItems(
        items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i)),
      );
    } catch (err) {
      setError("Failed to update item");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🐳 Docker Teaching Application</h1>
        <p>Learn Docker Compose with Node.js and React</p>
      </header>

      <main className="container">
        <HealthCheck />

        <section className="todo-section">
          <h2>📝 Learning Tasks</h2>

          <form onSubmit={addItem} className="add-item-form">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add a new learning task..."
              className="input-field"
            />
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <ul className="item-list">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`item ${item.completed ? "completed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span className="item-name">{item.name}</span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
