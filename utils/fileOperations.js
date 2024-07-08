const { S3Client, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const catchAsync = require('./catchAsync');

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const bucket = process.env.S3_BUCKET;

const s3 = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    region
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE || 'application/octet-stream',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    })
})

const deleteFiles = catchAsync(async (keys) => {
    const deleteParams = {
        Bucket,
        Delete: {
            Objects: keys
        }
    };
    await s3.send(new DeleteObjectsCommand(deleteParams));
    console.log(`Successfully deleted ${keys.length} files`);
});

module.exports = {upload, deleteFiles};