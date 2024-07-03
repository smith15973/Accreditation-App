const mongoose = require('mongoose');
const Plant = require('./plant');
const ProgramReviewed = require('./programReviewed');
const Schema = mongoose.Schema;

const SegSchema = new Schema({
    plant: String,
    team: String,
    seg_ID: String,
    applicableAOC: [],
    reviewActivity: [],
    dataSubmittal: [],
    reviewGuidance: [],
    programReviewed: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ProgramReviewed'
        }
    ],
    files: [
        {
            type: Schema.Types.ObjectId,
            ref: 'File'
        }
    ]
});


SegSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Plant.findOneAndUpdate({ name: doc.plant }, { $pull: { segs: doc._id } });
        for (let programReviewed of doc.programReviewed) {
            const program = await ProgramReviewed.findByIdAndDelete(programReviewed);
        }
    }
})



module.exports = mongoose.model('Seg', SegSchema);