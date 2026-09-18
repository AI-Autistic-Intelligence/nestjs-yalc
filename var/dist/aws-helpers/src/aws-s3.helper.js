"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileFromS3 = void 0;
const tslib_1 = require("tslib");
const aws = tslib_1.__importStar(require("aws-sdk"));
const URL_EXPIRATION_TIME = 60;
const getFileFromS3 = async (filePath, bucket) => {
    const s3 = new aws.S3({
        region: process.env.S3_REGION,
    });
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', {
            Key: filePath,
            Bucket: bucket,
            Expires: URL_EXPIRATION_TIME,
        }, (err, url) => {
            if (err) {
                reject(err);
            }
            resolve(url);
        });
    });
};
exports.getFileFromS3 = getFileFromS3;
//# sourceMappingURL=aws-s3.helper.js.map