
const express = require('express');
const router = express.Router();
const {v4:uuidv4 }= require('uuid');
const _ = require('lodash');
const Joi = require('joi');
const config = require('../config/environment');

let items= [];

// Seed mock data in dev mode
if (config.features.mockData) {
  items= _.range(1,21).map(i => ({
    id:uuidv4(),
    name:`Mock Item ${i}`,
    description:`This is mock data item ${i} for development`,
    value: _.random(10,1000),
    category: _.sample(['A','B','C','D']),
    tags: _.sampleSize(['dev','test','mock','sample','demo'], _.random(1,3)),
    createdAt:new Date().toISOString(),
  }));
}

const itemSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).default(''),
  value: Joi.number().min(0).default(0),
  category: Joi.string().valid('A','B','C','D').default('A'),
  tags: Joi.array().items(Joi.string()).default([]),
});

router.get('/items', (req,res)=> {
  let result= [...items];

  if (req.query.category) {
    result= result.filter(i => i.category=== req.query.category);
  }
  if (req.query.search) {
    result= result.filter(i =>
      i.name.toLowerCase().includes(req.query.search.toLowerCase())
    );
  }

  const page = parseInt(req.query.page)|| 1;
  const limit = parseInt(req.query.limit)|| 10;
  const paginated = result.slice((page- 1)* limit, page* limit);

  res.json({
    data: paginated,
    pagination: { page, limit, total: result.length },
    environment: config.env,
    mockData: config.features.mockData,
  });
});

router.post('/items', (req,res)=> {
  const {error,value }= itemSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error:'Validation failed',
      details: error.details.map(d => d.message),
    });
  }

  const newItem = {
    id:uuidv4(),
    ...value,
    createdAt:new Date().toISOString(),
  };
  items.push(newItem);
  res.status(201).json({ data: newItem });
});

router.get('/stats', (req,res)=> {
  res.json({
    environment: config.env,
    totalItems: items.length,
    totalValue: _.sumBy(items,'value'),
    averageValue: Math.round(_.meanBy(items,'value')|| 0),
    byCategory: _.countBy(items,'category'),
    isMockData: config.features.mockData,
  });
});

// Debug endpoint — ONLY available in dev mode
if (config.debugMode) {
  router.get('/debug', (req,res)=> {
    res.json({
      warning:'DEBUG ENDPOINT — Only available in dev mode',
      fullConfig: config,
      processEnv: Object.keys(process.env).sort(),
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      cwd: process.cwd(),
      argv: process.argv,
      nodeVersion: process.version,
      platform: process.platform,
    });
  });

  router.delete('/debug/reset', (req,res)=> {
    const count = items.length;
    items= [];
    res.json({ message:`Reset complete. Removed ${count} items.` });
  });
}

module.exports = router;