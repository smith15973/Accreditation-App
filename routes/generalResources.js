const express = require('express')
const router = express.Router();
const { pdfUpload, downloadZipGeneral } = require('../utils/fileOperations');
const { isLoggedIn, isAdmin } = require('../middleware');
const { renderGeneralResource, editGeneralResource, deleteGeneralResourceFile } = require('../controllers/generalResources');


router.route('/')
    .get(isLoggedIn, renderGeneralResource)
    .put(downloadZipGeneral)
    .post(isLoggedIn, isAdmin, pdfUpload.array('files'), editGeneralResource)
    .delete(isLoggedIn, isAdmin, deleteGeneralResourceFile);

module.exports = router;