const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Seg = require('./seg');

const ProgramReviewedSchema = new Schema({

    seg: {
        type: Schema.Types.ObjectId,
        ref: 'Seg',
        required: true,
    },
    plant: {
        type: String,
        required: true,
    },
    group: {
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
    fileInput: [
        {
            url: String,
            fileName: String,
            originalName: String,
        }
    ]
});


// ProgramReviewedSchema.post('findOneAndDelete', async function (doc) {
//     if (doc) {
//         const seg = await Seg.findOneAndUpdate({ _id: doc.seg._id }, { $pull: { programReviewed: doc._id } }); 
//     }
// });




module.exports = mongoose.model('ProgramReviewed', ProgramReviewedSchema);