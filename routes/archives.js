const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions, isAuthorized } = require('../middleware');

router.route('/:plantID')
.get(isLoggedIn, isAuthorized, getCurrentPlantandInstructions, catchAsync(async (req, res) => {
    res.render('archives/index');
}));

module.exports = router;