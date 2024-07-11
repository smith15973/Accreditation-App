const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GeneralResourcePDF = new Schema({
    resourceType: {
        type: String,
        enum: ['ACADS', 'IERs', 'SIF/TIF', 'Power History', 'Other Resources'],
        required: true
    },
    file: {
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
});


module.exports = mongoose.model('GeneralResourcePDF', GeneralResourcePDF);