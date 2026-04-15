const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const moment = require("moment");

let items = [];

router.get("/items", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const paginated = _.chunk(items, limit)[page - 1] || [];

  res.json({
    data: paginated,
    pagination: { page, limit, total: items.length },
    requestId: uuidv4(),
  });
});

router.get("/items/:id", (req, res) => {
  const item = _.find(items, { id: req.params.id });
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json({ data: item });
});

router.post("/items", (req, res) => {
  const newItem = {
    id: uuidv4(),
    name: req.body.name || "Unnamed",
    description: req.body.description || "",
    value: req.body.value || 0,
    tags: req.body.tags || [],
    createdAt: moment().toISOString(),
  };
  items.push(newItem);
  res.status(201).json({ data: newItem });
});

router.delete("/items/:id", (req, res) => {
  const removed = _.remove(items, { id: req.params.id });
  if (removed.length === 0) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Deleted" });
});

router.get("/stats", (req, res) => {
  res.json({
    totalItems: items.length,
    totalValue: _.sumBy(items, "value"),
    averageValue: _.meanBy(items, "value") || 0,
  });
});

module.exports = router;
