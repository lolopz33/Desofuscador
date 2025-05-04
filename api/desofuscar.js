import { Buffer } from 'buffer';
import patterns from '../utils/patterns.json';

// Ferramentas customizadas
import { decodeMoonSec, decodeLuaV3, unpackSE } from '../utils/lua_decoder';

export default async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { code, method } = req.body;

    try {
        let result = code;
        let detectedMethod = method;

        // Auto-detecção
        if (method === 'auto') {
            detectedMethod = detectObfuscator(code);
        }

        switch (detectedMethod) {
            // Base64 padrão
            case 'base64':
                result = Buffer.from(code, 'base64').toString('utf-8');
                break;

            // MoonSec (XOR + Loadstring)
            case 'moonsec':
                result = decodeMoonSec(code);
                break;

            // LuaV3 (Chunks criptografados)
            case 'luav3':
                result = decodeLuaV3(code);
                break;

            // SE Obfuscator (String concat)
            case 'seobf':
                result = unpackSE(code);
                break;

            // Bytecode Lua (Luac)
            case 'luac':
                result = await decompileBytecode(code);
                break;

            // XOR Encryption
            case 'xor':
                result = decodeXOR(code);
                break;

            default:
                return res.status(400).json({ error: 'Método não suportado' });
        }

        res.status(200).json({ result, method: detectedMethod });
    } catch (error) {
        res.status(500).json({ error: 'Falha na desofuscação', details: error.message });
    }
};

// Função de auto-detecção
function detectObfuscator(code) {
    for (const [obfuscator, pattern] of Object.entries(patterns)) {
        if (new RegExp(pattern).test(code)) {
            return obfuscator;
        }
    }
    return 'unknown';
}
