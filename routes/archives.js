const express = require('express')
const router = express.Router();


const { isLoggedIn, getCurrentPlantandInstructions, isAdmin } = require('../middleware');
const { createArchive, renderArchive, renderArchiveIndex, renderArchiveSeg } = require('../controllers/archives');
const { archiveDownloadZipSupportingData } = require('../utils/fileOperations');

router.route('/:plantID')
    .get(isLoggedIn, getCurrentPlantandInstructions, renderArchiveIndex)
    .post(isLoggedIn, getCurrentPlantandInstructions, isAdmin, createArchive)

router.route('/:plantID/:archiveID')
    .get(isLoggedIn, getCurrentPlantandInstructions, renderArchive)

router.route('/:plantID/:archiveID/seg/:segID')
    .get(isLoggedIn, getCurrentPlantandInstructions, renderArchiveSeg)

router.route('/:plantID/:archiveID/seg/:segID/download/:programID')
    .get(isLoggedIn, archiveDownloadZipSupportingData)

module.exports = router;