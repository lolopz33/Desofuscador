async function desofuscar() {
    const codigo = document.getElementById("codigo").value;
    const metodo = document.getElementById("metodo").value;
    
    if (!codigo) {
        alert("Cole um código primeiro!");
        return;
    }

    const resposta = await fetch("/api/desofuscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, metodo }),
    });

    const { resultado, erro } = await resposta.json();
    document.getElementById("resultado").textContent = erro || resultado;
}

async function dumpar() {
    const codigo = document.getElementById("codigo").value;
    
    if (!codigo) {
        alert("Cole um código primeiro!");
        return;
    }

    const resposta = await fetch("/api/dumper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
    });

    const { funcoes, erro } = await resposta.json();
    
    if (erro) {
        document.getElementById("resultado").textContent = `Erro: ${erro}`;
    } else {
        document.getElementById("resultado").textContent = `Funções encontradas:\n${funcoes.join("\n")}`;
    }
}
