// Dark Mode Toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
});

// Verificar preferência de tema ao carregar
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}

// Carregar Arquivo
document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        document.getElementById('codigo').value = event.target.result;
    };
    reader.readAsText(file);
});

// Limpar Código
function limpar() {
    document.getElementById('codigo').value = '';
    document.getElementById('resultado').textContent = '';
    document.getElementById('info').textContent = '';
}

// Copiar Resultado
function copiarResultado() {
    const resultado = document.getElementById('resultado').textContent;
    navigator.clipboard.writeText(resultado);
    document.getElementById('info').textContent = '✅ Copiado para a área de transferência!';
    setTimeout(() => {
        document.getElementById('info').textContent = '';
    }, 2000);
}

// Desofuscar Código
async function desofuscar() {
    const codigo = document.getElementById('codigo').value;
    const metodo = document.getElementById('metodo').value;
    
    if (!codigo) {
        alert("Cole um código primeiro!");
        return;
    }

    try {
        // Mostrar loading
        document.getElementById('resultado').textContent = '⏳ Processando...';
        document.getElementById('info').textContent = '';
        
        const resposta = await fetch("/api/desofuscar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: codigo, method: metodo }),
        });

        // Verificar se a resposta é JSON válido
        const contentType = resposta.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await resposta.text();
            throw new Error(`Resposta inválida: ${text.slice(0, 100)}`);
        }

        const { result, error, method: detectedMethod, isFormatted } = await resposta.json();
        
        if (error) {
            throw new Error(error);
        }

        // Exibir resultado formatado
        document.getElementById('resultado').textContent = result;
        document.getElementById('info').textContent = `✅ ${isFormatted ? 'Código formatado e' : ''} Desofuscado usando: ${detectedMethod || metodo}`;
        
    } catch (error) {
        document.getElementById('resultado').textContent = `Erro: ${error.message}`;
        console.error("Detalhes do erro:", error);
    }
}

// Dumpar Globais (Versão Aprimorada)
async function dumpar() {
    const codigo = document.getElementById('codigo').value;
    
    if (!codigo) {
        alert("Cole um código primeiro!");
        return;
    }

    try {
        document.getElementById('resultado').textContent = '⏳ Analisando código...';
        
        const resposta = await fetch("/api/dumper", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: codigo }),
        });

        const { resultado, error } = await resposta.json();
        
        if (error) {
            throw new Error(error);
        }

        // Formatar a saída com categorias claras
        let output = "📋 Análise do Código\n\n";
        const lines = resultado.split('\n');
        
        lines.forEach(line => {
            if (line.includes('🔹 Função')) {
                output += `\n${line}\n${'-'.repeat(40)}\n`;
            } else if (line.includes('🔸 Variável')) {
                output += `\n${line}\n`;
            } else if (line.trim()) {
                output += `  ${line}\n`;
            }
        });

        document.getElementById('resultado').textContent = output;
        
    } catch (error) {
        document.getElementById('resultado').textContent = `Erro: ${error.message}`;
    }
}

// Analisar Bytecode
async function analisarBytecode() {
    const codigo = document.getElementById('codigo').value;
    
    if (!codigo) {
        alert("Cole um código primeiro!");
        return;
    }

    try {
        document.getElementById('resultado').textContent = '⏳ Decompilando bytecode...';
        
        const resposta = await fetch("/api/bytecode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: codigo }),
        });

        const { bytecode, error } = await resposta.json();
        
        if (error) {
            throw new Error(error);
        }

        // Adicionar syntax highlighting simulando
        const formattedBytecode = bytecode
            .replace(/(LOADK|GETGLOBAL)/g, '\x1b[35m$1\x1b[0m')  // Cores ANSI (opcional)
            .replace(/\n/g, '\n  ');  // Indentação
            
        document.getElementById('resultado').textContent = `⚙️ Bytecode Lua:\n  ${formattedBytecode}`;
        
    } catch (error) {
        document.getElementById('resultado').textContent = `Erro: ${error.message}`;
    }
}

// Novo: Botão de Formatar Código
async function formatarCodigo() {
    const codigo = document.getElementById('codigo').value;
    if (!codigo) {
        alert("Cole um código primeiro!");
        return;
    }

    try {
        document.getElementById('resultado').textContent = '⏳ Formatando código...';
        
        const resposta = await fetch("/api/desofuscar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: codigo, method: 'format' }),
        });

        const { result, error } = await resposta.json();
        
        if (error) {
            throw new Error(error);
        }

        document.getElementById('codigo').value = result;
        document.getElementById('info').textContent = '✅ Código formatado!';
        
    } catch (error) {
        document.getElementById('resultado').textContent = `Erro: ${error.message}`;
    }
}
