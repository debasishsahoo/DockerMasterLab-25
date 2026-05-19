const express = require("express");
const router = express.Router();

let items = [
  { id: 1, name: "Learn Docker", completed: false },
  { id: 2, name: "Learn Docker Compose", completed: true },
  { id: 3, name: "Deploy Application", completed: false },
];

router.get("/items", (req, res) => {
  res.json({
    success: true,
    data: items,
    count: items.length,
  });
});

router.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({
      success: false,
      error: "Item not found",
    });
  }
  res.json({ success: true, data: item });
});

router.post("/items", (req, res) => {
  const newItem = {
    id: items.length + 1,
    name: req.body.name,
    completed: false,
  };
  items.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

router.put("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Item not found",
    });
  }
  items[index] = { ...items[index], ...req.body };
  res.json({ success: true, data: items[index] });
});

router.delete("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Item not found",
    });
  }
  items.splice(index, 1);
  res.json({ success: true, message: "Item deleted" });
});

module.exports = router;
