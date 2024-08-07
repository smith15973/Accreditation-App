const Seg = require('../models/seg')
const SegInstruction = require('../models/segInstruction')
const Plant = require('../models/plant')
const User = require('../models/user')
const File = require('../models/file')
const SegProgram = require('../models/segProgram')
const catchAsync = require('../utils/catchAsync');


const { deleteFiles } = require('../utils/fileOperations');


module.exports.renderCreateNewPlant = (req, res) => {
    res.render('plants/new');
}
module.exports.createNewPlant = catchAsync(async (req, res) => {
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
    await user.save();
    res.redirect(`/plant/${plant._id}`);
})


module.exports.renderPlant = catchAsync(async (req, res) => {
    const users = await User.find({ requestedPlants: req.params.plantID })
    res.render('plants/home', { requests: users.length });
})

module.exports.renderEditPlant = (req, res) => {
    res.render('plants/edit')
}

module.exports.editPlant = catchAsync(async (req, res) => {
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
})

module.exports.deletePlant = catchAsync(async (req, res) => {
    const { plantID } = req.params;
    const plant = await Plant.findByIdAndDelete(plantID);
    req.flash('success', `Successfully deleted plant: ${plant.name}`)
    res.redirect(`/`);
})

module.exports.renderSeg = catchAsync(async (req, res) => {
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

    //get the next and previous segs for navigation
    const number = seg.segInstruction.segNum;
    const segID = seg.segInstruction.segInstructionID.slice(0, 9);

    let previousSeg = await SegInstruction.findOne({ segInstructionID: segID + (number - 1) });
    let nextSeg = await SegInstruction.findOne({ segInstructionID: segID + (number + 1) });

    if (!previousSeg) {
        previousSeg = await SegInstruction.findOne({ team: seg.segInstruction.team, department: seg.segInstruction.department }).sort({ segNum: -1 });
    }
    if (!nextSeg) {
        nextSeg = await SegInstruction.findOne({ team: seg.segInstruction.team, department: seg.segInstruction.department }).sort({ segNum: 1 });
    }
    res.render('segs/show', { seg, plant: seg.plant.name, previousSeg, nextSeg });
});




/* supportingData */
module.exports.renderSupportingData = catchAsync(async (req, res) => {
    const { programID } = req.params;
    const program = await SegProgram.findById(programID).populate(['seg', 'supportingDataFiles']).populate({ path: 'seg', populate: 'segInstruction' });

    res.render('segs/programInputs/supportingData', { program });
})

module.exports.uploadSupportingDataFiles = catchAsync(async (req, res) => {
    const { programID } = req.params;
    const program = await SegProgram.findById(programID);
    
    
    if (typeof req.files !== 'undefined' && req.files.length > 0) {
        const files = req.files.map(f => ({ location: f.location, originalName: f.originalname, key: f.key, bucket: f.bucket, program: programID, uploadDate: Date.now() }));

        let event = `${files.length} files uploaded to Supporting Data`
        if (files.length === 1) {
            event = `1 file uploaded to Supporting Data`
        }

        const history = {
            event,
            date: Date.now(),
            details: files.map(f => f.originalName).join(', '),
            user: req.user._id
        }
        program.history.push(history);

        for (let upFile of files) {
            const file = await new File(upFile).save();
            program.supportingDataFiles.push(file._id);
        }
    }
    await program.save()
    await program.populate('supportingDataFiles');
    return res.json({ admin: req.user.admin, program });
})



module.exports.deleteSupportingDataFiles = catchAsync(async (req, res) => {
    const { plantID, segInstructionID, programID } = req.params;
    const deletedFilesIDs = req.body.files;
    const deletedFiles = await File.find({ _id: { $in: deletedFilesIDs } });
    await File.deleteMany({ _id: { $in: deletedFilesIDs } });
    const keys = deletedFiles.map(df => ({ Key: df.key }));

    const program = await SegProgram.findById(programID);
    program.supportingDataFiles.pull(...deletedFilesIDs);
    deleteFiles(keys);

    const history = {
        event: `${deletedFiles.length} files deleted from Supporting Data`,
        date: Date.now(),
        details: deletedFiles.map(f => f.originalName).join(','),
        user: req.user._id
    }
    program.history.push(history);
    await program.save();
    res.redirect(`/plant/${plantID}/seg/${segInstructionID}/supportingData/${programID}`);
});



/* conclusion */
module.exports.renderConclusion = catchAsync(async (req, res) => {
    const { programID } = req.params;
    const program = await SegProgram.findById(programID).populate('seg').populate({ path: 'seg', populate: 'segInstruction' });

    res.render('segs/programInputs/conclusion', { program });
})

/* aosr */
module.exports.renderAOSR = catchAsync(async (req, res) => {
    const { programID } = req.params;
    const program = await SegProgram.findById(programID).populate('seg').populate({ path: 'seg', populate: 'segInstruction' });

    res.render('segs/programInputs/aosr', { program });
})


/* status */
module.exports.changeStatus = catchAsync(async (req, res) => {
    console.log(programID)
    const { plantID, segInstructionID, programID } = req.params;
    const program = await SegProgram.findById(programID);
    program.status = req.body.status;
    await program.save();
    res.redirect(`/plant/${plantID}/seg/${segInstructionID}`)
})


module.exports.renderProgramHistory = catchAsync(async (req, res) => {
    const { programID } = req.params
    const program = await SegProgram.findById(programID).populate(['history.user', { path: 'seg', populate: { path: 'segInstruction' } }]);
    res.render('segs/history', { history: program.history.reverse(), program })
})

module.exports.getHistoryDetails = catchAsync(async (req, res) => {
    const { historyID } = req.params
    const program = await SegProgram.findOne({ 'history._id': historyID }).populate(['history.user']);
    const history = program.history.id(historyID);
    res.json(history)
})

module.exports.updateHistory = catchAsync(async (req, res) => {
    console.log('updating history')
    const { programID } = req.params;
    const program = await SegProgram.findById(programID);
    const currentSupportingData = program.supportingData[0];
    const oldSupportingData = program.previousSupportingData;
    const currentConclusion = program.conclusion[0];
    const oldConclusion = program.previousConclusion;
    const currentAOSR = program.aosr[0];
    const oldAOSR = program.previousAOSR;
    if (req.body.page === 'supportingData' && (typeof oldSupportingData === 'undefined' && typeof currentSupportingData !== 'undefined') || (typeof oldSupportingData !== 'undefined' && oldSupportingData !== currentSupportingData)) {
        console.log('in supporting data', currentSupportingData)
        const history = {
            event: 'Supporting Data Updated',
            date: Date.now(),
            details: currentSupportingData,
            user: req.user._id
        }
        program.history.push(history);
        program.previousSupportingData = currentSupportingData;
    }
    if (req.body.page === 'conclusion' && (typeof oldConclusion === 'undefined' && typeof currentConclusion !== 'undefined') || (typeof oldConclusion !== 'undefined' && oldConclusion !== currentConclusion)) {
        const history = {
            event: 'Conclusion Updated',
            date: Date.now(),
            details: currentConclusion,
            user: req.user._id
        }
        program.history.push(history);
        program.previousConclusion = currentConclusion;
    }
    if (req.body.page === 'aosr' && (typeof oldAOSR === 'undefined' && typeof currentAOSR !== 'undefined') || (typeof oldAOSR !== 'undefined' && oldAOSR !== currentAOSR)) {
        console.log('in aosr', )
        const history = {
            event: 'AOSR Updated',
            date: Date.now(),
            details: currentAOSR,
            user: req.user._id
        }
        program.history.push(history);
        program.previousAOSR = currentAOSR;
    }
    await program.save();
    res.json('History Updated');
})