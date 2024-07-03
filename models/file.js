const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    url: String,
    originalFilename: String,
    key: String
});

module.exports = mongoose.model('File', fileSchema);
