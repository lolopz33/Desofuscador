export default async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { code } = req.body;

    try {
        // Extrai variáveis globais e funções
        const globais = code.match(/(\w+)\s*=\s*[^\n;]+/g) || [];
        const funcoes = code.match(/(function\s+\w+|local\s+function\s+\w+)/g) || [];
        
        // Remove duplicatas
        const itensUnicos = [...new Set([...globais, ...funcoes])];
        
        // Formata a saída com indentação e quebras de linha
        let resultadoFormatado = "📋 Variáveis Globais e Funções:\n\n";
        itensUnicos.forEach((item, index) => {
            const tipo = item.includes("function") ? "🔹 Função" : "🔸 Variável";
            resultadoFormatado += `${index + 1}. ${tipo}: ${item}\n`;
        });

        res.status(200).json({ 
            resultado: resultadoFormatado 
        });
    } catch (error) {
        res.status(500).json({ error: 'Falha ao extrair variáveis' });
    }
};
