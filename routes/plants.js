const express = require('express')
const router = express.Router();
const Seg = require('../models/seg')
const SegInstruction = require('../models/segInstruction')
const Plant = require('../models/plant')
const User = require('../models/user')
const File = require('../models/file')
const DueDate = require('../models/dueDate')
const Acad = require('../models/acad')
const SegProgram = require('../models/segProgram')
const catchAsync = require('../utils/catchAsync');

router.use((req, res, next) => {
    res.locals.plant = req.params.plant;
    next();
})



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
        res.redirect(`/${plant.name}`);
    })

router.route('/:plant')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { plant } = req.params;
        const currentPlant = await Plant.findOne({ name: plant }).populate('segs');
        if (!currentPlant) {
            req.flash('error', 'Plant does not exist!');
            return res.redirect('/');
        }
        res.render('plants/home', { plant, currentPlant });
    }))
    .delete(isLoggedIn, catchAsync(async (req, res) => {
        const { plant } = req.params;
        const deletedPlant = await Plant.findOneAndDelete({ name: plant });


        const segs = (await Seg.find({ _id: { $in: deletedPlant.segs } })).map(seg => seg.programReviewed);
        for (let seg of segs) {
            await ProgramReviewed.deleteMany({ _id: { $in: seg } })
        }
        await Seg.deleteMany({ _id: { $in: deletedPlant.segs } })

        res.redirect('/');
    }));

router.route('/:plant/edit')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { plant } = req.params;
        const currentPlant = await Plant.findOne({ name: plant });
        res.render('plants/edit', { plant, currentPlant })

    }))
    .put(isLoggedIn, upload.single('image'), catchAsync(async (req, res) => {
        const plant = await Plant.findOne({ name: req.params.plant });
        plant.name = req.body.name
        const file = req.file;
        if (file) {
            plant.image.location = file.location;
            plant.image.key = file.key;
            plant.image.bucket = file.bucket;
            plant.image.originalName = file.originalname
        }
        await plant.save();
        res.redirect(`/${plant.name}`);
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



router.route('/:plant/seg/new')
    .get(isLoggedIn, (req, res) => {
        const { plant } = req.params;
        res.render('segs/new', { plant })
    })

    .post(isLoggedIn, async (req, res) => {
        const { plant } = req.params;
        const segInstruction = new SegInstruction(req.body)


        let teamLetters;
        let departmentLetters;
        if (req.body.team === 'Operations') {
            teamLetters = 'OP';
        } else {
            teamLetters = 'MT';
        }
        if (req.body.department === 'Program Administration') {
            departmentLetters = 'PA';
        } else {
            departmentLetters = 'IO';
        }

        segInstruction.segInstructionID = `SEG-${teamLetters}${departmentLetters}-${req.body.segNum}`

        await segInstruction.save()

        return res.redirect(`/${plant}`);

        segInstruction.programs = [];
        if (req.body.programs) {
            for (let program of req.body.programReviewed) {
                const programReviewed = new ProgramReviewed({ group: program, plant });
                programReviewed.seg = seg._id;
                seg.programReviewed.push(programReviewed._id);
                await programReviewed.save();
            }
        }

        await seg.save();


        const plantObject = await Plant.findOne({ name: plant });
        plantObject.segs.push(seg._id);
        await plantObject.save();

        res.redirect(`/${plant}/${seg.seg_ID}`);
    })

router.route('/:plant/:segInstructionID/plant')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { segInstructionID, plant } = req.params;
        const segInstruction = await SegInstruction.findOne({ segInstructionID });
        if (!segInstruction) {
            req.flash('error', 'Seg does not exist!');
            return res.redirect(`/${plant}`);
        }
        let seg = await Seg.findOne({ plant, segInstruction: segInstruction._id });
        if (!seg) {
            seg = new Seg({ plant, segInstruction: segInstruction._id });

            for (let program of segInstruction.programs) {
                const segProgram = new SegProgram({ seg: seg._id, plant, name: program });
                await segProgram.save();
                seg.segPrograms.push(segProgram);
            }
            await seg.save();
        }

        await seg.populate('plant').populate('segInstruction').populate('segPrograms');
        console.log(seg);
        return res.send(seg);

        res.render('segs/show copy', { seg, plant: seg.plant.name })


    }))
    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { seg_ID, plant } = req.params;
        const seg = await Seg.findOneAndUpdate({ seg_ID, plant }, req.body, { runValidators: true, new: true });
        if (req.body.programReviewed) {
            const programReviewed = ProgramReviewed.findByIdAndUpdate(seg.programReviewed, req.body.programReviewed, { runValidators: true, new: true });
            seg.programReviewed.push(...req.body.programReviewed);
        }
        res.redirect(`/${plant}/${seg_ID}`);
    }))
    .delete(isLoggedIn, catchAsync(async (req, res) => {
        const { seg_ID, plant } = req.params;
        await Seg.findOneAndDelete({ seg_ID, plant });
        res.redirect(`/${plant}`);
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


router.route('/:plant/:segID/supportingData/:groupID/files')
    .post(isLoggedIn, upload.array('fileInput'), catchAsync(async (req, res) => {
        const { plant, segID, groupID } = req.params;
        const files = req.files.map(f => ({ location: f.location, originalName: f.originalname, key: f.key, bucket: f.bucket, seg: segID, uploadDate: Date.now() }));
        const seg = await Seg.findById(segID);
        const program = await ProgramReviewed.findById(groupID);
        for (let upFile of files) {
            const file = await new File(upFile).save();
            program.files.push(file._id);
            await program.save();
        }
        res.redirect(`/${plant}/${seg._id}/supportingData/${groupID}`);
    }))
    .delete(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, segID, groupID } = req.params;
        const deletedFilesIDs = req.body.deletedFiles;
        const deletedFiles = await File.find({ _id: { $in: deletedFilesIDs } });
        await File.deleteMany({ _id: { $in: deletedFilesIDs } });
        const keys = deletedFiles.map(df => ({ Key: df.key }));
        deleteFiles(keys);

        const seg = await Seg.findById(segID);
        const program = await ProgramReviewed.findById(groupID);
        program.files.pull(...deletedFilesIDs);
        await program.save();
        res.redirect(`/${plant}/${seg._id}/supportingData/${groupID}`);
    }));


router.route('/:plant/:seg_ID/conclusion/:groupID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, seg_ID, groupID } = req.params;
        const program = await ProgramReviewed.findById(groupID).populate('seg');

        res.render('segs/programInputs/conclusion', { program, plant });
    }))
    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, seg_ID, groupID } = req.params;
        const program = await ProgramReviewed.findById(groupID);
        program.conclusion = req.body.conclusion;
        await program.save();
        res.redirect(`/${plant}/${seg_ID}/conclusion/${groupID}`)
    }))

router.route('/:plant/:seg_ID/aosr/:groupID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, seg_ID, groupID } = req.params;
        const program = await ProgramReviewed.findById(groupID).populate('seg');

        res.render('segs/programInputs/aosr', { program, plant });
    }))
    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, seg_ID, groupID } = req.params;
        const program = await ProgramReviewed.findById(groupID);
        program.aosr = req.body.aosr;
        await program.save();
        res.redirect(`/${plant}/${seg_ID}/aosr/${groupID}`)
    }))





router.route('/:plant/:segID/editGroup/new')
    .post(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, segID, groupID } = req.params;
        req.body.plant = plant;
        const programReviewed = new ProgramReviewed(req.body);
        programReviewed.seg = segID;
        await programReviewed.save();
        const seg = await Seg.findOne({ _id: segID });
        seg.programReviewed.push(programReviewed);
        await seg.save();
        res.redirect(`/${plant}/${seg.seg_ID}`);
    }))

router.route('/:plant/:segID/editGroup/:groupID')
    .put(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, segID, groupID } = req.params;
        const programReviewed = await ProgramReviewed.findByIdAndUpdate({ _id: groupID }, req.body, { runValidators: true, new: true }).populate('seg');
        res.redirect(`/${plant}/${programReviewed.seg.seg_ID}`);

    }))

    .delete(isLoggedIn, catchAsync(async (req, res) => {
        const { plant, segID, groupID } = req.params;
        const programReviewed = await ProgramReviewed.findByIdAndDelete(groupID).populate('seg');
        const seg = await Seg.findOne({ _id: segID });
        seg.programReviewed.pull(programReviewed);
        await seg.save();
        res.redirect(`/${plant}/${programReviewed.seg.seg_ID}`);
    }))


module.exports = router;