const mongoose = require('mongoose');
const Plant = require('./plant');
const Program = require('./segProgram');
const segInstructions = require('./segInstruction');
const segProgram = require('./segProgram');
const Schema = mongoose.Schema;

const SegSchema = new Schema({
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant',
        required: true,
    },
    segInstruction: {
        type: Schema.Types.ObjectId,
        ref: 'SegInstruction',
        required: true,
    },
    segPrograms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SegProgram',
        }
    ],
    
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