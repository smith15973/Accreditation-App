const express = require('express')
const router = express.Router();
const Seg = require('../models/seg')
const DueDate = require('../models/dueDate')
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, getCurrentPlantandInstructions } = require('../middleware');

router.route('/:plantID')
    .get(isLoggedIn, getCurrentPlantandInstructions, catchAsync(async (req, res) => {
        const { plantID } = req.params;
        const segs = (await Seg.find({ plant: plantID }).populate(['segInstruction', 'segPrograms'])) //.sort({ segNum: 1 }));
        const dueDates = await DueDate.find({plant: plantID});
        res.render('reports/show', {segs, dueDates});
    }));

router.route('/:plantID/editDueDate')
    .post(isLoggedIn, getCurrentPlantandInstructions, catchAsync(async (req, res) => {
        const { plantID } = req.params;
        let dueDate = await DueDate.findOneAndUpdate({ dateTeam: req.body.dateTeam, plant: plantID }, req.body, { runValidators: true, new: true })
        if (!dueDate) {
            dueDate = new DueDate(req.body);
            dueDate.plant = plantID;
            await dueDate.save({ validateBeforeSave: true});
        };
        res.redirect(`/reports/${plantID}`);
    }))

module.exports = router;