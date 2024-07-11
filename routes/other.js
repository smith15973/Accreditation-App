const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');


router.route('/')
.get(isLoggedIn, (req, res) => {
    res.render('other');
});

module.exports = router;