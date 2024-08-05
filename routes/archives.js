const express = require('express')
const router = express.Router();


const { isLoggedIn, getCurrentPlantandInstructions, isAdmin } = require('../middleware');
const { renderArchives, createArchive } = require('../controllers/archives');

router.route('/:plantID')
.get(isLoggedIn, getCurrentPlantandInstructions, renderArchives)
.post(isLoggedIn, getCurrentPlantandInstructions, isAdmin, createArchive)

module.exports = router;