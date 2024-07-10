const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Seg = require('./seg');
const File = require('./file');

const SegProgramSchema = new Schema({

    seg: {
        type: Schema.Types.ObjectId,
        ref: 'Seg',
        required: true,
    },
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    supportingData: [
        {
            type: String,
        }
    ],
    conclusion: [
        {
            type: String,
        },
    ],
    aosr: [
        {
            type: String,
        }
    ],
    status: {
        type: String,
        default: 'Incomplete',
        enum: ['Incomplete', 'Uploaded', 'Reviewed', 'Approved', 'Submitted'],
        required: true,
    },
    supportingDataFiles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'File'
        }
    ]
});


// ProgramReviewedSchema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//         const seg = await Seg.findOneAndUpdate({ _id: doc.seg._id }, { $pull: { programReviewed: doc._id } }); 
//     }
// });

SegProgramSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // Delete all files associated with this programReviewed document
        await File.deleteMany({ _id: { $in: doc.files } });
    }
});




module.exports = mongoose.model('SegProgram', SegProgramSchema);