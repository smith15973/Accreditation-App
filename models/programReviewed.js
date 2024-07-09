const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Seg = require('./seg');
const File = require('./file');

const ProgramReviewedSchema = new Schema({

    seg: {
        type: Schema.Types.ObjectId,
        ref: 'Seg',
        required: true,
    },
    plant: {
        type: String,
        // required: true,
    },
    group: {
        type: String,
        // required: true,
    },
    supportingData: [
        {
            type: String,
        }
    ],
    conclusion: [
        {
            type: String,
        }
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
    files: [
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

ProgramReviewedSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // Delete all files associated with this programReviewed document
        await File.deleteMany({ _id: { $in: doc.files } });
    }
});




module.exports = mongoose.model('ProgramReviewed', ProgramReviewedSchema);