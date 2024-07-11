const express = require('express')
const router = express.Router();
const Acad = require('../models/acad')
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');


router.route('/')
.get(isLoggedIn, catchAsync(async (req, res) => {
    const acads = await Acad.find({});
    res.render('acads', { acads });
}))
.post(isLoggedIn, upload.array('files'), catchAsync(async (req, res) => {
    const files = req.files.map(f => ({ 'file.location': f.location, 'file.originalName': f.originalname, 'file.key': f.key, 'file.bucket': f.bucket }));
    for (let upFile of files) {
        const acad = new Acad(upFile);
        await acad.save();
    }
    res.redirect(`/acads`);
}))
.delete(isLoggedIn, catchAsync(async (req, res) => {
    const deletedFilesIDs = req.body.deletedFiles;
    const deletedFiles = await Acad.find({ _id: { $in: deletedFilesIDs } });
    const keys = deletedFiles.map(df => ({ Key: df.file.key }));
    await Acad.deleteMany({ _id: { $in: deletedFilesIDs } });
    deleteFiles(keys);
    res.redirect(`/acads`)
}));

module.exports = router;