const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dueDateSchema = new Schema({
    dateTeam: {
        type: String,
        required: true,
    },
    plant: {
        type: Schema.Types.ObjectId,
        ref: 'Plant',
    },
    Incomplete: {
        type: Date,
    },
    Uploaded: {
        type: Date,
    },
    Reviewed: {
        type: Date,
    },
    Approved: {
        type: Date,
    },
    Submitted: {
        type: Date,
    }
});

module.exports = mongoose.model('DueDate', dueDateSchema);

