# 快速开始

## 安装

```sh
pnpm add weird64
```

## 编码比特

```ts
import { decodeBooleans, encodeBooleans } from 'weird64';

const encoded = encodeBooleans([true, false, true]); // "s"
const decoded = decodeBooleans(encoded); // [true, false, true]
```

二进制字符串可使用 `encodeBinaryString` 和 `decodeBinaryString`：

```ts
import { decodeBinaryString, encodeBinaryString } from 'weird64';

const encoded = encodeBinaryString('101010'); // "rG"
const decoded = decodeBinaryString(encoded); // "101010"
```

## 编码 Blob

```ts
import { decodeBlob, encodeBlob } from 'weird64';

const input = new Blob(['Hello!'], { type: 'text/plain' });
const encoded = await encodeBlob(input);
const output = await decodeBlob(encoded, input.type);
```

Blob 载荷必须包含完整字节。对于大型二进制数据，标准的字节编码通常更节省内存。

## 处理不可信输入

解码器会严格验证输入。未知字符、错误哨兵位、错误填充或非法字符集都会抛出
`RangeError`。

继续阅读[编码格式](/zh/format)，或查看<a href="/weird64/api/" target="_self">TypeDoc API 参考</a>。
