# Weird64 - 独特的 Base64 变种编码库

Weird64 是一个独特的 Base64 变种编码库，采用特殊算法在数据首尾添加哨兵位（true）并使用 false 填充对齐。这种设计使得编码后的数据具有自描述边界特性，特别适合需要边界识别的场景。

[![npm version](https://img.shields.io/npm/v/weird64)](https://www.npmjs.com/package/weird64)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

## 特性

- 🚀 **独特编码算法**：使用首尾哨兵位标记数据边界
- 💾 **支持多种数据类型**：布尔数组、二进制字符串、Blob 对象
- 🔧 **完全可定制**：支持自定义 Base64 字符集
- 🌐 **浏览器兼容**：支持所有现代浏览器
- ⚡ **高效实现**：优化处理大数据集

## 安装

```bash
pnpm add weird64
# 或
npm i weird64
# 或
yarn add weird64
```

## 使用方法

### 基础用法

```javascript
import weird64 from 'weird64';

// 编码布尔数组
const boolData = [true, false, true];
const encoded = weird64.encodeBooleans(boolData);
console.log(encoded); // 输出类似 "pA"

// 解码回布尔数组
const decoded = weird64.decodeBooleans(encoded);
console.log(decoded); // [true, false, true]

// 编码二进制字符串
const binaryStr = '101010';
const binEncoded = weird64.encodeBinaryString(binaryStr);
console.log(binEncoded); // 输出类似 "qA"

// 解码回二进制字符串
const binDecoded = weird64.decodeBinaryString(binEncoded);
console.log(binDecoded); // "101010"
```

### Blob 数据处理

```javascript
// 编码文本 Blob
async function encodeTextBlob() {
    const text = 'Hello, Weird64!';
    const blob = new Blob([text], { type: 'text/plain' });
    
    const encoded = await weird64.encodeBlob(blob, FileReader);
    console.log('Encoded Blob:', encoded);
    
    const decodedBlob = await weird64.decodeBlob(encoded, 'text/plain');
    const decodedText = await decodedBlob.text();
    console.log('Decoded text:', decodedText); // "Hello, Weird64!"
}

// 编码图像
async function encodeImage() {
    // 从 URL 获取图像
    const imageResponse = await fetch('https://example.com/image.png');
    const imageBlob = await imageResponse.blob();
    
    // 编码为 Weird64
    const encoded = await weird64.encodeBlob(imageBlob, 'image/png');
    
    // 解码回 Blob
    const decodedBlob = await weird64.decodeBlob(encoded, 'image/png');
    
    // 使用解码后的图像
    const img = document.createElement('img');
    img.src = URL.createObjectURL(decodedBlob);
    document.body.appendChild(img);
}
```

### 自定义字符集

```javascript
// 使用自定义 Base64 字符集
const customChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/';

const boolData = [true, false, true];
const encoded = weird64.encodeBooleans(boolData, customChars);
console.log(encoded); // 使用自定义字符集编码

const decoded = weird64.decodeBooleans(encoded, customChars);
console.log(decoded); // [true, false, true]
```

### 大文件处理（分块）

```javascript
async function encodeLargeFile(blob, chunkSize = 1024 * 1024) {
    const chunks = [];
    const totalChunks = Math.ceil(blob.size / chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
        const chunkBlob = blob.slice(i * chunkSize, (i + 1) * chunkSize);
        const encodedChunk = await weird64.encodeBlob(chunkBlob);
        chunks.push(encodedChunk);
    }
    
    return chunks.join('\n'); // 用换行符分隔块
}

async function decodeLargeFile(encoded, mimeType) {
    const chunks = encoded.split('\n');
    const blobParts = [];
    
    for (const chunk of chunks) {
        const decodedChunk = await weird64.decodeBlob(chunk, mimeType);
        blobParts.push(decodedChunk);
    }
    
    return new Blob(blobParts, { type: mimeType });
}
```

## API 参考

### 核心函数

| 函数名 | 描述 | 参数 | 返回值 |
|--------|------|------|---------|
| `encodeBooleans(booleans, base64Chars?)` | 编码布尔数组 | `booleans`: 布尔数组, `base64Chars?`: 可选字符集 | 编码字符串 |
| `decodeBooleans(encoded, base64Chars?)` | 解码为布尔数组 | `encoded`: 编码字符串, `base64Chars?`: 可选字符集 | 布尔数组 |
| `encodeBinaryString(binaryStr, base64Chars?)` | 编码二进制字符串 | `binaryStr`: '0'/'1'字符串, `base64Chars?`: 可选字符集 | 编码字符串 |
| `decodeBinaryString(encoded, base64Chars?)` | 解码为二进制字符串 | `encoded`: 编码字符串, `base64Chars?`: 可选字符集 | 二进制字符串 |
| `encodeBlob(blob, FileReader, base64Chars?)` | 编码 Blob 对象 | `blob`: Blob 对象, `FileReader`: FileReader 构造函数, `base64Chars?`: 可选字符集 | Promise 解析为编码字符串 |
| `decodeBlob(encoded, mimeType?, base64Chars?)` | 解码为 Blob 对象 | `encoded`: 编码字符串, `mimeType?`: MIME 类型, `base64Chars?`: 可选字符集 | Promise 解析为 Blob 对象 |

### 常量

| 常量 | 描述 | 值 |
|------|------|----|
| `DEFAULT_CHARSET` | 默认字符集 | `"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"` |

## 算法说明

### 编码过程

1. **添加哨兵位**：在数据开头和结尾各添加一个 `true`
2. **填充对齐**：
   - 计算总长度，如果不是 6 的倍数
   - 在末尾添加 `false` 使其成为 6 的倍数
3. **分组编码**：
   - 每 6 位一组转换为 Base64 字符
   - 使用自定义字符集进行映射

### 解码过程

1. **字符转换**：将每个字符转换为 6 位布尔值
2. **移除填充**：从末尾移除所有连续的 `false`
3. **移除哨兵**：移除开头和结尾的 `true`（哨兵位）

## 使用场景

1. **数据边界识别**：哨兵位自动标记数据起始和结束
2. **二进制数据编码**：高效处理图像、音频等二进制数据
3. **自定义数据格式**：需要特殊字符集的数据编码
4. **数据序列化**：转换复杂数据结构为可传输格式
5. **数据混淆**：非标准编码提供基本的数据混淆

## 性能注意事项

1. **大文件处理**：
   - 对于超过 10MB 的文件，建议使用分块处理
   - 内存占用与文件大小成正比

2. **字符集选择**：
   - 默认字符集是 URL 安全的
   - 自定义字符集可能影响编码效率

3. **数据类型**：
   - 文本数据编码效率最高
   - 随机二进制数据编码后体积增加约 33%

<!-- ## 测试

项目包含完整的测试套件：

```bash
npm test
```

测试覆盖率包括：
- 空数据边界情况
- 各种长度的布尔数组
- 二进制字符串编码
- Blob 对象编解码
- 自定义字符集支持
- 无效字符处理 -->

## 贡献指南

欢迎贡献！
请遵循以下步骤：

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 作者

[ZIIO AI](https://github.com/ziioai/)

## 致谢

- 灵感来源于独特的 Base64 变种需求
- 感谢所有贡献者和用户

