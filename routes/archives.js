const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin } = require('../middleware');
const { renderArchives } = require('../controllers/archives');

router.route('/:plantID')
.get(isLoggedIn, getCurrentPlantandInstructions, renderArchives);

module.exports = router;