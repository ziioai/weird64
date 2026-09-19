# Encoding format

Weird64 encodes an arbitrary number of bits into six-bit characters.

## Default alphabet

```text
0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_
```

The character at index 0 represents `000000`; the character at index 63
represents `111111`.

## Framing

Given payload bits `P`:

1. Construct `1 P 1` using leading and trailing sentinel bits.
2. Append the minimum number of `0` bits required to reach a multiple of six.
3. Convert each six-bit group to an alphabet index.

Example:

```text
payload:  101
framed:  1 101 1
padded:  110110
index:       54
output:       s
```

During decoding, trailing zero padding and the two sentinels are removed. The
decoder rejects padding longer than five bits, a missing sentinel, an unknown
character, or an invalid alphabet.

## Compatibility vectors

| Input | Output |
| --- | --- |
| Empty bit sequence | `m` |
| `101` | `s` |
| `101010` | `rG` |
| `00101001010` | `bAW` |

## Boundaries and security

The trailing sentinel preserves the payload length within one Weird64 value.
It does not identify the boundary between concatenated values. Store multiple
values in a container format or add an external delimiter.

Weird64 provides no confidentiality, integrity, or authenticity. It must not be
used as encryption or as a substitute for a cryptographic construction.
