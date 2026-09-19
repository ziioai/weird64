# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-09-19

### Added

- Strict validation for custom alphabets and encoded input.
- Stable compatibility vectors and comprehensive automated tests.
- English and Simplified Chinese documentation.
- TypeDoc-generated API documentation and a bilingual VitePress site.
- Community health files, issue forms, CI, Pages, Dependabot, and npm release
  automation.
- Explicit ESM, CommonJS, and default export validation.

### Changed

- Upgraded development type checking to TypeScript 6.
- Replaced `lodash-es` with `es-toolkit`.
- Changed `encodeBlob(blob, FileReader, charset?)` to
  `encodeBlob(blob, charset?)`; the implementation now uses
  `Blob.arrayBuffer()`.
- Blob decoding now rejects payloads that are not byte-aligned instead of
  silently appending zero bits.
- Decoding now throws on malformed input instead of skipping unknown
  characters.

### Removed

- Unused runtime dependencies and template documentation.

## [0.0.5] - 2025-07-13

### Added

- Initial TypeScript implementation and npm package metadata.

[Unreleased]: https://github.com/ziioai/weird64/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ziioai/weird64/compare/v0.0.5...v0.1.0
[0.0.5]: https://github.com/ziioai/weird64/releases/tag/v0.0.5
