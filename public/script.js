// Dark Mode Toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

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
        const resposta = await fetch("/api/desofuscar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: codigo, method: metodo }),
        });

        const { result, error, method: detectedMethod } = await resposta.json();
        
        if (error) {
            document.getElementById('resultado').textContent = `Erro: ${error}`;
        } else {
            document.getElementById('resultado').textContent = result;
            document.getElementById('info').textContent = `✅ Desofuscado usando: ${detectedMethod}`;
        }
    } catch (error) {
        document.getElementById('resultado').textContent = `Erro na requisição: ${error.message}`;
    }
}

// Dumpar Globais (Versão Formatada)
async function dumpar() {
    const codigo = document.getElementById('codigo').value;
    
    if (!codigo) {
        alert("Cole um código primeiro!");
        return;
    }

    try {
        const resposta = await fetch("/api/dumper", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: codigo }),
        });

        const { resultado, error } = await resposta.json();
        
        if (error) {
            document.getElementById('resultado').textContent = `Erro: ${error}`;
        } else {
            // Adiciona formatação visual com emojis e espaçamento
            const resultadoFormatado = resultado
                .replace(/🔹 Função/g, '\n\n🔹 Função')
                .replace(/🔸 Variável/g, '\n\n🔸 Variável');
            
            document.getElementById('resultado').textContent = resultadoFormatado;
        }
    } catch (error) {
        document.getElementById('resultado').textContent = `Erro na requisição: ${error.message}`;
    }
}

// Analisar Bytecode (Simulação)
async function analisarBytecode() {
    const codigo = document.getElementById('codigo').value;
    
    if (!codigo) {
        alert("Cole um código primeiro!");
        return;
    }

    try {
        const resposta = await fetch("/api/bytecode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: codigo }),
        });

        const { bytecode, error } = await resposta.json();
        
        if (error) {
            document.getElementById('resultado').textContent = `Erro: ${error}`;
        } else {
            document.getElementById('resultado').textContent = `⚙️ Bytecode Lua:\n${bytecode}`;
        }
    } catch (error) {
        document.getElementById('resultado').textContent = `Erro na requisição: ${error.message}`;
    }
}
