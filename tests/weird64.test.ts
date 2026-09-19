import { describe, expect, it } from 'vitest';
import weird64, {
  DEFAULT_CHARSET,
  decodeBinaryString,
  decodeBlob,
  decodeBooleans,
  encodeBinaryString,
  encodeBlob,
  encodeBooleans,
} from '../src';

describe('boolean arrays', () => {
  it.each([
    { value: [] as boolean[] },
    { value: [false] },
    { value: [true] },
    { value: [true, false, true] },
    { value: [false, false, false, false, false, false] },
    { value: [true, false, true, false, false, false, false] },
  ])('round-trips $value', ({ value }) => {
    expect(decodeBooleans(encodeBooleans(value))).toEqual(value);
  });

  it('keeps stable compatibility vectors', () => {
    expect(encodeBooleans([])).toBe('m');
    expect(encodeBooleans([true, false, true])).toBe('s');
    expect(
      encodeBooleans([
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
        true,
        false,
      ])
    ).toBe('rLG');
  });

  it('supports a custom character set', () => {
    const charset =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/';
    const encoded = encodeBooleans([true, false, true], charset);

    expect(decodeBooleans(encoded, charset)).toEqual([true, false, true]);
  });

  it('rejects invalid character sets', () => {
    expect(() => encodeBooleans([], 'short')).toThrow(RangeError);
    expect(() => encodeBooleans([], '0'.repeat(64))).toThrow(/unique/);
  });

  it('rejects malformed encoded values', () => {
    expect(() => decodeBooleans('')).toThrow(/sentinel/);
    expect(() => decodeBooleans('!')).toThrow(/Invalid Weird64 character/);
    expect(() => decodeBooleans('0')).toThrow(/sentinel/);
  });
});

describe('binary strings', () => {
  it.each(['', '0', '1', '101010', '00101001010', '100000000000'])(
    'round-trips %j',
    (value) => {
      expect(decodeBinaryString(encodeBinaryString(value))).toBe(value);
    }
  );

  it('keeps stable compatibility vectors', () => {
    expect(encodeBinaryString('101010')).toBe('rG');
    expect(encodeBinaryString('00101001010')).toBe('bAW');
  });

  it('rejects non-binary input', () => {
    expect(() => encodeBinaryString('10201')).toThrow(TypeError);
  });
});

describe('blobs', () => {
  it('round-trips bytes and the MIME type', async () => {
    const input = new Blob(['Hello, Weird64!'], { type: 'text/plain' });
    const encoded = await encodeBlob(input);
    const decoded = await decodeBlob(encoded, input.type);

    expect(decoded.type).toBe('text/plain');
    expect(await decoded.text()).toBe('Hello, Weird64!');
  });

  it('rejects payloads that do not contain complete bytes', async () => {
    await expect(decodeBlob(encodeBinaryString('1'))).rejects.toThrow(
      /whole number of bytes/
    );
  });
});

describe('exports', () => {
  it('provides default, namespace-style, and named exports', () => {
    expect(weird64.encodeBooleans).toBe(encodeBooleans);
    expect(weird64.DEFAULT_CHARSET).toBe(DEFAULT_CHARSET);
  });
});
