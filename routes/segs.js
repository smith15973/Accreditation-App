const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

const SegInstruction = require('../models/segInstruction')
const Seg = require('../models/seg')
const SegProgram = require('../models/segProgram')
const Plant = require('../models/plant')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin } = require('../middleware');


router.route('/instruction/new')
    .get(isLoggedIn, isAdmin, (req, res) => {
        res.render('segs/new')
    })

    .post(isLoggedIn, isAdmin, catchAsync(async (req, res) => {
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


router.route('/instruction/:segInstructionID')
    .get(isLoggedIn, isAdmin, catchAsync(async (req, res) => {
        const { segInstructionID } = req.params
        const segInstruction = await SegInstruction.findById(segInstructionID)

        res.render('segs/edit', { segInstruction, fromPlant: req.query.fromPlant });
    }))
    .put(isLoggedIn, isAdmin, catchAsync(async (req, res) => {
        const { segInstructionID } = req.params
        const segInstruction = await SegInstruction.findById(segInstructionID)
        segInstruction.set(req.body)
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

        //remove programs that are not in the new list
        const segs = await Seg.find({ segInstruction: segInstructionID }).populate('segPrograms')
        for (let seg of segs) {
            for (let segProgram of seg.segPrograms) {
                if (req.body.programs && req.body.programs.includes(segProgram.name)) {

                } else {
                    await SegProgram.findByIdAndDelete(segProgram._id);
                    seg.segPrograms = await seg.segPrograms.filter(program => !program.equals(segProgram));
                }
            }
            if (req.body.programs) { //if it exists
                if (!Array.isArray(req.body.programs)) { //if it's not an array
                    req.body.programs = [req.body.programs] //make it an array
                }
                for (let newProgram of req.body.programs) { //for each program in the new list
                    if (!seg.segPrograms.map(program => program.name).includes(newProgram)) { //if the program is not in the old list
                        const program = new SegProgram({ name: newProgram, plant: seg.plant, seg: seg._id })
                        await program.save()
                        seg.segPrograms.push(program)
                    }
                }
            }

            await seg.save()
        }

        await segInstruction.save()



        const fromPlant = req.query.fromPlant
        if (mongoose.isValidObjectId(fromPlant)) {
            const plant = await Plant.findById(fromPlant)
            if (plant) {
                return res.redirect(`/plant/${plant._id}/seg/${segInstructionID}`)
            }
        }
        res.redirect('/')
    }))

module.exports = router;