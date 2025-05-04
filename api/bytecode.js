export default async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { code } = req.body;

    try {
        // Simulação: Em um projeto real, integraria com unluac ou luadec
        res.status(200).json({ 
            bytecode: "⚠️ Análise de bytecode requer ferramentas externas (ex: unluac)."
        });
    } catch (error) {
        res.status(500).json({ error: 'Falha ao analisar bytecode' });
    }
};
