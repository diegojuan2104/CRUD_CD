const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const { getAllUsers, postUser, putUser, deleteUser, getUserById } = require('../controllers/users.controller');
router

	.get('/users', auth,  getAllUsers)

	.get('/users/:id', getUserById)

	.post('/users', postUser)

	.put('/users/:id', auth, putUser)

	.delete('/users/:id', auth, deleteUser);

module.exports = router;