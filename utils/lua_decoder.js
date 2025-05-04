// MoonSec Decoder
export function decodeMoonSec(code) {
    // Remove anti-debug
    let cleaned = code.replace(/;--\[\[.*?\]\]/g, '');
    
    // Decodifica XOR
    cleaned = cleaned.replace(/\\x([a-fA-F0-9]{2})/g, (_, hex) => 
        String.fromCharCode(parseInt(hex, 16)));
    
    // Extrai payload
    const payload = cleaned.match(/loadstring\((['"])(.*?)\1\)/);
    return payload ? Buffer.from(payload[2], 'base64').toString('utf-8') : code;
}

// LuaV3 Decoder
export function decodeLuaV3(code) {
    return code
        .replace(/\(function\(.*?\)end\)\)/g, '')
        .replace(/\[\[\].*?\]\]/g, '');
}

// SE Obfuscator Unpacker
export function unpackSE(code) {
    return code.replace(/"\s*\.\.\s*"/g, '');
}

// XOR Decoder
export function decodeXOR(code, key = 0x55) {
    return code.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('');
}
