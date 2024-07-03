const { formidable } = require('formidable');
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Transform } = require('stream');
const catchAsync = require('./catchAsync');
const file = require('../models/file');




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



const uploadFile = catchAsync(async (req) => {
    return new Promise((resolve, reject) => {
        let options = {
            maxFileSize: 100 * 1024 * 1024, //100 megabytes converted to bytes,
            allowEmptyFiles: false,
        }

        const form = formidable(options);
        // method accepts the request and a callback.
        form.parse(req, (err, fields, files) => {

        });

        form.on('error', error => {
            reject(error.message)
        })

        form.on('data', (data) => {
            if (data.name === "complete") {
                const metadata = data.value['$metadata'];
                const httpStatusCode = metadata.httpStatusCode || 200;
                const fileDetails = {
                    statusCode: httpStatusCode,
                    location: data.value.Location,
                    key: data.value.Key,
                    bucket: data.value.Bucket,
                    // other metadata if needed
                };
                resolve(fileDetails);
            }
        })

        form.on('fileBegin', (formName, file) => {

            file.open = async function () {
                this._writeStream = new Transform({
                    transform(chunk, encoding, callback) {
                        callback(null, chunk)
                    }
                })

                this._writeStream.on('error', e => {
                    form.emit('error', e)
                });

                // upload to S3
                await new Upload({
                    client: s3,
                    params: {
                        Bucket,
                        Key: `${Date.now().toString()}-${this.originalFilename}`,
                        Body: this._writeStream,
                        //ContentType: mime.getType('pdf') /*|| 'application/octet-stream'*/ //set the correct MIME type

                    },
                    tags: [], // optional tags
                    queueSize: 4, // optional concurrency configuration
                    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
                    leavePartsOnError: false, // optional manually handle dropped parts
                })
                    .done()
                    .then(data => {
                        form.emit('data', { name: "complete", value: data });
                    }).catch((err) => {
                        form.emit('error', err);
                    })
            }
            
            file.end = function (cb) {
                this._writeStream.on('finish', () => {
                    this.emit('end')
                    cb()
                })
                this._writeStream.end()
            }
        })
    })
});

const deleteFile = catchAsync(async (key) => {
    const deleteParams = {
        Bucket,
        Key: key
    };
    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log(`Successfully deleted file ${key}`);
});

module.exports = { uploadFile, deleteFile };
