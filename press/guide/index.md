# Getting started

## Install

```sh
pnpm add weird64
```

## Encode bits

```ts
import { decodeBooleans, encodeBooleans } from 'weird64';

const encoded = encodeBooleans([true, false, true]); // "s"
const decoded = decodeBooleans(encoded); // [true, false, true]
```

For binary strings, use `encodeBinaryString` and `decodeBinaryString`:

```ts
import { decodeBinaryString, encodeBinaryString } from 'weird64';

const encoded = encodeBinaryString('101010'); // "rG"
const decoded = decodeBinaryString(encoded); // "101010"
```

## Encode blobs

```ts
import { decodeBlob, encodeBlob } from 'weird64';

const input = new Blob(['Hello!'], { type: 'text/plain' });
const encoded = await encodeBlob(input);
const output = await decodeBlob(encoded, input.type);
```

Blob data must consist of complete bytes. For large binary payloads, a standard
byte-oriented encoding is normally more memory efficient.

## Handle untrusted input

Decoding is strict and throws `RangeError` for unknown characters, invalid
sentinels, invalid padding, or an invalid alphabet. Treat decode failures as
normal input-validation errors:

```ts
try {
  const bits = decodeBinaryString(valueFromOutsideYourApplication);
} catch (error) {
  // Reject or report the malformed value.
}
```

Continue with the [encoding format](/format) or see the
<a href="/weird64/api/" target="_self">generated API reference</a>.
