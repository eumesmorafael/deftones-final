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
}