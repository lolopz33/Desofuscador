import { formatLuaCode } from '../utils/luaBeautifier';

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    try {
        const { code } = req.body;
        const formatted = formatLuaCode(code);
        res.status(200).json({ formatted });

    } catch (error) {
        res.status(500).json({ error: 'Falha ao formatar código Lua.' });
    }
};
