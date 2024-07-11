const express = require('express')
const router = express.Router();
const GeneralResourcePDF = require('../models/generalResourcePDF')
const catchAsync = require('../utils/catchAsync');


const { upload, deleteFiles } = require('../utils/fileOperations');
const { isLoggedIn } = require('../middleware');


router.route('/')
.get(isLoggedIn, catchAsync(async (req, res) => {
    const types = ['ACADS', 'IERs', 'SIF/TIF', 'Power History', 'Other Resources'];
    const { type } = req.query;
    if (!types.includes(type)) {
        req.flash('error', `Page does not Exist`)
        return res.redirect('/')
    }
    const resources = await GeneralResourcePDF.find({resourceType: type});
    res.render('generalResource', { resources, type });
}))
.post(isLoggedIn, upload.array('files'), catchAsync(async (req, res) => {
    const { type } = req.query;
    const files = req.files.map(f => ({ 'file.location': f.location, 'file.originalName': f.originalname, 'file.key': f.key, 'file.bucket': f.bucket }));
    for (let upFile of files) {
        const resource = new GeneralResourcePDF(upFile);
        resource.resourceType = type;
        await resource.save();
    }
    res.redirect(`/generalResources?type=${type}`);
}))
.delete(isLoggedIn, catchAsync(async (req, res) => {
    const { type } = req.query;
    const deletedFilesIDs = req.body.deletedFiles;
    const deletedFiles = await GeneralResourcePDF.find({ _id: { $in: deletedFilesIDs } });
    const keys = deletedFiles.map(df => ({ Key: df.file.key }));
    await GeneralResourcePDF.deleteMany({ _id: { $in: deletedFilesIDs } });
    deleteFiles(keys);
    res.redirect(`/generalResources?type=${type}`);
}));

module.exports = router;