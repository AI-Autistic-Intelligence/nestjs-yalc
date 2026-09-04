process.env.NODE_ENV = 'test';
if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
    process.on('unhandledRejection', (err) => {
        throw err;
    });
    process.env.LISTENING_TO_UNHANDLED_REJECTION = 'true';
}
export {};
//# sourceMappingURL=jest.setup.js.map