const express = require('express')
const router = express.Router();

const { pdfUpload, imageUpload, downloadZipSupportingData } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin, hasPlantAccess, validatePlant } = require('../middleware');
const { renderCreateNewPlant, createNewPlant, renderPlant, deletePlant, renderSupportingData, renderSeg, renderEditPlant, editPlant, deleteSupportingDataFiles, editProgramData, changeStatus, renderAOSR, renderConclusion } = require('../controllers/plants');
const SegProgram = require('../models/segProgram');




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
    .put(pdfUpload.array('fileInput'), editProgramData)
    .delete(deleteSupportingDataFiles)

router.route('/:plantID/seg/:segInstructionID/:programID/history')
    .get(async (req, res) => {
        const { programID } = req.params
        const program = await SegProgram.findById(programID).populate(['history.user', { path: 'seg', populate: { path: 'segInstruction' } }]);
        res.render('segs/history', { history: program.history.reverse(), program })
    })

router.route('/:plantID/seg/:segInstructionID/history/:historyID')
    .get(async (req, res) => {
        const { historyID } = req.params
        const program = await SegProgram.findOne({ 'history._id': historyID }).populate(['history.user']);
        const history = program.history.id(historyID);


        res.json(history)
    })



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