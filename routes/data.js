// @ts-check
const express = require('express');
const db = require('../controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
  db.getUsers((data) => {
    res.send(data);
  });
});

module.exports = router;
