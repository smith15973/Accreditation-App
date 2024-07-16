const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');
const { renderTIMatrix } = require('../controllers/tiMatrix');


router.route('/')
.get(renderTIMatrix);

module.exports = router;