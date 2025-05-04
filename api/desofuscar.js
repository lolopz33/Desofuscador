import { Buffer } from 'buffer';
import patterns from '../utils/patterns.json';
import { decodeMoonSec, decodeLuaV3, unpackSE, decodeXOR } from '../utils/lua_decoder';

// Adicione este formatador simples (não precisa de instalação)
function formatLua(code) {
    // Lógica básica de formatação (indentação com 2 espaços)
    let indentLevel = 0;
    let formatted = '';
    const lines = code.split('\n');

    lines.forEach(line => {
        line = line.trim();
        if (line.includes('end') || line.includes('until') || line.includes('else') || line.includes('elseif')) {
            indentLevel--;
        }

        formatted += '  '.repeat(indentLevel) + line + '\n';

        if (line.includes('then') || line.includes('do') || line.includes('else') || line.includes('function')) {
            indentLevel++;
        }
    });

    return formatted;
}

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

        // Formata o código após desofuscar
        const formattedResult = formatLua(result);

        res.status(200).json({ 
            result: formattedResult,  // Código formatado
            method: detectedMethod,
            isFormatted: true         // Flag para o frontend
        });

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
