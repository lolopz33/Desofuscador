import { Buffer } from 'buffer';
import patterns from '../utils/patterns.json';
import { decodeMoonSec, decodeLuaV3, unpackSE, decodeXOR } from '../utils/lua_decoder';

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
            case 'base64':
                result = Buffer.from(code, 'base64').toString('utf-8');
                break;
            case 'moonsec':
                result = decodeMoonSec(code);
                break;
            case 'luav3':
                result = decodeLuaV3(code);
                break;
            case 'seobf':
                result = unpackSE(code);
                break;
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

function detectObfuscator(code) {
    for (const [obfuscator, pattern] of Object.entries(patterns)) {
        if (new RegExp(pattern).test(code)) {
            return obfuscator;
        }
    }
    return 'unknown';
}
