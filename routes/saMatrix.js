const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');
const { renderSAMatrix } = require('../controllers/saMatrix');


router.route('/')
.get(isLoggedIn, renderSAMatrix);

module.exports = router;