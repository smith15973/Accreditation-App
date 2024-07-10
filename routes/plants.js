const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const Seg = require('../models/seg')
const SegInstruction = require('../models/segInstruction')
const Plant = require('../models/plant')
const User = require('../models/user')
const File = require('../models/file')
const DueDate = require('../models/dueDate')
const Acad = require('../models/acad')
const SegProgram = require('../models/segProgram')
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');

router.route('/new')
    .get(isLoggedIn, (req, res) => {
        res.render('plants/new');
    })
    .post(isLoggedIn, upload.single('image'), async (req, res) => {
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



router.use('/:plantID', catchAsync(async (req, res, next) => {
    const plantID = req.params.plantID;

    if (!mongoose.isValidObjectId(plantID)) {
        req.flash('error', 'Plant not Found!');
        return res.redirect('/');
    }

    const currentPlant = await Plant.findById(plantID);
    if (!currentPlant) {
        req.flash('error', 'Plant does not exist!');
        return res.redirect('/');
    }
    res.locals.currentPlant = currentPlant;
    res.locals.segInstructions = await SegInstruction.find({}).sort({segNum: 1});
    next()

}))




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
    .get(isLoggedIn, catchAsync(async (req, res) => {
        res.render('plants/edit')

    }))
    .put(isLoggedIn, upload.single('image'), catchAsync(async (req, res) => {
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

router.route('/:plant/search')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('search', { plant });
    });

router.route('/:plant/reports')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { plant } = req.params;
        const segs = (await Seg.find({ plant }).populate('programReviewed').sort({ segNum: 1 }));
        const dueDates = await DueDate.find({});
        res.render('report', { plant, segs, dueDates });
    }));

router.route('/:plant/reports/editDueDate')
    .post(isLoggedIn, catchAsync(async (req, res) => {
        const { plant } = req.params;
        let dueDate = await DueDate.findOneAndUpdate({ dateTeam: req.body.dateTeam }, req.body, { runValidators: true, new: true })
        if (!dueDate) {
            dueDate = new DueDate(req.body);
            await dueDate.save();
        };
        res.redirect(`/${plant}/reports`);
    }))

router.route('/:plant/acads')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { plant } = req.params;
        const acads = await Acad.find({});
        res.render('acads', { plant, acads });
    }))
    .post(isLoggedIn, upload.array('files'), catchAsync(async (req, res) => {
        const { plant } = req.params;
        const files = req.files.map(f => ({ 'file.location': f.location, 'file.originalName': f.originalname, 'file.key': f.key, 'file.bucket': f.bucket }));
        for (let upFile of files) {
            const acad = new Acad(upFile);
            const planti = await Plant.find({ name: plant });
            acad.plant = planti._id;
            await acad.save();
        }
        res.redirect(`/${plant}/acads`);
    }))
    .delete(isLoggedIn, catchAsync(async (req, res) => {
        const { plant } = req.params;
        const deletedFilesIDs = req.body.deletedFiles;
        const deletedFiles = await Acad.find({ _id: { $in: deletedFilesIDs } });
        const keys = deletedFiles.map(df => ({ Key: df.file.key }));
        await Acad.deleteMany({ _id: { $in: deletedFilesIDs } });
        deleteFiles(keys);
        res.redirect(`/${plant}/acads`)
    }));

router.route('/:plant/iers')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('iers', { plant });
    });

router.route('/:plant/siftif')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('siftif', { plant });
    });

router.route('/:plant/aosr')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('aosr', { plant });
    });

router.route('/:plant/powerhistory')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('powerHistory', { plant });
    });

router.route('/:plant/performanceMatrix')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('performanceMatrix', { plant });
    });

router.route('/:plant/samatrix')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('selfAssesmentMatrix', { plant });
    });

router.route('/:plant/other')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('otherResources', { plant });
    });
router.route('/:plant/archives')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('archives', { plant });
    });

router.route('/:plantID/seg/:segInstructionID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { segInstructionID, plantID } = req.params;
        const segInstruction = await SegInstruction.findById(segInstructionID);
        if (!segInstruction) {
            req.flash('error', `Seg does not exist! ${segInstructionID}`);
            return res.redirect(`/`);
        }
        let seg = await Seg.findOne({ plant: plantID, segInstruction: segInstruction._id });
        console.log('created')
        if (!seg) {
            console.log('not created')
            seg = new Seg({ plant: plantID, segInstruction: segInstruction._id });


            for (let program of segInstruction.programs) {
                const segProgram = new SegProgram({ seg: seg._id, plant: plantID, name: program });
                await segProgram.save();
                seg.segPrograms.push(segProgram);
            }
            await seg.save();
        }

        await seg.populate(['plant', 'segInstruction', 'segPrograms']);
        res.render('segs/show copy', { seg, plant: seg.plant.name })
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





    


// router.route('/:plant/:segID/supportingData/:groupID/files')
//     .post(isLoggedIn, upload.array('fileInput'), catchAsync(async (req, res) => {
//         const { plant, segID, groupID } = req.params;
//         const files = req.files.map(f => ({ location: f.location, originalName: f.originalname, key: f.key, bucket: f.bucket, seg: segID, uploadDate: Date.now() }));
//         const seg = await Seg.findById(segID);
//         const program = await ProgramReviewed.findById(groupID);
//         for (let upFile of files) {
//             const file = await new File(upFile).save();
//             program.files.push(file._id);
//             await program.save();
//         }
//         res.redirect(`/${plant}/${seg._id}/supportingData/${groupID}`);
//     }))
//     .delete(isLoggedIn, catchAsync(async (req, res) => {
//         const { plant, segID, groupID } = req.params;
//         const deletedFilesIDs = req.body.deletedFiles;
//         const deletedFiles = await File.find({ _id: { $in: deletedFilesIDs } });
//         await File.deleteMany({ _id: { $in: deletedFilesIDs } });
//         const keys = deletedFiles.map(df => ({ Key: df.key }));
//         deleteFiles(keys);

//         const seg = await Seg.findById(segID);
//         const program = await ProgramReviewed.findById(groupID);
//         program.files.pull(...deletedFilesIDs);
//         await program.save();
//         res.redirect(`/${plant}/${seg._id}/supportingData/${groupID}`);
//     }));


// router.route('/:plant/:seg_ID/conclusion/:groupID')
//     .get(isLoggedIn, catchAsync(async (req, res) => {
//         const { plant, seg_ID, groupID } = req.params;
//         const program = await ProgramReviewed.findById(groupID).populate('seg');

//         res.render('segs/programInputs/conclusion', { program, plant });
//     }))
//     .put(isLoggedIn, catchAsync(async (req, res) => {
//         const { plant, seg_ID, groupID } = req.params;
//         const program = await ProgramReviewed.findById(groupID);
//         program.conclusion = req.body.conclusion;
//         await program.save();
//         res.redirect(`/${plant}/${seg_ID}/conclusion/${groupID}`)
//     }))

// router.route('/:plant/:seg_ID/aosr/:groupID')
//     .get(isLoggedIn, catchAsync(async (req, res) => {
//         const { plant, seg_ID, groupID } = req.params;
//         const program = await ProgramReviewed.findById(groupID).populate('seg');

//         res.render('segs/programInputs/aosr', { program, plant });
//     }))
//     .put(isLoggedIn, catchAsync(async (req, res) => {
//         const { plant, seg_ID, groupID } = req.params;
//         const program = await ProgramReviewed.findById(groupID);
//         program.aosr = req.body.aosr;
//         await program.save();
//         res.redirect(`/${plant}/${seg_ID}/aosr/${groupID}`)
//     }))





// router.route('/:plant/:segID/editGroup/new')
//     .post(isLoggedIn, catchAsync(async (req, res) => {
//         const { plant, segID, groupID } = req.params;
//         req.body.plant = plant;
//         const programReviewed = new ProgramReviewed(req.body);
//         programReviewed.seg = segID;
//         await programReviewed.save();
//         const seg = await Seg.findOne({ _id: segID });
//         seg.programReviewed.push(programReviewed);
//         await seg.save();
//         res.redirect(`/${plant}/${seg.seg_ID}`);
//     }))

// router.route('/:plant/:segID/editGroup/:groupID')
//     .put(isLoggedIn, catchAsync(async (req, res) => {
//         const { plant, segID, groupID } = req.params;
//         const programReviewed = await ProgramReviewed.findByIdAndUpdate({ _id: groupID }, req.body, { runValidators: true, new: true }).populate('seg');
//         res.redirect(`/${plant}/${programReviewed.seg.seg_ID}`);

//     }))

//     .delete(isLoggedIn, catchAsync(async (req, res) => {
//         const { plant, segID, groupID } = req.params;
//         const programReviewed = await ProgramReviewed.findByIdAndDelete(groupID).populate('seg');
//         const seg = await Seg.findOne({ _id: segID });
//         seg.programReviewed.pull(programReviewed);
//         await seg.save();
//         res.redirect(`/${plant}/${programReviewed.seg.seg_ID}`);
//     }))


module.exports = router;