const express = require('express')
const router = express.Router();
const SegProgram = require('../models/segProgram')

const { upload } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin, hasPlantAccess, validatePlant } = require('../middleware');
const { renderCreateNewPlant, createNewPlant, renderPlant, deletePlant, renderSupportingData, renderSeg, renderEditPlant, editPlant, deleteSupportingDataFiles, editProgramData, changeStatus, renderAOSR, renderConclusion } = require('../controllers/plants');


router.route('/new')
    .get(isLoggedIn, isAdmin, renderCreateNewPlant)
    .post(isLoggedIn, isAdmin, upload.single('image'), validatePlant,createNewPlant)

router.use('/:plantID', isLoggedIn, getCurrentPlantandInstructions, hasPlantAccess);

router.route('/:plantID')
    .get(renderPlant)
    .delete(deletePlant);

router.route('/:plantID/edit')
    .get(isAdmin, renderEditPlant)
    .put(isAdmin, upload.single('image'), editPlant)

router.route('/:plantID/seg/:segInstructionID')
    .get(renderSeg);



/* supportingData */
router.route('/:plantID/seg/:segInstructionID/supportingData/:programID')
    .get(renderSupportingData)
    .put(upload.array('fileInput'), editProgramData)
    .delete(deleteSupportingDataFiles)

/* conclusion */
router.route('/:plantID/seg/:segInstructionID/conclusion/:programID')
    .get(renderConclusion)
    .put(editProgramData)

/* aosr */
router.route('/:plantID/seg/:segInstructionID/aosr/:programID')
    .get(renderAOSR)
    .put(editProgramData)

/* status */
router.route('/:plantID/seg/:segInstructionID/status/:programID')
    .put(changeStatus)


module.exports = router;