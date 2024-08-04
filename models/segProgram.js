const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const File = require('./file');
const { deleteFiles } = require('../utils/fileOperations');

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
    ],
    history: [
        {
            event: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
            details: {
                type: String,
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        }
    ],
});



SegProgramSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await File.deleteMany({ program: doc._id });
    }
});

SegProgramSchema.pre('deleteMany', async function () {
    const docsToDelete = await mongoose.model('SegProgram').find(this.getQuery()).populate('supportingDataFiles');

    const filesToDelete = docsToDelete.map(doc => doc.supportingDataFiles).flat();

    //get the files
    const deletedFiles = await File.find({ _id: { $in: filesToDelete } });

    //delete the files
    await File.deleteMany({ _id: { $in: filesToDelete } });

    //get the keys for the files
    const keys = deletedFiles.map(df => ({ Key: df.key }));

    //delete the files from s3
    if (keys.length > 0) {
        deleteFiles(keys);
    }

});






module.exports = mongoose.model('SegProgram', SegProgramSchema);