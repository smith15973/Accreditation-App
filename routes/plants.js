const express = require('express')
const router = express.Router();
const Seg = require('../models/seg')
const Plant = require('../models/plant')
const User = require('../models/user')
const File = require('../models/file')
const DueDate = require('../models/dueDate')
const ProgramReviewed = require('../models/programReviewed')
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
    .post(isLoggedIn, async (req, res) => {
        const plant = new Plant(req.body);
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
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/iers')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/siftif')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/aosr')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/powerhistory')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/performanceMatrix')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/samatrix')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/other')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/schedule/:team')
    .get(isLoggedIn, (req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });



// router.route('/:plant/:team')
//     .get((req, res) => {
//         const { plant, team } = req.params;
//         res.render('plants/home', { plant });
//     });

// router.route('/:plant/:team/:job')
//     .get((req, res) => {
//         const { plant, team } = req.params;
//         res.render('plants', { plant, team, job });
//     })

router.route('/:plant/seg/new')
    .get(isLoggedIn, (req, res) => {
        const { plant } = req.params;
        res.render('segs/new', { plant })
    })

    .post(isLoggedIn, async (req, res) => {
        const { plant } = req.params;
        const seg = new Seg(req.body)
        seg.plant = plant;
        seg.programReviewed = [];

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

        seg.seg_ID = `SEG-${teamLetters}${departmentLetters}-${req.body.segNum}`

        if (req.body.programReviewed) {
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

router.route('/:plant/:seg_ID')
    .get(isLoggedIn, catchAsync(async (req, res) => {
        const { seg_ID, plant } = req.params;
        const seg = await Seg.findOne({ seg_ID, plant }).populate('programReviewed');
        if (!seg) {
            req.flash('error', `${seg_ID} does not exist!`);
            return res.redirect(`/${plant}`);
        }
        res.render('segs/show', { seg, plant });
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