export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ erro: "Método não permitido." });
    }

    const { codigo } = req.body;

    try {
        // Extrai chamadas de funções (exemplo simples)
        const funcoes = codigo.match(/(\w+)\(.*?\)/g) || [];
        const funcoesUnicas = [...new Set(funcoes)]; // Remove duplicatas

        res.status(200).json({ funcoes: funcoesUnicas });
    } catch (erro) {
        res.status(500).json({ erro: "Falha ao dumpar funções." });
    }
};
