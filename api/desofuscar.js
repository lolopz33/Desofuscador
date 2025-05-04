export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ erro: "Método não permitido." });
    }

    const { codigo, metodo } = req.body;

    try {
        let resultado;

        if (metodo === "base64") {
            resultado = Buffer.from(codigo, "base64").toString("utf-8");
        } 
        else if (metodo === "moonsec") {
            // Exemplo: MoonSec usa loadstring + XOR
            resultado = codigo.replace(/loadstring\(.*?\)/, match => {
                const decoded = match.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => 
                    String.fromCharCode(parseInt(hex, 16)));
                return decoded;
            });
        }
        else if (metodo === "luaobf") {
            // LuaObfuscator geralmente usa Base64 + manipulação de strings
            const decoded = Buffer.from(codigo, "base64").toString("utf-8");
            resultado = decoded.replace(/\[\[\].*?\]\]/g, ""); // Remove lixo
        }
        else {
            return res.status(400).json({ erro: "Método inválido." });
        }

        res.status(200).json({ resultado });
    } catch (erro) {
        res.status(500).json({ erro: "Falha ao desofuscar." });
    }
};
