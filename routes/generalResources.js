const express = require('express')
const router = express.Router();
const { upload } = require('../utils/fileOperations');
const { isLoggedIn, isAdmin } = require('../middleware');
const { renderGeneralResource, editGeneralResource, deleteGeneralResourceFile } = require('../controllers/generalResources');


router.route('/')
    .get(isLoggedIn, renderGeneralResource)
    .post(isLoggedIn, isAdmin, upload.array('files'), editGeneralResource)
    .delete(isLoggedIn, isAdmin, deleteGeneralResourceFile);

module.exports = router;