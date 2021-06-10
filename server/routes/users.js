const express = require('express');
const router = express.Router();

const { getUsers, postUser, putUser, deleteUser, getUser } = require('../controllers/users');
router

	.get('/users', getusers)

	.get('/users/:id', getUser)

	.post('/users', postUser)

	.put('/users/:id', putUser)

	.delete('/users/:id', deleteUser);

module.exports = router;