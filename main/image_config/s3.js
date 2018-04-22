const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: process.env.BUCKET_NAME}
});

module.exports = s3;
