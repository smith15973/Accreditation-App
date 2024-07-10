const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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



module.exports = mongoose.model('SegInstruction', SegInstructionSchema);