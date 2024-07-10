const express = require('express')
const router = express.Router();

const SegInstruction = require('../models/segInstruction')
const Plant = require('../models/plant')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');


router.route('/instruction/new')
    .get(isLoggedIn, (req, res) => {
        res.render('segs/new')
    })

    .post(isLoggedIn, catchAsync(async (req, res) => {
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


        return res.redirect(`/`);
    }))

    module.exports = router;