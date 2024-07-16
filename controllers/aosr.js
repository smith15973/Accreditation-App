const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');


module.exports.renderFullAOSR = (req, res) => {
    res.render('aosr');
};
