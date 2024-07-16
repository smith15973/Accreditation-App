const Seg = require('../models/seg')
const DueDate = require('../models/dueDate')
const catchAsync = require('../utils/catchAsync');


module.exports.renderReport = catchAsync(async (req, res) => {
    const { plantID } = req.params;
    const segs = await Seg.find({ plant: plantID }).populate(['segInstruction', 'segPrograms']);
    segs.sort((a, b) => a.segInstruction.segNum - b.segInstruction.segNum);
    const dueDates = await DueDate.find({ plant: plantID });
    res.render('reports/show', { segs, dueDates });
});


module.exports.editDueDate = catchAsync(async (req, res) => {
    const { plantID } = req.params;
    let dueDate = await DueDate.findOneAndUpdate({ dateTeam: req.body.dateTeam, plant: plantID }, req.body, { runValidators: true, new: true })
    if (!dueDate) {
        dueDate = new DueDate(req.body);
        dueDate.plant = plantID;
        await dueDate.save({ validateBeforeSave: true });
    };
    res.redirect(`/reports/${plantID}`);
})

