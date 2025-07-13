// weird64.ts

/**
 * 默认的 Base64 字符集（移除了空格）
 * 包含: 0-9, A-Z, a-z, -, _
 */
export const DEFAULT_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

/**
 * 将布尔数组编码为 Weird64 字符串
 * @param booleans - 要编码的布尔数组
 * @param base64Chars - 可选的 Base64 字符集（默认使用标准字符集）
 * @returns 编码后的字符串
 */
export function encodeBooleans(booleans: boolean[], base64Chars: string = DEFAULT_CHARSET): string {
    // 1. 在数据两端添加 true
    const wrapped = [true, ...booleans, true];
    
    // 2. 计算需要填充的 false 数量使其成为 6 的倍数
    const padding = (6 - (wrapped.length % 6)) % 6;
    const padded = [...wrapped, ...Array(padding).fill(false)];
    
    // 3. 每 6 位一组转换为 Base64 字符
    let result = "";
    for (let i = 0; i < padded.length; i += 6) {
        const chunk = padded.slice(i, i + 6);
        let value = 0;
        
        // 将 6 位二进制转换为十进制
        for (let j = 0; j < 6; j++) {
            value = (value << 1) | (chunk[j] ? 1 : 0);
        }
        
        result += base64Chars[value];
    }
    
    return result;
}

/**
 * 将 Weird64 字符串解码为布尔数组
 * @param encoded - 要解码的字符串
 * @param base64Chars - 可选的 Base64 字符集（默认使用标准字符集）
 * @returns 解码后的布尔数组
 */
export function decodeBooleans(encoded: string, base64Chars: string = DEFAULT_CHARSET): boolean[] {
    // 1. 将每个字符转换为 6 位布尔数组
    const booleans: boolean[] = [];
    
    for (const char of encoded) {
        const index = base64Chars.indexOf(char);
        if (index === -1) continue; // 跳过无效字符
        
        // 将字符值转换为 6 位二进制（高位在前）
        for (let i = 5; i >= 0; i--) {
            booleans.push((index & (1 << i)) !== 0);
        }
    }
    
    // 2. 移除末尾的所有 false
    while (booleans.length > 0 && !booleans[booleans.length - 1]) {
        booleans.pop();
    }
    
    // 3. 移除首尾的 true（哨兵位）
    if (booleans.length >= 2) {
        booleans.pop(); // 移除尾部 true
        booleans.shift(); // 移除头部 true
    }
    
    return booleans;
}

/**
 * 将二进制字符串编码为 Weird64
 * @param binaryStr - 二进制字符串（由 '0' 和 '1' 组成）
 * @param base64Chars - 可选的 Base64 字符集（默认使用标准字符集）
 * @returns 编码后的字符串
 */
export function encodeBinaryString(binaryStr: string, base64Chars: string = DEFAULT_CHARSET): string {
    const booleans = Array.from(binaryStr, char => char === '1');
    return encodeBooleans(booleans, base64Chars);
}

/**
 * 将 Weird64 字符串解码为二进制字符串
 * @param encoded - 要解码的字符串
 * @param base64Chars - 可选的 Base64 字符集（默认使用标准字符集）
 * @returns 解码后的二进制字符串
 */
export function decodeBinaryString(encoded: string, base64Chars: string = DEFAULT_CHARSET): string {
    const booleans = decodeBooleans(encoded, base64Chars);
    return booleans.map(bool => bool ? '1' : '0').join('');
}


/**
 * 将 Blob 编码为 Weird64 字符串
 * @param blob - 要编码的 Blob 对象
 * @param base64Chars - 可选的 Base64 字符集（默认使用标准字符集）
 * @returns Promise 解析为编码后的字符串
 */
export async function encodeBlob(blob: Blob, FileReader:any, base64Chars: string = DEFAULT_CHARSET): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            try {
                const buffer = reader.result as ArrayBuffer;
                const bytes = new Uint8Array(buffer);
                const binaryString = Array.from(bytes)
                    .map(byte => byte.toString(2).padStart(8, '0'))
                    .join('');
                
                resolve(encodeBinaryString(binaryString, base64Chars));
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => {
            reject(reader.error);
        };
        
        reader.readAsArrayBuffer(blob);
    });
}

/**
 * 将 Weird64 字符串解码为 Blob 对象
 * @param encoded - 要解码的 Weird64 字符串
 * @param mimeType - 原始数据的 MIME 类型
 * @param base64Chars - 可选的 Base64 字符集（默认使用标准字符集）
 * @returns Promise 解析为解码后的 Blob 对象
 */
export async function decodeBlob(encoded: string, mimeType = 'application/octet-stream', base64Chars: string = DEFAULT_CHARSET): Promise<Blob> {
    return new Promise((resolve, reject) => {
        try {
            const binaryString = decodeBinaryString(encoded, base64Chars);
            
            // 确保二进制字符串长度是8的倍数（完整字节）
            const padding = (8 - (binaryString.length % 8)) % 8;
            const paddedBinary = binaryString + '0'.repeat(padding);
            
            // 将二进制字符串转换为字节数组
            const bytes = [];
            for (let i = 0; i < paddedBinary.length; i += 8) {
                const byteStr = paddedBinary.substring(i, i + 8);
                bytes.push(Number.parseInt(byteStr, 2));
            }
            
            // 创建 Blob 对象
            const buffer = new Uint8Array(bytes).buffer;
            resolve(new Blob([buffer], { type: mimeType }));
        } catch (error) {
            reject(error);
        }
    });
}

// 导出所有函数作为模块
export default {
    encodeBooleans,
    decodeBooleans,
    encodeBinaryString,
    decodeBinaryString,
    encodeBlob,
    decodeBlob,
    DEFAULT_CHARSET,
};
