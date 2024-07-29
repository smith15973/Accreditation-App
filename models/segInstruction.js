const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Seg = require('./seg')
const SegProgram = require('./segProgram')

const SegInstructionSchema = new Schema({
    team: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    segNum: {
        type: Number,
        required: true,
    },
    segInstructionID: {
        type: String,
        required: true,
    },
    applicableAOC: [
        {
            type: String,
        }
    ],
    reviewActivity: [
        {
            type: String,
        }
    ],
    dataSubmittal: [
        {
            type: String,
        }
    ],
    reviewGuidance: [
        {
            type: String,
        }
    ],
    programs: [
        {
            type: String,
        }
    ]
});


//works
SegInstructionSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // await Seg.deleteMany({ segInstruction: doc.id });
        const segs = await Seg.find({ segInstruction: doc.id });
        for (let seg of segs) {
            await SegProgram.deleteMany({ seg: seg._id });
            await Seg.findByIdAndDelete(seg.id);
        }
    }
})



module.exports = mongoose.model('SegInstruction', SegInstructionSchema);