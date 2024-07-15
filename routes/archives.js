const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin } = require('../middleware');

router.route('/:plantID')
.get(isLoggedIn, isAdmin, getCurrentPlantandInstructions, catchAsync(async (req, res) => {
    res.render('archives/index');
}));

module.exports = router;