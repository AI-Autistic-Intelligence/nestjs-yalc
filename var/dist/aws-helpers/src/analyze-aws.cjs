const fs = require('fs');

const p = 'aws-helpers/src/encryption.helper.spec.ts';
let c = fs.readFileSync(p, 'utf8');

// The best way to mock asyncDecrypt without breaking aws is to mock the whole module, but providing the real implementations for everything else.
// However, the test tests asyncDecrypt! No wait, it mocks asyncDecrypt to test `decryptString`!
// "it('should be able to decrypt remotely on aws', async () => {
//   jest.spyOn($, 'asyncDecrypt').mockResolvedValue('someString');
//   const result = await $.decryptString(encrypted, $.EncryptMode.AWS);
// });"

// So we only need `decryptString` to use a mocked `asyncDecrypt`. 
// But since they are both in the same file, `decryptString` calls `asyncDecrypt` directly, NOT through `$`!
// Wait! If `decryptString` calls `asyncDecrypt` directly in the same file `encryption.helper.ts`, `jest.spyOn($, 'asyncDecrypt')` WILL NOT WORK ANYWAY in ESM or even CJS sometimes!
// Let me look at `aws-helpers/src/encryption.helper.ts` and see how it is called.
