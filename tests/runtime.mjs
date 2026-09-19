import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import weird64, {
  decodeBinaryString,
  decodeBlob,
  encodeBinaryString,
  encodeBlob,
} from 'weird64';

const require = createRequire(import.meta.url);
const commonJs = require('weird64');

assert.equal(encodeBinaryString('101010'), 'rG');
assert.equal(decodeBinaryString('rG'), '101010');
assert.equal(weird64.encodeBinaryString('101010'), 'rG');
assert.equal(commonJs.encodeBinaryString('101010'), 'rG');
assert.equal(commonJs.default.encodeBinaryString('101010'), 'rG');

const input = new Blob(['Hello, Weird64!'], { type: 'text/plain' });
const output = await decodeBlob(await encodeBlob(input), input.type);

assert.equal(output.type, 'text/plain');
assert.equal(await output.text(), await input.text());

console.log(`Runtime smoke test passed on Node.js ${process.version}`);
