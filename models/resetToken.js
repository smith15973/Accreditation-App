const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetTokenSchema = new Schema({
    resetToken: {
        type: String,
        required: true,
    },
    user:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema);