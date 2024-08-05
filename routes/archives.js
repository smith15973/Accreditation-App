const express = require('express')
const router = express.Router();


const { isLoggedIn, getCurrentPlantandInstructions, isAdmin } = require('../middleware');
const { createArchive, renderArchive, renderArchiveIndex, renderArchiveSeg, renderArchiveProgramHistory, getHistoryDetails, getArchiveFilesToDownload } = require('../controllers/archives');
const { archiveDownloadZipSupportingData } = require('../utils/fileOperations');

router.route('/:plantID')
    .get(isLoggedIn, getCurrentPlantandInstructions, renderArchiveIndex)
    .post(isLoggedIn, getCurrentPlantandInstructions, isAdmin, createArchive)

router.route('/:plantID/:archiveID')
    .get(isLoggedIn, getCurrentPlantandInstructions, renderArchive)

router.route('/:plantID/:archiveID/seg/:segID')
    .get(isLoggedIn, getCurrentPlantandInstructions, renderArchiveSeg)

router.route('/:plantID/:archiveID/seg/:segID/history/:programID')
    .get(isLoggedIn, getCurrentPlantandInstructions, renderArchiveProgramHistory)


router.route('/:plantID/:archiveID/seg/:segID/history/:programID/:historyID')
    .get(isLoggedIn, getHistoryDetails)

router.route('/:plantID/:archiveID/seg/:segID/download/:programID')
    .get(isLoggedIn, getArchiveFilesToDownload, archiveDownloadZipSupportingData)



module.exports = router;