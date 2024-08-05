const catchAsync = require('../utils/catchAsync');
const Archive = require('../models/archive');
const Seg = require('../models/seg');
const SegProgram = require('../models/segProgram');
const File = require('../models/file');





module.exports.renderArchiveIndex = catchAsync(async (req, res) => {
    const { plantID } = req.params;
    const archives = await Archive.find({ plant: plantID }).sort({ date: -1 });
    res.render('archives/index', { archives });
});


module.exports.createArchive = catchAsync(async (req, res) => {
    const { plantID } = req.params;
    const archive = new Archive(req.body.archive);
    archive.plant = plantID;
    archive.user = req.user.firstName + ' ' + req.user.lastName;
    const segs = await Seg.find({ plant: plantID }).populate([
        {
            path: 'segPrograms',
            populate: [
                { path: 'supportingDataFiles' },
                { path: 'history.user' }
            ]
        },
        'segInstruction'
    ]);


    archive.segs = [];
    for (let seg of segs) {
        const archiveSeg = {
            segID: seg.segInstruction.segInstructionID,
            team: seg.segInstruction.team,
            department: seg.segInstruction.department,
            segNum: seg.segInstruction.segNum,
            applicableAOC: seg.segInstruction.applicableAOC[0],
            reviewActivity: seg.segInstruction.reviewActivity[0],
            dataSubmittal: seg.segInstruction.dataSubmittal[0],
            reviewGuidance: seg.segInstruction.reviewGuidance[0],
            programs: [],
        }
        for (let program of seg.segPrograms) {
            const archiveProgram = {
                name: program.name,
                supportingData: program.supportingData[0],
                conclusion: program.conclusion[0],
                aosr: program.aosr[0],
                status: program.status,
                supportingDataFiles: [],
                history: [],
            }

            for (let file of program.supportingDataFiles) {
                const archiveFile = {
                    location: file.location,
                    originalName: file.originalName,
                    key: file.key,
                    bucket: file.bucket,
                }
                archiveProgram.supportingDataFiles.push(archiveFile);
                await File.findByIdAndDelete(file._id);
            }

            for (let history of program.history) {
                const archiveHistory = {
                    event: history.event,
                    date: history.date,
                    details: history.details,
                    user: history.user.firstName + ' ' + history.user.lastName,
                }
                archiveProgram.history.push(archiveHistory);
            }

            archiveSeg.programs.push(archiveProgram);
            await SegProgram.findByIdAndDelete(program._id);
        }
        archive.segs.push(archiveSeg);
        await Seg.findByIdAndDelete(seg._id);
    }
    await archive.save();

    res.redirect(`/archives/${plantID}`);
});

module.exports.renderArchive = catchAsync(async (req, res) => {
    const { archiveID } = req.params;
    const archive = await Archive.findById(archiveID)
    res.render('archives/segsIndex', { archive });
});

module.exports.renderArchiveSeg = catchAsync(async (req, res) => {
    const { archiveID, segID } = req.params;
    const archive = await Archive.findById(archiveID)
    const seg = archive.segs.filter(seg => seg._id.equals(segID))[0]
    res.render('archives/showSeg', { seg, archiveID });
});

module.exports.renderArchiveProgramHistory = catchAsync(async (req, res) => {
    const { archiveID, segID, programID } = req.params;
    const archive = await Archive.findById(archiveID)
    const seg = archive.segs.filter(seg => seg._id.equals(segID))[0]
    const program = seg.programs.filter(program => program._id.equals(programID))[0]
    res.render('archives/programHistory', { program, archive, seg });
});

module.exports.getHistoryDetails = catchAsync(async (req, res) => {
    const { archiveID, programID, segID, historyID } = req.params
    const archive = await Archive.findById(archiveID)
    const seg = archive.segs.filter(seg => seg._id.equals(segID))[0]
    const program = seg.programs.filter(program => program._id.equals(programID))[0]; 

    const history = program.history.id(historyID);
    console.log(history)


    res.json(history)
})


module.exports.getArchiveFilesToDownload = catchAsync(async (req,res, next) => {
    const { archiveID, segID, programID } = req.params
    const archive = await Archive.findById(archiveID);
    const seg = archive.segs.filter(seg => seg._id.equals(segID))[0];
    const program = seg.programs.filter(program => program._id.equals(programID))[0];
    const files = program.supportingDataFiles;
    res.locals.files = files;
    res.locals.zipName = `Archive ${archive.title} ${seg.segID} ${program.name} Supporting Data Files`
    next();
})