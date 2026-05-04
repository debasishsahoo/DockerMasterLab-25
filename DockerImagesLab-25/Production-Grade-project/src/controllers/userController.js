// In‑memory user store (for demonstration)
// Replace with a real database in production (PostgreSQL, MongoDB, etc.)
let users = [
  { id: 1, name: 'Debasish Sahoo', email: 'debasish.sahoo@gmail.com' },
  { id: 2, name: 'Dev', email: 'dev@example.com' }
];
let nextId = 3;

exports.getAllUsers = (req, res) => {
  res.json(users);
};

exports.getUserById = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const newUser = { id: nextId++, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  const { name, email } = req.body;
  users[userIndex] = { ...users[userIndex], name, email };
  res.json(users[userIndex]);
};

exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  users.splice(userIndex, 1);
  res.status(204).send();
};