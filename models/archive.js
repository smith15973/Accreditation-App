const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
                }
            ]

        }
    ]
});


module.exports = mongoose.model('Archive', ArchiveSchema);