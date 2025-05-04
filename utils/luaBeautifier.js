import luaFmt from 'lua-fmt';

export function formatLuaCode(code) {
    try {
        // Opções de formatação (personalizável)
        const options = {
            indent: "    ", // 4 espaços
            lineWidth: 80,   // Tamanho máximo da linha
            quotemark: "'"   // Usa aspas simples
        };
        
        return luaFmt.formatText(code, options);
    } catch (error) {
        console.error("Erro ao formatar Lua:", error);
        return code; // Retorna o original se falhar
    }
}
