import * as AWS from 'aws-sdk';
export const pushToAwsSQS = async (config, message) => {
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
//# sourceMappingURL=aws-sqs.helper.js.map