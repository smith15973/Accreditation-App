const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Seg = require('./seg')
const DueDate = require('./dueDate')
const SegProgram = require('./segProgram');
const { deleteFiles } = require('../utils/fileOperations');
const Archive = require('./archive');


const PlantSchema = new Schema({
    name: String,
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    image: {
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

//works
PlantSchema.post('findOneAndDelete', async function (doc) {
    try {
        if (doc) {
            //works
            await User.updateMany({ _id: { $in: doc.users } }, { $pull: { plants: doc._id } }); //remove as plant from user
            //works
            await User.updateMany({ requestedPlants: doc._id }, { $pull: { requestedPlants: doc._id } }); //remove as requested plant from users
            //works
            await Seg.deleteMany({ plant: doc._id })
            //works
            await DueDate.deleteMany({ plant: doc._id })
            //works
            await SegProgram.deleteMany({ plant: doc._id })

            //works
            await Archive.deleteMany({ plant: doc._id })

            //works
            keys = [{ Key: doc.image.key }]
            if (keys.length > 0) {
                deleteFiles(keys)
            }
        }
    } catch (e) {
        console.log('ERROR:', e)
    }
});


module.exports = mongoose.model('Plant', PlantSchema);