const catchAsync = require('../utils/catchAsync');
const Archive = require('../models/archive');
const Seg = require('../models/seg');
const SegProgram = require('../models/segProgram');
const File = require('../models/file');





module.exports.renderArchives = catchAsync(async (req, res) => {
    const { plantID } = req.params;
    const archives = await Archive.find({ plant: plantID });
    res.render('archives/index', { archives });
});


module.exports.createArchive = catchAsync(async (req, res) => {
    const { plantID } = req.params;
    const archive = new Archive(req.body.archive);
    archive.plant = plantID;
    archive.user = req.user.firstName + ' ' + req.user.lastName;
    const segs = await Seg.find({ plant: plantID }).populate(['segPrograms', 'segInstruction']);

    archive.segs = [];
    for (let seg of segs) {
        const archiveSeg = {
            segID: seg.segInstruction.segInstructionID,
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
            }

            for (let file of program.supportingDataFiles) {
                const archiveFile = {
                    location: file.location,
                    originalname: file.originalname,
                    key: file.key,
                    bucket: file.bucket,
                }
                archiveProgram.supportingDataFiles.push(archiveFile);
                await File.findByIdAndDelete(file._id);
            }
            archiveSeg.programs.push(archiveProgram);
            await SegProgram.findByIdAndDelete(program._id);
        }
        archive.segs.push(archiveSeg);
        await Seg.findByIdAndDelete(seg._id);
    }

    console.log(archive);
    await archive.save();
    res.redirect(`/archives/${plantID}`);
});
