const express = require('express')
const router = express.Router();


const { upload } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin, hasPlantAccess } = require('../middleware');
const { renderCreateNewPlant, createNewPlant, renderPlant, deletePlant, renderSupportingData, renderSeg, renderEditPlant, editPlant, deleteSupportingDataFiles, editSupportingData, changeStatus, renderAOSR, editAOSR, editConclusion, renderConclusion } = require('../controllers/plants');

router.route('/new')
    .get(isLoggedIn, isAdmin, renderCreateNewPlant)
    .post(isLoggedIn, isAdmin, upload.single('image'), createNewPlant)

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
    .put(upload.array('fileInput'), editSupportingData)
    .delete(deleteSupportingDataFiles)



/* conclusion */
router.route('/:plantID/seg/:segInstructionID/conclusion/:programID')
    .get(renderConclusion)
    .put(editConclusion)

/* aosr */
router.route('/:plantID/seg/:segInstructionID/aosr/:programID')
    .get(renderAOSR)
    .put(editAOSR)

/* status */
router.route('/:plantID/seg/:segInstructionID/status/:programID')
    .put(changeStatus)


module.exports = router;