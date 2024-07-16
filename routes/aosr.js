const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions } = require('../middleware');
const { renderFullAOSR } = require('../controllers/aosr');


router.route('/:plantID')
.get(isLoggedIn, getCurrentPlantandInstructions, renderFullAOSR);

module.exports = router;