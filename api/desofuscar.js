export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ erro: "Método não permitido." });
    }

    const { codigo, metodo } = req.body;

    try {
        let resultado;

        // Base64
        if (metodo === "base64") {
            resultado = Buffer.from(codigo, "base64").toString("utf-8");
        }

        // MoonSec (usa XOR + loadstring)
        else if (metodo === "moonsec") {
            const decoded = codigo.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => 
                String.fromCharCode(parseInt(hex, 16)));
            resultado = decoded.replace(/loadstring\(.*?\)/, "---LOADSTRING REMOVIDO---");
        }

        // LuaObfuscator (Base64 + manipulação de strings)
        else if (metodo === "luaobf") {
            const decoded = Buffer.from(codigo.split("'")[1], "base64").toString("utf-8");
            resultado = decoded.replace(/\[\[\].*?\]\]/g, "");
        }

        // LuaV3 (usa chunks criptografados)
        else if (metodo === "luav3") {
            const chunkDecrypted = codigo.replace(/\(function\(.*?\)end\)\)/, match => {
                return match.replace(/[^\w\s]/g, ""); // Remove caracteres especiais
            });
            resultado = chunkDecrypted;
        }

        // SE Obfuscator (frequentemente usa concatenação de strings)
        else if (metodo === "seobf") {
            resultado = codigo.replace(/"\s*\.\.\s*"/g, ""); // Remove concatenações
        }

        else {
            return res.status(400).json({ erro: "Método inválido." });
        }

        res.status(200).json({ resultado });
    } catch (erro) {
        res.status(500).json({ erro: "Falha ao desofuscar." });
    }
};
