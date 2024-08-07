const express = require('express')
const router = express.Router();

const { pdfUpload, imageUpload, downloadZipSupportingData } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin, hasPlantAccess, validatePlant } = require('../middleware');
const { renderCreateNewPlant, createNewPlant, renderPlant, deletePlant, renderSupportingData, renderSeg, renderEditPlant, editPlant, deleteSupportingDataFiles, changeStatus, renderAOSR, renderConclusion, getHistoryDetails, renderProgramHistory, updateHistory, uploadSupportingDataFiles } = require('../controllers/plants');




router.route('/new')
    .get(isLoggedIn, isAdmin, renderCreateNewPlant)
    .post(isLoggedIn, isAdmin, imageUpload.single('image'), validatePlant, createNewPlant)

router.use('/:plantID', isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess);

router.route('/:plantID')
    .get(renderPlant)
    .delete(deletePlant);

router.route('/:plantID/edit')
    .get(isAdmin, renderEditPlant)
    .put(isAdmin, imageUpload.single('image'), editPlant)

router.route('/:plantID/seg/:segInstructionID')
    .get(renderSeg);

/* supportingData */
router.route('/:plantID/seg/:segInstructionID/supportingData/:programID')
    .get(renderSupportingData)
    .post(downloadZipSupportingData)
    .put(pdfUpload.array('fileInput'), uploadSupportingDataFiles)
    .delete(deleteSupportingDataFiles)

router.route('/:plantID/seg/:segInstructionID/:programID/history')
    .get(isLoggedIn, renderProgramHistory)
    .post(isLoggedIn, updateHistory)

router.route('/:plantID/seg/:segInstructionID/history/:historyID')
    .get(isLoggedIn, getHistoryDetails)



/* conclusion */
router.route('/:plantID/seg/:segInstructionID/conclusion/:programID')
    .get(renderConclusion)

/* aosr */
router.route('/:plantID/seg/:segInstructionID/aosr/:programID')
    .get(renderAOSR)


module.exports = router;