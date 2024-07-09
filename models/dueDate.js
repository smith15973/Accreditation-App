const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dueDateSchema = new Schema({
    dateTeam: {
        type: String,
        required: true,
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

