const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { deleteFiles } = require('../utils/fileOperations');

const ArchiveSchema = new Schema({
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant'
    }
    ,
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    user: {
        type: String,
        required: true,
    },
    segs: [
        {
            segID: {
                type: String,
                required: true
            },
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
            applicableAOC: {
                type: String,
                default: 'N/A'
            },
            reviewActivity: {
                type: String,
                default: 'N/A'
            },
            dataSubmittal: {
                type: String,
                default: 'N/A'
            },
            reviewGuidance: {
                type: String,
                default: 'N/A'
            },
            programs: [
                {
                    name: {
                        type: String,
                        default: 'N/A',
                        required: true
                    },
                    supportingData: {
                        type: String,
                        default: 'N/A',
                        required: true,
                    },
                    conclusion: {
                        type: String,
                        default: 'N/A',
                        required: true,
                    },
                    aosr: {
                        type: String,
                        default: 'N/A',
                        required: true,
                    },
                    status: {
                        type: String,
                        default: 'Submitted',
                        enum: ['Incomplete', 'Uploaded', 'Reviewed', 'Approved', 'Submitted'],
                        required: true,
                    },
                    supportingDataFiles: [
                        {
                            location: {
                                type: String,
                                required: true
                            },
                            originalName: {
                                type: String,
                                required: true
                            },
                            key: {
                                type: String,
                                required: true
                            },
                            bucket: {
                                type: String,
                                required: true
                            },
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
                                type: String,
                                required: true,
                            },
                        }
                    ],
                }
            ]

        }
    ]
});


ArchiveSchema.pre('deleteMany', async function () {
    try {
        const archivesToDelete = await mongoose.model('Archive').find(this.getQuery());
        for (let archive of archivesToDelete) {
            for (let seg of archive.segs) {
                for (let program of seg.programs) {
                    const deletedFiles = program.supportingDataFiles;
                    const keys = deletedFiles.map(df => ({ Key: df.key }));
                    console.log('keys:', keys);
                    if (keys.length > 0) {
                        deleteFiles(keys);
                    }

                }
            }
        }
    } catch (e) {
        console.log('ERROR:', e)
    }
});

module.exports = mongoose.model('Archive', ArchiveSchema);