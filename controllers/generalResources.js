
const GeneralResourcePDF = require('../models/generalResourcePDF')
const catchAsync = require('../utils/catchAsync');
const { deleteFiles } = require('../utils/fileOperations');

module.exports.renderGeneralResource = catchAsync(async (req, res) => {
    const types = ['ACADS', 'IERs', 'SIF/TIF', 'Power History', 'Other Resources'];
    const { type } = req.query;
    if (!types.includes(type)) {
        req.flash('error', `Page does not Exist`)
        const redirectUrl = req.get('referer') || '/';
        return res.redirect(redirectUrl);
    }
    const resources = await GeneralResourcePDF.find({ resourceType: type });
    res.render('generalResource', { resources, type });
})
module.exports.editGeneralResource = catchAsync(async (req, res) => {
    const types = ['ACADS', 'IERs', 'SIF/TIF', 'Power History', 'Other Resources'];
    const { type } = req.query;
    if (!types.includes(type)) {
        req.flash('error', `Page does not Exist`)
        const redirectUrl = req.get('referer') || '/';
        return res.redirect(redirectUrl);
    }
    const files = req.files.map(f => ({ 'file.location': f.location, 'file.originalName': f.originalname, 'file.key': f.key, 'file.bucket': f.bucket }));
    for (let upFile of files) {
        const resource = new GeneralResourcePDF(upFile);
        resource.resourceType = type;
        await resource.save();
    }
    res.redirect(`/generalResources?type=${type}`);
})
module.exports.deleteGeneralResourceFile = catchAsync(async (req, res) => {
    const types = ['ACADS', 'IERs', 'SIF/TIF', 'Power History', 'Other Resources'];
    const { type } = req.query;
    if (!types.includes(type)) {
        req.flash('error', `Page does not Exist`)
        const redirectUrl = req.get('referer') || '/';
        return res.redirect(redirectUrl);
    }
    const deletedFilesIDs = req.body.files;
    const deletedFiles = await GeneralResourcePDF.find({ _id: { $in: deletedFilesIDs } });
    const keys = deletedFiles.map(df => ({ Key: df.file.key }));
    await GeneralResourcePDF.deleteMany({ _id: { $in: deletedFilesIDs } });
    if (keys.length > 0) {
        deleteFiles(keys);
    }
    res.redirect(`/generalResources?type=${type}`);
})
