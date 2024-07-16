const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin } = require('../middleware');

module.exports.renderArchives = catchAsync(async (req, res) => {
    res.render('archives/index');
});
