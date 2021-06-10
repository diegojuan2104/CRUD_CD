const express = require('express');
const router = express.Router();
const { getRoles, getDocumentTypes  } = require('../controllers/data.controller');


router 
.get("/roles", getRoles)
.get("/doc_types", getDocumentTypes)

module.exports = router;