const { S3Client, DeleteObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const archiver = require('archiver')
const { PassThrough } = require('stream');
const File = require('../models/file')
const GeneralResourcePDF = require('../models/generalResourcePDF')
const catchAsync = require('./catchAsync');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET;

const s3 = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    region
});

const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const imageFileFilter = (req, file, cb) => {
    // Check if the uploaded file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const pdfUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: Bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE || 'application/octet-stream',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    }),
    fileFilter: pdfFileFilter,
})

const imageUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: Bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE || 'application/octet-stream',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    }),
    fileFilter: imageFileFilter,
})

const deleteFiles = catchAsync(async (keys) => {
    const deleteParams = {
        Bucket,
        Delete: {
            Objects: keys
        }
    };
    await s3.send(new DeleteObjectsCommand(deleteParams));
});


const downloadZipSupportingData = catchAsync(async (req, res) => {
    const { seg } = req.query;
    const filesIDs = req.body.files;
    const files = await File.find({ _id: { $in: filesIDs } });

    if (files.length < 1) {
        const referer = req.header('Referer') || '/';
        req.flash('error', 'No files provided.')
        return res.redirect(referer)
    }

    // Set headers for the ZIP download
    res.setHeader('Content-Disposition', `attachment; filename=${seg} Supporting Data Files.zip`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip');
    archive.on('error', err => res.status(500).send({ error: err.message }));

    // Pipe the archive to the response
    archive.pipe(res);

    // Add each file to the archive
    for (let file of files) {
        const command = new GetObjectCommand({ Bucket, Key: file.key });
        const stream = new PassThrough();
        try {
            const { Body } = await s3.send(command);
            Body.pipe(stream);
            archive.append(stream, { name: file.originalName });
        } catch (err) {
            console.error(`Error retrieving image ${file.name}:`, err);
            stream.end(); // Close the stream on error to avoid hanging
        }
    }

    // Finalize the archive (indicates that no more files will be appended)
    archive.finalize();
})


const downloadZipGeneral = catchAsync(async (req, res) => {
    const { type } = req.query;
    const filesIDs = req.body.files;
    const files = await GeneralResourcePDF.find({ _id: { $in: filesIDs } });

    if (files.length < 1) {
        const referer = req.header('Referer') || '/';
        req.flash('error', 'No files provided.')
        return res.redirect(referer)
    }

    // Set headers for the ZIP download
    res.setHeader('Content-Disposition', `attachment; filename=${type} Files.zip`);
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip');
    archive.on('error', err => res.status(500).send({ error: err.message }));

    // Pipe the archive to the response
    archive.pipe(res);

    // Add each file to the archive
    for (let file of files) {
        file = file.file;
        const command = new GetObjectCommand({ Bucket, Key: file.key });
        const stream = new PassThrough();
        try {
            const { Body } = await s3.send(command);
            Body.pipe(stream);
            archive.append(stream, { name: file.originalName });
        } catch (err) {
            console.error(`Error retrieving image ${file.name}:`, err);
            stream.end(); // Close the stream on error to avoid hanging
        }
    }

    // Finalize the archive (indicates that no more files will be appended)
    archive.finalize();
})

const archiveDownloadZipSupportingData = catchAsync(async (req, res) => {
    const files = res.locals.files;

    if (files.length < 1) {
        const referer = req.header('Referer') || '/';
        req.flash('error', 'No files provided.')
        return res.redirect(referer)
    }

    // Set headers for the ZIP download
    res.setHeader('Content-Disposition', `attachment; filename=${res.locals.zipName}.zip`);
    res.setHeader('Content-Type', 'application/zip');

    const zip = archiver('zip');
    zip.on('error', err => res.status(500).send({ error: err.message }));

    // Pipe the archive to the response
    zip.pipe(res);

    // Add each file to the archive
    for (let file of files) {
        const command = new GetObjectCommand({ Bucket, Key: file.key });
        const stream = new PassThrough();
        try {
            const { Body } = await s3.send(command);
            Body.pipe(stream);
            zip.append(stream, { name: file.originalName });
        } catch (err) {
            console.error(`Error retrieving image ${file.name}:`, err);
            stream.end(); // Close the stream on error to avoid hanging
        }
    }

    // Finalize the archive (indicates that no more files will be appended)
    zip.finalize();
})

module.exports = { pdfUpload, imageUpload, deleteFiles, downloadZipSupportingData, downloadZipGeneral, archiveDownloadZipSupportingData };