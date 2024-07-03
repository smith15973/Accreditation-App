const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const ProgramReviewed = require('./programReviewed');
const Seg = require('./seg')


const PlantSchema = new Schema({
    name: String,
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    segs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Seg',
        }
    ]
});

PlantSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await User.updateMany({ _id: { $in: doc.users } }, { $pull: { plants: doc._id } });
    }
});


module.exports = mongoose.model('Plant', PlantSchema);