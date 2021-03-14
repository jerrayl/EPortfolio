/**
 * @jest-environment ./ServerEnvironment
 */

const {connectDB, disconnectDB} = require('../../server/config/db');

test('connect to DB', async () => {
    await expect(async() => await connectDB()).not.toThrow(Error);
    await disconnectDB();
});