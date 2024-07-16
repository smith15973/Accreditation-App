const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');
const { renderFullAOSR } = require('../controllers/aosr');


router.route('/')
.get(isLoggedIn, renderFullAOSR);

module.exports = router;