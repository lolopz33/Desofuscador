export default async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { code } = req.body;

    try {
        // Extrai variáveis globais (padrão simples)
        const globais = code.match(/(\w+)\s*=\s*[^\n;]+/g) || [];
        const funcoes = code.match(/(function\s+\w+|local\s+function\s+\w+)/g) || [];

        res.status(200).json({ 
            funcoes: [...new Set([...globais, ...funcoes])] 
        });
    } catch (error) {
        res.status(500).json({ error: 'Falha ao extrair variáveis' });
    }
};
