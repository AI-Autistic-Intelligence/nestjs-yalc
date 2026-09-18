"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushToAwsSQS = void 0;
const tslib_1 = require("tslib");
const AWS = tslib_1.__importStar(require("aws-sdk"));
const pushToAwsSQS = async (config, message) => {
    return new Promise((resolve, reject) => {
        const sqs = new AWS.SQS({ region: config.region });
        sqs.sendMessage({
            QueueUrl: config.endpoint + config.queueName,
            MessageBody: message,
        }, (error) => {
            if (error) {
                reject(error);
            }
            resolve();
        });
    });
};
exports.pushToAwsSQS = pushToAwsSQS;
//# sourceMappingURL=aws-sqs.helper.js.map