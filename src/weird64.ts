import { uniq } from 'es-toolkit';

/**
 * The default URL-safe 64-character alphabet used by Weird64.
 *
 * @group Constants
 */
export const DEFAULT_CHARSET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

/** @internal */
function charsetCharacters(charset: string): string[] {
  const characters = Array.from(charset);

  if (characters.length !== 64) {
    throw new RangeError('A Weird64 character set must contain 64 characters.');
  }

  if (uniq(characters).length !== 64) {
    throw new RangeError(
      'A Weird64 character set must contain 64 unique characters.'
    );
  }

  return characters;
}

/**
 * Encodes an arbitrary-length sequence of bits as Weird64.
 *
 * Weird64 surrounds the payload with two sentinel bits and pads the result to
 * a six-bit boundary. This preserves the exact payload length, including
 * trailing zero bits.
 *
 * @example
 * ```ts
 * encodeBooleans([true, false, true]); // "s"
 * ```
 *
 * @param booleans - Bits to encode, represented as booleans.
 * @param charset - A string containing exactly 64 unique characters.
 * @returns The encoded Weird64 value.
 * @throws `RangeError` if the character set is invalid.
 *
 * @group Boolean arrays
 */
export function encodeBooleans(
  booleans: readonly boolean[],
  charset: string = DEFAULT_CHARSET
): string {
  const characters = charsetCharacters(charset);
  const wrapped = [true, ...booleans, true];
  const padding = (6 - (wrapped.length % 6)) % 6;
  const padded = [...wrapped, ...Array<boolean>(padding).fill(false)];

  let result = '';

  for (let offset = 0; offset < padded.length; offset += 6) {
    let value = 0;

    for (let bit = 0; bit < 6; bit += 1) {
      value = (value << 1) | (padded[offset + bit] ? 1 : 0);
    }

    result += characters[value] as string;
  }

  return result;
}

/**
 * Decodes a Weird64 value into its original sequence of bits.
 *
 * Decoding is strict: unknown characters, missing sentinels, and impossible
 * padding are rejected instead of being silently ignored.
 *
 * @example
 * ```ts
 * decodeBooleans('s'); // [true, false, true]
 * ```
 *
 * @param encoded - A valid Weird64 value.
 * @param charset - The same 64-character alphabet used during encoding.
 * @returns The decoded bits represented as booleans.
 * @throws `RangeError` if the character set or encoded value is invalid.
 *
 * @group Boolean arrays
 */
export function decodeBooleans(
  encoded: string,
  charset: string = DEFAULT_CHARSET
): boolean[] {
  const characters = charsetCharacters(charset);
  const characterValues = new Map(
    characters.map((character, value) => [character, value])
  );
  const booleans: boolean[] = [];
  let encodedCharacterCount = 0;

  for (const character of encoded) {
    encodedCharacterCount += 1;
    const value = characterValues.get(character);

    if (value === undefined) {
      throw new RangeError(
        `Invalid Weird64 character: ${JSON.stringify(character)}.`
      );
    }

    for (let bit = 5; bit >= 0; bit -= 1) {
      booleans.push((value & (1 << bit)) !== 0);
    }
  }

  while (booleans.at(-1) === false) {
    booleans.pop();
  }

  const paddingLength = encodedCharacterCount * 6 - booleans.length;
  const hasSentinels = booleans.length >= 2 && booleans[0] && booleans.at(-1);

  if (!hasSentinels || paddingLength > 5) {
    throw new RangeError('Invalid Weird64 sentinel bits or padding.');
  }

  return booleans.slice(1, -1);
}

/**
 * Encodes a string made exclusively of `0` and `1` characters as Weird64.
 *
 * @example
 * ```ts
 * encodeBinaryString('101010'); // "rG"
 * ```
 *
 * @param binary - The binary string to encode.
 * @param charset - A string containing exactly 64 unique characters.
 * @returns The encoded Weird64 value.
 * @throws `TypeError` if `binary` contains a character other than `0` or
 * `1`.
 * @throws `RangeError` if the character set is invalid.
 *
 * @group Binary strings
 */
export function encodeBinaryString(
  binary: string,
  charset: string = DEFAULT_CHARSET
): string {
  if (!/^[01]*$/.test(binary)) {
    throw new TypeError('A binary string may contain only "0" and "1".');
  }

  return encodeBooleans(
    Array.from(binary, (character) => character === '1'),
    charset
  );
}

/**
 * Decodes a Weird64 value into a string of `0` and `1` characters.
 *
 * @param encoded - A valid Weird64 value.
 * @param charset - The same 64-character alphabet used during encoding.
 * @returns The decoded binary string.
 * @throws `RangeError` if the character set or encoded value is invalid.
 *
 * @group Binary strings
 */
export function decodeBinaryString(
  encoded: string,
  charset: string = DEFAULT_CHARSET
): string {
  return decodeBooleans(encoded, charset)
    .map((bit) => (bit ? '1' : '0'))
    .join('');
}

/**
 * Encodes the bytes in a `Blob` as Weird64.
 *
 * This function uses the standard `Blob.arrayBuffer()` API and works in modern
 * browsers and Node.js. It does not require callers to provide `FileReader`.
 *
 * @param blob - The blob whose bytes should be encoded.
 * @param charset - A string containing exactly 64 unique characters.
 * @returns A promise resolving to the encoded Weird64 value.
 * @throws `RangeError` if the character set is invalid.
 *
 * @group Blobs
 */
export async function encodeBlob(
  blob: Blob,
  charset: string = DEFAULT_CHARSET
): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';

  for (const byte of bytes) {
    binary += byte.toString(2).padStart(8, '0');
  }

  return encodeBinaryString(binary, charset);
}

/**
 * Decodes a Weird64 value containing whole bytes into a `Blob`.
 *
 * @param encoded - A Weird64 value produced by {@link encodeBlob}.
 * @param mimeType - MIME type assigned to the returned blob.
 * @param charset - The same 64-character alphabet used during encoding.
 * @returns A promise resolving to the decoded blob.
 * @throws `RangeError` if the decoded payload is not byte-aligned or if
 * the character set or encoded value is invalid.
 *
 * @group Blobs
 */
export async function decodeBlob(
  encoded: string,
  mimeType = 'application/octet-stream',
  charset: string = DEFAULT_CHARSET
): Promise<Blob> {
  const binary = decodeBinaryString(encoded, charset);

  if (binary.length % 8 !== 0) {
    throw new RangeError(
      'A Blob payload must contain a whole number of bytes.'
    );
  }

  const bytes = new Uint8Array(binary.length / 8);

  for (let offset = 0; offset < binary.length; offset += 8) {
    bytes[offset / 8] = Number.parseInt(binary.slice(offset, offset + 8), 2);
  }

  return new Blob([bytes], { type: mimeType });
}

/**
 * Namespace-style API for consumers who prefer a single object.
 *
 * All functions are also available as named exports for optimal tree shaking.
 *
 * @group Utilities
 */
const weird64 = {
  encodeBooleans,
  decodeBooleans,
  encodeBinaryString,
  decodeBinaryString,
  encodeBlob,
  decodeBlob,
  DEFAULT_CHARSET,
};

export default weird64;
