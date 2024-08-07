const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions } = require('../middleware');
const { renderTIMatrix } = require('../controllers/tiMatrix');


router.route('/:plantID')
.get(isLoggedIn, getCurrentPlantandInstructions, renderTIMatrix);

module.exports = router;