const express = require('express')
const router = express.Router();
const Seg = require('../models/seg')
const Plant = require('../models/plant')
const User = require('../models/user')
const ProgramReviewed = require('../models/programReviewed')
const catchAsync = require('../utils/catchAsync');

router.use((req, res, next) => {
    res.locals.plant = req.params.plant;
    next();
})




router.route('/new')
    .get((req, res) => {
        res.render('plants/new');
    })
    .post(async (req, res) => {
        const plant = new Plant(req.body);
        plant.users.push(req.user._id);
        await plant.save();
        const user = await User.findById(req.user._id);
        user.plants.push(plant._id);
        user.save();
        res.redirect(`/${plant.name}`);
    })

router.route('/:plant')
    .get(catchAsync(async (req, res) => {
        const { plant } = req.params;
        const currentPlant = await Plant.findOne({ name: plant }).populate('segs');
        if (!currentPlant) {
            req.flash('error', 'Plant does not exist!');
            return res.redirect('/');
        }
        res.render('plants/home', { plant, currentPlant });
    }))
    .delete(catchAsync(async (req, res) => {
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
    .get((req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/reports')
    .get(catchAsync(async (req, res) => {
        const { plant } = req.params;
        const programs = await ProgramReviewed.find({ plant }).populate('seg');
        const categories = req.query.categories || 'Incomplete';
        res.render('report', { plant, programs, categories });
    }));

router.route('/:plant/acads')
    .get((req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/iers')
    .get((req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/siftif')
    .get((req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/aosr')
    .get((req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/powerhistory')
    .get((req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/performanceMatrix')
    .get((req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/samatrix')
    .get((req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/other')
    .get((req, res) => {
        const { plant, team } = req.params;
        res.render('plants/home', { plant });
    });

router.route('/:plant/schedule/:team')
    .get((req, res) => {
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
    .get((req, res) => {
        const { plant } = req.params;
        res.render('segs/new', { plant })
    })

    .post(async (req, res) => {
        const { plant } = req.params;
        const seg = new Seg(req.body) //not programReviewed;
        seg.plant = plant;

        if (Array.isArray(req.body.programReviewed)) {

            seg.programReviewed = [];
            for (let program of req.body.programReviewed) {
                const programReviewed = new ProgramReviewed({ group: program, plant });
                programReviewed.seg = seg._id;
                seg.programReviewed.push(programReviewed._id);
                await programReviewed.save();
            }
        } else {
            const programReviewed = new ProgramReviewed({ group: req.body.programReviewed, plant });
            programReviewed.seg = seg._id;
            seg.programReviewed = [programReviewed._id];
            await programReviewed.save();
        }
        await seg.save();

        const plantObject = await Plant.findOne({ name: plant });
        plantObject.segs.push(seg._id);
        await plantObject.save();

        res.redirect(`/${plant}/${seg.seg_ID}`);
    })

router.route('/:plant/:seg_ID')
    .get(catchAsync(async (req, res) => {
        const { seg_ID, plant } = req.params;
        const seg = await Seg.findOne({ seg_ID, plant }).populate('programReviewed');
        if (!seg) {
            req.flash('error', `${seg_ID} does not exist!`);
            return res.redirect(`/${plant}`);
        }
        res.render('segs/show', { seg, plant });
    }))
    .put(catchAsync(async (req, res) => {
        const { seg_ID, plant } = req.params;
        const seg = await Seg.findOneAndUpdate({ seg_ID, plant }, req.body, { runValidators: true, new: true });
        if (req.body.programReviewed) {
            const programReviewed = ProgramReviewed.findByIdAndUpdate(seg.programReviewed, req.body.programReviewed, { runValidators: true, new: true });
            seg.programReviewed.push(...req.body.programReviewed);
        }
        res.redirect(`/${plant}/${seg_ID}`);
    }))
    .delete(catchAsync(async (req, res) => {
        const { seg_ID, plant } = req.params;
        await Seg.findOneAndDelete({ seg_ID, plant });
        res.redirect(`/${plant}`);
    }));





router.route('/:plant/:segID/editGroup/new')
    .post(catchAsync(async (req, res) => {
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
    .put(catchAsync(async (req, res) => {
        const { plant, segID, groupID } = req.params;
        const programReviewed = await ProgramReviewed.findByIdAndUpdate({ _id: groupID }, req.body, { runValidators: true, new: true }).populate('seg');
        res.redirect(`/${plant}/${programReviewed.seg.seg_ID}`);

    }))

    .delete(catchAsync(async (req, res) => {
        const { plant, segID, groupID } = req.params;
        const programReviewed = await ProgramReviewed.findByIdAndDelete(groupID).populate('seg');
        const seg = await Seg.findOne({ _id: segID });
        seg.programReviewed.pull(programReviewed);
        await seg.save();
        res.redirect(`/${plant}/${programReviewed.seg.seg_ID}`);
    }))


module.exports = router;