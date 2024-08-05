const express = require('express')
const router = express.Router();


const { isLoggedIn, getCurrentPlantandInstructions, isAdmin, hasPlantAccess } = require('../middleware');
const { createArchive, renderArchive, renderArchiveIndex, renderArchiveSeg, renderArchiveProgramHistory, getHistoryDetails, getArchiveFilesToDownload } = require('../controllers/archives');
const { archiveDownloadZipSupportingData } = require('../utils/fileOperations');

router.route('/:plantID')
    .get(isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess, renderArchiveIndex)
    .post(isLoggedIn, getCurrentPlantandInstructions, isAdmin, hasPlantAccess, createArchive)

router.route('/:plantID/:archiveID')
    .get(isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess, renderArchive)

router.route('/:plantID/:archiveID/seg/:segID')
    .get(isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess, renderArchiveSeg)

router.route('/:plantID/:archiveID/seg/:segID/history/:programID')
    .get(isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess, renderArchiveProgramHistory)


router.route('/:plantID/:archiveID/seg/:segID/history/:programID/:historyID')
    .get(isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess, getHistoryDetails)

router.route('/:plantID/:archiveID/seg/:segID/download/:programID')
    .get(isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess, getArchiveFilesToDownload, archiveDownloadZipSupportingData)



module.exports = router;