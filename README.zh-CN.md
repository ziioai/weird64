# Weird64

[English](README.md) | [简体中文](README.zh-CN.md)

[![CI](https://github.com/ziioai/weird64/actions/workflows/ci.yml/badge.svg)](https://github.com/ziioai/weird64/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/weird64)](https://www.npmjs.com/package/weird64)
[![license](https://img.shields.io/npm/l/weird64)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6)](https://www.typescriptlang.org/)

Weird64 是一种紧凑、URL 安全的类 Base64 编码，用于表示任意长度的比特序列。
它在六位分组前加入哨兵位，因此能准确恢复输入长度，包括末尾的零比特。

> [!重要]
> Weird64 **不是** RFC 4648 Base64，也不是密码学原语。请勿将它用于加密、
> 身份认证、哈希或安全敏感的混淆。

## 为什么使用 Weird64？

标准 Base64 面向字节，Weird64 面向可能不在八位边界结束的比特数据。

- 任意长度比特数组可精确往返
- 默认字符集 URL 安全，不需要 `=` 填充
- 支持布尔数组、二进制字符串和 `Blob`
- 严格验证自定义字符集与编码输入
- 提供 ESM、CommonJS 和 TypeScript 声明

如果数据本来就是字节，通常应优先使用更通用的标准 Base64 或 base64url。

## 安装

```sh
pnpm add weird64
# 或 npm install weird64
# 或 yarn add weird64
```

## 快速开始

推荐使用具名导出：

```ts
import {
  decodeBinaryString,
  decodeBooleans,
  encodeBinaryString,
  encodeBooleans,
} from 'weird64';

const encodedBits = encodeBooleans([true, false, true]);
console.log(encodedBits); // "s"
console.log(decodeBooleans(encodedBits)); // [true, false, true]

const encodedBinary = encodeBinaryString('101010');
console.log(encodedBinary); // "rG"
console.log(decodeBinaryString(encodedBinary)); // "101010"
```

也可使用默认命名空间风格导出：

```ts
import weird64 from 'weird64';

console.log(weird64.encodeBinaryString('00101001010')); // "bAW"
```

### Blob

`encodeBlob` 使用标准 `Blob.arrayBuffer()` API，不再要求传入 `FileReader`。

```ts
import { decodeBlob, encodeBlob } from 'weird64';

const input = new Blob(['Hello, Weird64!'], { type: 'text/plain' });
const encoded = await encodeBlob(input);
const output = await decodeBlob(encoded, input.type);

console.log(await output.text()); // "Hello, Weird64!"
```

### 自定义字符集

自定义字符集必须恰好包含 64 个不重复的 Unicode 字符，解码时必须使用同一字符集。

```ts
const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/';
const encoded = encodeBooleans([true, false, true], alphabet);
const decoded = decodeBooleans(encoded, alphabet);
```

## 编码格式

1. 在载荷首尾各加一个 `1` 哨兵位。
2. 在末尾添加 0–5 个 `0`，对齐到六位边界。
3. 将每六位映射为字符集中的一个字符。

哨兵位可恢复单个编码值的比特长度，但不能让多个 Weird64 值直接拼接后自动
分隔。如需表示多条记录，请使用外部容器或分隔符。

项目尚未到 1.0，固定兼容性向量已加入测试，任何有意的格式变更都会记录在
[CHANGELOG.md](CHANGELOG.md) 中。

## 文档

- [中文指南](https://ziioai.github.io/weird64/zh/guide/)
- [TypeDoc API 参考](https://ziioai.github.io/weird64/api/)
- [编码格式](https://ziioai.github.io/weird64/zh/format/)

API 参考由 TypeDoc 直接从 TypeScript 源码生成。

## 开发

```sh
pnpm install
pnpm verify
```

`pnpm verify` 会执行格式与 lint 检查、TypeScript 6 类型检查、覆盖率测试、包导出验证，
以及 VitePress 和 TypeDoc 文档构建。

贡献前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 和
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。安全问题请按 [SECURITY.md](SECURITY.md) 私下报告。

## 许可证

[MIT](LICENSE) © ZIIO AI
