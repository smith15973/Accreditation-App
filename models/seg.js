const mongoose = require('mongoose');
const SegProgram = require('./segProgram');
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
        for (let program of doc.programs) {
            await SegProgram.findByIdAndDelete(program);
        }
    }
})



module.exports = mongoose.model('Seg', SegSchema);