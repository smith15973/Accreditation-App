const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
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
    seg: {
        type: Schema.Types.ObjectId,
        ref: 'Seg'
    }
});

module.exports = mongoose.model('File', fileSchema);

