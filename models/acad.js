const mongoose = require('mongoose');
const plant = require('./plant');
const Schema = mongoose.Schema;


const AcadSchema = new Schema({
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
    ,
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant'
    }
});


module.exports = mongoose.model('Acad', AcadSchema);