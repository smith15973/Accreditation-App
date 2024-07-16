const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions } = require('../middleware');
const { renderSAMatrix } = require('../controllers/saMatrix');


router.route('/:plantID')
.get(isLoggedIn, getCurrentPlantandInstructions, renderSAMatrix);

module.exports = router;