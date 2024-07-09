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
        required : true,
    },
    seg_ID: {
        type: String,
        required: true,
    },
    applicableAOC: [],
    reviewActivity: [],
    dataSubmittal: [],
    reviewGuidance: [],
});



module.exports = mongoose.model('SegInstructions', SegInstructionSchema);