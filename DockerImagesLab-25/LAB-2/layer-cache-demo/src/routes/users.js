const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const moment = require('moment');
const logger = require('../utils/logger');

// In-memory store
let users = [
    {
        id: uuidv4(),
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'admin',
        createdAt: moment().subtract(30, 'days').toISOString(),
        updatedAt: moment().subtract(2, 'days').toISOString()
    },
    {
        id: uuidv4(),
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'user',
        createdAt: moment().subtract(15, 'days').toISOString(),
        updatedAt: moment().subtract(1, 'days').toISOString()
    }
];

// GET all users (with optional filtering)
router.get('/', (req, res) => {
    let result = [...users];
    const { role, sort, order } = req.query;

    if (role) {
        result = _.filter(result, { role });
    }

    if (sort) {
        result = _.orderBy(result, [sort], [order || 'asc']);
    }

    logger.info(`Fetched ${result.length} users`, { requestId: req.requestId });

    res.json({
        count: result.length,
        users: result
    });
});

// GET user by ID
router.get('/:id', (req, res) => {
    const user = _.find(users, { id: req.params.id });

    if (!user) {
        return res.status(404).json({
            error: 'User not found',
            id: req.params.id
        });
    }

    res.json(user);
});

// POST create user
router.post('/', (req, res) => {
    const { name, email, role } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: 'Validation failed',
            details: 'Name and email are required'
        });
    }

    const existingUser = _.find(users, { email });
    if (existingUser) {
        return res.status(409).json({
            error: 'Conflict',
            details: 'Email already exists'
        });
    }

    const newUser = {
        id: uuidv4(),
        name,
        email,
        role: role || 'user',
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString()
    };

    users.push(newUser);
    logger.info(`User created: ${newUser.id}`, { requestId: req.requestId });

    res.status(201).json(newUser);
});

// PUT update user
router.put('/:id', (req, res) => {
    const index = _.findIndex(users, { id: req.params.id });

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users[index] = {
        ...users[index],
        ..._.pick(req.body, ['name', 'email', 'role']),
        updatedAt: moment().toISOString()
    };

    logger.info(`User updated: ${req.params.id}`, { requestId: req.requestId });
    res.json(users[index]);
});

// DELETE user
router.delete('/:id', (req, res) => {
    const removed = _.remove(users, { id: req.params.id });

    if (removed.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`User deleted: ${req.params.id}`, { requestId: req.requestId });
    res.status(204).send();
});

module.exports = router;