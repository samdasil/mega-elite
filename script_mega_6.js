/**
 * GERADOR MEGA-SENA ELITE 2026 - VERSÃO FINAL
 * Instrução: Insira o histórico de sorteios no array 'historicoReal'
 */

// // 1. Base de Dados de Primos
// const PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];

// 2. HISTÓRICO REAL (Insira aqui os sorteios anteriores como arrays de números)
// Exemplo: const historicoReal = [[1,2,3,4,5,6], [10,20,30,40,50,60]];

function executar_apostas6() {

    let numJogos    = parseInt(document.getElementById("numApostas6").value);
    let divLoading  = document.getElementById("loading6");
    let divResult   = document.getElementById("result6");

    divResult.innerHTML  = "";
    divLoading.innerHTML = `<h3> ... processando ... </h3>`;

    for (let i = 0; i < numJogos; i++) {
        const aposta6 = gerarApostaInteligente6();
        console.log(`Jogo ${i + 1}:`, aposta6.numeros.join(" - "), " | Dados Técnicos:", aposta6.metrica);
        // divResult.innerHTML += `<p><strong>Jogo ${i + 1}:</strong> ${aposta6.numeros.join(" - ")} <br><em>Dados Técnicos:</em> ${JSON.stringify(aposta6.metrica)}</p>`;
        divResult.innerHTML += `<p><strong>Jogo ${i + 1}:</strong> ${aposta6.numeros.join(" - ")} <br></p>`;
    }

    divLoading.innerHTML = ``;

}

function gerarApostaInteligente6() {
    let tentativasTotal = 0;

    while (true) {
        tentativasTotal++;
        
        // Gerar 6 números únicos
        let jogo = [];
        while (jogo.length < 6) {
            let n = Math.floor(Math.random() * 60) + 1;
            if (!jogo.includes(n)) jogo.push(n);
        }
        jogo.sort((a, b) => a - b);

        // --- FILTRO 1: SOMA (150 a 220) ---
        const soma = jogo.reduce((a, b) => a + b, 0);
        if (soma < 150 || soma > 220) continue;

        // --- FILTRO 2: PARIDADE (Equilíbrio 3P/3I ou 4/2) ---
        const pares = jogo.filter(n => n % 2 === 0).length;
        if (pares < 2 || pares > 4) continue;

        // --- FILTRO 3: SEQUÊNCIAS (Max 2 números seguidos) ---
        let seq = 0;
        for (let i = 0; i < jogo.length - 1; i++) {
            if (jogo[i+1] === jogo[i] + 1) seq++;
        }
        if (seq > 1) continue;

        // --- FILTRO 4: PRIMOS (Entre 1 e 3 primos) ---
        const totalPrimos = jogo.filter(n => PRIMOS.includes(n)).length;
        if (totalPrimos < 1 || totalPrimos > 3) continue;

        // --- FILTRO 5: FINAIS (Max 2 dezenas com mesmo final) ---
        const finais = jogo.map(n => n % 10);
        const contagemFinais = {};
        let finalRepetido = false;
        for (let f of finais) {
            contagemFinais[f] = (contagemFinais[f] || 0) + 1;
            if (contagemFinais[f] > 2) finalRepetido = true;
        }
        if (finalRepetido) continue;

        // --- FILTRO 6: QUADRANTES (Mínimo de 3 quadrantes ocupados) ---
        let quadrantes = new Set();
        jogo.forEach(n => {
            let linha = Math.ceil(n / 10);
            let coluna = n % 10 || 10;
            if (linha <= 3 && coluna <= 5) quadrantes.add("Q1");
            else if (linha <= 3 && coluna > 5) quadrantes.add("Q2");
            else if (linha > 3 && coluna <= 5) quadrantes.add("Q3");
            else quadrantes.add("Q4");
        });
        if (quadrantes.size < 3) continue;

        // --- FILTRO 7: INEDITISMO (Comparação contra históricoReal) ---
        const jogoParaComparar = jogo.join(',');
        const jaOcorreu = historicoReal.some(sorteio => {
            return [...sorteio].sort((a,b) => a-b).join(',') === jogoParaComparar;
        });
        if (jaOcorreu) continue;

        // SE CHEGOU AQUI, O JOGO É DE ELITE
        return {
            numeros: jogo,
            metrica: {
                soma: soma,
                paridade: `${pares}P / ${6-pares}I`,
                primos: totalPrimos,
                quadrantes: quadrantes.size,
                analise: "Aprovado em todos os filtros estatísticos"
            }
        };
    }
}

// Executando para gerar 1 jogo de exemplo
// const minhaAposta = gerarApostaInteligente();
// console.log("=== JOGO INTELIGENTE GERADO (1º DE JANEIRO 2026) ===");
// console.log("NÚMEROS:", minhaAposta.numeros.join(" - "));
// console.log("DADOS TÉCNICOS:", minhaAposta.metrica);