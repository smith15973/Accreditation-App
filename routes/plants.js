const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const Seg = require('../models/seg')
const SegInstruction = require('../models/segInstruction')
const Plant = require('../models/plant')
const User = require('../models/user')
const File = require('../models/file')
const SegProgram = require('../models/segProgram')
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn, getCurrentPlantandInstructions, isAdmin, hasPlantAccess } = require('../middleware');

router.route('/new')
    .get(isLoggedIn, isAdmin, (req, res) => {
        res.render('plants/new');
    })
    .post(isLoggedIn, isAdmin, upload.single('image'), async (req, res) => {
        const file = req.file;
        const plant = new Plant(req.body);
        plant.image.location = file.location;
        plant.image.key = file.key;
        plant.image.bucket = file.bucket;
        plant.image.originalName = file.originalname
        plant.users.push(req.user._id);
        await plant.save();
        const user = await User.findById(req.user._id);
        user.plants.push(plant._id);
        user.save();
        res.redirect(`/plant/${plant._id}`);
    })

router.use('/:plantID', getCurrentPlantandInstructions, hasPlantAccess);

router.route('/:plantID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        res.render('plants/home');
    }))
    .delete(isLoggedIn, catchAsync(async (req, res) => {
        const { plantID } = req.params;
        const deletedPlant = await Plant.findByIdAndDelete(plantID)
        req.flash('success', `Successfully deleted plant: ${deletedPlant.name}`)
        res.redirect('/');
    }));

router.route('/:plantID/edit')
    .get(isLoggedIn, isAdmin, catchAsync(async (req, res) => {
        res.render('plants/edit')

    }))
    .put(isLoggedIn, isAdmin, upload.single('image'), catchAsync(async (req, res) => {
        const plant = await Plant.findById(req.params.plantID);
        plant.name = req.body.name
        const file = req.file;
        if (file) {
            const replacedFileKey = [{ Key: plant.image.key }]
            plant.image.location = file.location;
            plant.image.key = file.key;
            plant.image.bucket = file.bucket;
            plant.image.originalName = file.originalname
            await plant.save();
            deleteFiles(replacedFileKey)
        }
        res.redirect(`/plant/${plant._id}`);
    }))

router.route('/:plantID/seg/:segInstructionID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { segInstructionID, plantID } = req.params;
        const segInstruction = await SegInstruction.findById(segInstructionID);
        if (!segInstruction) {
            req.flash('error', `Seg does not exist! ${segInstructionID}`);
            return res.redirect(`/`);
        }
        let seg = await Seg.findOne({ plant: plantID, segInstruction: segInstruction._id });
        if (!seg) {
            seg = new Seg({ plant: plantID, segInstruction: segInstruction._id });
            for (let program of segInstruction.programs) {
                const segProgram = new SegProgram({ seg: seg._id, plant: plantID, name: program });
                await segProgram.save();
                seg.segPrograms.push(segProgram);
            }
            await seg.save();
        }

        await seg.populate(['plant', 'segInstruction', 'segPrograms']);
        res.render('segs/show', { seg, plant: seg.plant.name })
    }));

router.route('/:plant/:seg_ID/supportingData/:groupID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, seg_ID, groupID } = req.params;
        const program = await ProgramReviewed.findById(groupID).populate('seg').populate('files');

        res.render('segs/programInputs/supportingData', { program, plant });
    }))
    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, seg_ID, groupID } = req.params;
        const program = await ProgramReviewed.findById(groupID);
        program.supportingData = req.body.supportingData;
        await program.save();
        res.redirect(`/${plant}/${seg_ID}/supportingData/${groupID}`)
    }))



//****************************************************************************************************** */




router.route('/:plantID/seg/:segID/supportingData/files/:programID')
    .post(isLoggedIn, upload.array('fileInput'), catchAsync(async (req, res) => {
        const { plantID, segInstructionID, programID } = req.params;
        const files = req.files.map(f => ({ location: f.location, originalName: f.originalname, key: f.key, bucket: f.bucket, program: programID, uploadDate: Date.now() }));

        const program = await SegProgram.findById(programID);
        for (let upFile of files) {
            const file = await new File(upFile).save();
            program.supportingDataFiles.push(file._id);
            await program.save();
        }
        res.redirect(`/plant/${plantID}/seg/${segInstructionID}/supportingData/${programID}`);
    }))
    .delete(isLoggedIn, catchAsync(async (req, res) => {
        const { plantID, segInstructionID, programID } = req.params;
        const deletedFilesIDs = req.body.deletedFiles;
        const deletedFiles = await File.find({ _id: { $in: deletedFilesIDs } });
        await File.deleteMany({ _id: { $in: deletedFilesIDs } });
        const keys = deletedFiles.map(df => ({ Key: df.key }));

        const program = await SegProgram.findById(programID);
        program.supportingDataFiles.pull(...deletedFilesIDs);
        deleteFiles(keys);
        await program.save();
        res.redirect(`/plant/${plantID}/seg/${segInstructionID}/supportingData/${programID}`);
    }));

/* supportingData */
router.route('/:plantID/seg/:segInstructionID/supportingData/:programID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { programID } = req.params;
        const program = await SegProgram.findById(programID).populate(['seg', 'supportingDataFiles']).populate({ path: 'seg', populate: 'segInstruction' });

        res.render('segs/programInputs/supportingData', { program });
    }))

    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { plantID, segInstructionID, programID } = req.params;
        const program = await SegProgram.findById(programID);
        program.supportingData = req.body.supportingData;
        await program.save();
        res.redirect(`/plant/${plantID}/seg/${segInstructionID}/supportingData/${programID}`)
    }))



/* conclusion */
router.route('/:plantID/seg/:segInstructionID/conclusion/:programID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { programID } = req.params;
        const program = await SegProgram.findById(programID).populate('seg').populate({ path: 'seg', populate: 'segInstruction' });

        res.render('segs/programInputs/conclusion', { program });
    }))

    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { plantID, segInstructionID, programID } = req.params;
        const program = await SegProgram.findById(programID);
        program.conclusion = req.body.conclusion;
        await program.save();
        res.redirect(`/plant/${plantID}/seg/${segInstructionID}/conclusion/${programID}`)
    }))

/* aosr */
router.route('/:plantID/seg/:segInstructionID/aosr/:programID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { programID } = req.params;
        const program = await SegProgram.findById(programID).populate('seg').populate({ path: 'seg', populate: 'segInstruction' });

        res.render('segs/programInputs/aosr', { program });
    }))

    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { plantID, segInstructionID, programID } = req.params;
        const program = await SegProgram.findById(programID);
        program.aosr = req.body.aosr;
        await program.save();
        res.redirect(`/plant/${plantID}/seg/${segInstructionID}/aosr/${programID}`)
    }))


/* status */
router.route('/:plantID/seg/:segInstructionID/status/:programID')
    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { plantID, segInstructionID, programID } = req.params;
        const program = await SegProgram.findById(programID);
        program.status = req.body.status;
        await program.save();
        res.redirect(`/plant/${plantID}/seg/${segInstructionID}`)
    }))

module.exports = router;