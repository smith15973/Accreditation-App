const mongoose = require('mongoose');
const SegInstruction = require('../models/segInstruction')
const Seg = require('../models/seg')
const SegProgram = require('../models/segProgram')
const Plant = require('../models/plant')
const catchAsync = require('../utils/catchAsync');



module.exports.renderCreateNewSegTemplate = (req, res) => {
    res.render('segs/new')
};

module.exports.createNewSegTeamplate = catchAsync(async (req, res) => {

    const hasSeg = await SegInstruction.findOne({ department: req.body.department, team: req.body.team, segNum: req.body.segNum });
    if (hasSeg) {
        req.flash('error', `${hasSeg.segInstructionID} already exists!`)
        return res.redirect('/seg/instruction/new')
    }

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


    return res.redirect('/')
})


module.exports.renderEditSegTemplate = catchAsync(async (req, res) => {
    const { segInstructionID } = req.params
    const segInstruction = await SegInstruction.findById(segInstructionID)

    res.render('segs/edit', { segInstruction, fromPlant: req.query.fromPlant });
})

module.exports.editSegTemplate = catchAsync(async (req, res) => {
    const { segInstructionID } = req.params
    const segInstruction = await SegInstruction.findById(segInstructionID)
    const hasSeg = await SegInstruction.findOne({ department: req.body.department, team: req.body.team, segNum: req.body.segNum });
    if (hasSeg && !hasSeg.equals(segInstruction)) {
        req.flash('error', `${hasSeg.segInstructionID} already exists!`)
        return res.redirect(`/seg/instruction/${segInstructionID}`)
    }
    
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
})


module.exports.deleteSegTemplate = catchAsync(async (req, res) => {
    const { segInstructionID } = req.params
    const segInstruction = await SegInstruction.findByIdAndDelete(segInstructionID);
    res.redirect('/')
})