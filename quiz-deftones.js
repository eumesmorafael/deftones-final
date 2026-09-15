const SUPABASE_URL = "https://izygiovnunsiesmcxtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_epoxrccf0Y-BrHq6QnqgXg_6sU6Fepa";

function checkquiz() {
    let pontos = 0;

    for (let i = 1; i <= 10; i++) {
        const resposta = document.querySelector(`input[name="q${i}"]:checked`);

        if (resposta && resposta.value === "certo") {
            pontos++;
        }
    }

    const resultado = document.getElementById("resultado");
    const portugues = document.documentElement.lang.toLowerCase().startsWith("pt");
    resultado.textContent = portugues
        ? `Você acertou ${pontos} de 10 questões!`
        : `You got ${pontos} out of 10 questions correct!`;

    salvarResultado(pontos, portugues);

    const link = new URL(window.location.href);
    link.hash = `resultado=${pontos}`;

    let compartilhar = document.getElementById("compartilhar-resultado");
    if (!compartilhar) {
        compartilhar = document.createElement("button");
        compartilhar.id = "compartilhar-resultado";
        compartilhar.type = "button";
        compartilhar.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(link.href);
                compartilhar.textContent = portugues ? "Link copiado!" : "Link copied!";
            } catch {
                window.prompt(
                    portugues ? "Copie este link e envie para sua amiga:" : "Copy this link and send it to your friend:",
                    link.href
                );
            }
        });
        resultado.insertAdjacentElement("afterend", compartilhar);
    }

    compartilhar.textContent = portugues
        ? "Copiar link para enviar o resultado"
        : "Copy link to share the result";
}

async function salvarResultado(pontos, portugues) {
    try {
        const resposta = await fetch(`${SUPABASE_URL}/rest/v1/quiz_resultados`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                apikey: SUPABASE_PUBLISHABLE_KEY,
                Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
                Prefer: "return=minimal"
            },
            body: JSON.stringify({
                pontos,
                total_questoes: 10,
                idioma: portugues ? "pt" : "en"
            })
        });

        if (!resposta.ok) {
            throw new Error(`Supabase respondeu com ${resposta.status}`);
        }
    } catch (erro) {
        console.error("Não foi possível salvar o resultado no Supabase:", erro);
    }
}

function showSharedResult() {
    const resultado = document.getElementById("resultado");
    const pontos = new URLSearchParams(window.location.hash.slice(1)).get("resultado");

    if (!resultado || pontos === null || !/^([0-9]|10)$/.test(pontos)) {
        return;
    }

    const portugues = document.documentElement.lang.toLowerCase().startsWith("pt");
    resultado.textContent = portugues
        ? `Resultado recebido: sua amiga acertou ${pontos} de 10 questões!`
        : `Received result: your friend got ${pontos} out of 10 questions correct!`;
}

window.addEventListener("DOMContentLoaded", showSharedResult);