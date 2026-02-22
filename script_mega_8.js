/**
 * GERADOR MEGA-SENA 8 DEZENAS - SISTEMA COMPLETO 2026
 * Inclui: Ineditismo, Vizinhos, Somas Parciais, Quadrantes, Linhas, Primos e Paridade.
 */

// // 1. Base de Dados de Primos
// const PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];

// 2. HISTÓRICO REAL (Insira aqui os sorteios anteriores como arrays de números)
// Exemplo: const historicoReal = [[1,2,3,4,5,6], [10,20,30,40,50,60]];

function executar_apostas8() {

    let numJogos    = parseInt(document.getElementById("numApostas8").value);
    let divLoading  = document.getElementById("loading8");
    let divResult   = document.getElementById("result8");

    divResult.innerHTML  = "";
    divLoading.innerHTML = `<h3> ... processando ... </h3>`;

    for (let i = 0; i < numJogos; i++) {
        const aposta8 = gerarApostaInteligente8();
        console.log(`Jogo ${i + 1}:`, aposta8.numeros.join(" - "), " | Dados Técnicos:", aposta8.metrica);
        // divResult.innerHTML += `<p><strong>Jogo ${i + 1}:</strong> ${aposta8.numeros.join(" - ")} <br><em>Dados Técnicos:</em> ${JSON.stringify(aposta8.metrica)}</p>`;
        divResult.innerHTML += `<p><strong>Jogo ${i + 1}:</strong> ${aposta8.numeros.join(" - ")} <br></p>`;
    }

    divLoading.innerHTML = ``;

}

function gerarApostaInteligente8() {

    while (true) {
        let jogo = [];
        while (jogo.length < 8) {
            let n = Math.floor(Math.random() * 60) + 1;
            if (!jogo.includes(n)) jogo.push(n);
        }
        jogo.sort((a, b) => a - b);

        // 1. SOMA TOTAL (185 - 305)
        const soma = jogo.reduce((a, b) => a + b, 0);
        if (soma < 185 || soma > 305) continue;

        // 2. SOMAS PARCIAIS (Equilíbrio de Pesos 4/4)
        const somaInicial = jogo[0] + jogo[1] + jogo[2] + jogo[3];
        const somaFinal = jogo[4] + jogo[5] + jogo[6] + jogo[7];
        if (somaInicial < 60 || somaInicial > 120) continue;
        if (somaFinal < 130 || somaFinal > 210) continue;

        // 3. VIZINHOS (Max 1 par consecutivo apenas - Ex: 22, 23)
        let paresConsecutivos = 0;
        for (let i = 0; i < jogo.length - 1; i++) {
            if (jogo[i+1] === jogo[i] + 1) paresConsecutivos++;
        }
        if (paresConsecutivos > 1) continue; 

        // 4. PARIDADE (Entre 3P/5I e 5P/3I)
        const pares = jogo.filter(n => n % 2 === 0).length;
        if (pares < 3 || pares > 5) continue;

        // 5. PRIMOS (1 a 4)
        const totalPrimos = jogo.filter(n => PRIMOS.includes(n)).length;
        if (totalPrimos < 1 || totalPrimos > 4) continue;

        // 6. DISTRIBUIÇÃO POR LINHAS (Max 3 por linha e min 4 linhas ocupadas)
        let linhas = {};
        jogo.forEach(n => {
            let l = Math.ceil(n / 10);
            linhas[l] = (linhas[l] || 0) + 1;
        });
        if (Object.values(linhas).some(v => v > 3) || Object.keys(linhas).length < 4) continue;

        // 7. QUADRANTES (Obrigatório ocupar os 4)
        let quadrantes = new Set();
        jogo.forEach(n => {
            let linha = Math.ceil(n / 10);
            let col = n % 10 || 10;
            if (linha <= 3 && col <= 5) quadrantes.add("Q1");
            else if (linha <= 3 && col > 5) quadrantes.add("Q2");
            else if (linha > 3 && col <= 5) quadrantes.add("Q3");
            else quadrantes.add("Q4");
        });
        if (quadrantes.size < 4) continue;

        // 8. FINAIS (Max 2 por coluna)
        const finais = jogo.map(n => n % 10);
        const contagemFinais = {};
        let finalRuim = false;
        for (let f of finais) {
            contagemFinais[f] = (contagemFinais[f] || 0) + 1;
            if (contagemFinais[f] > 2) finalRuim = true;
        }
        if (finalRuim) continue;

        // 9. INEDITISMO (Checagem contra histórico)
        // Como o jogo tem 8 dezenas, verificamos se alguma combinação de 6 números nele já saiu
        if (historicoReal.length > 0) {
            let jaGanhou = false;
            // Lógica simplificada: se as 6 dezenas do sorteio histórico estão contidas nas nossas 8
            for (let sorteio of historicoReal) {
                let acertos = sorteio.filter(n => jogo.includes(n)).length;
                if (acertos >= 6) {
                    jaGanhou = true;
                    break;
                }
            }
            if (jaGanhou) continue;
        }

        //return { dezenas: jogo, status: "Aprovado" };

        // SE CHEGOU AQUI, O JOGO É DE ELITE
        return {
            numeros: jogo,
            metrica: {
                soma: soma,
                paridade: `${pares}P / ${8-pares}I`,
                primos: totalPrimos,
                quadrantes: quadrantes.size,
                analise: "Aprovado em todos os filtros estatísticos"
            }
        };
    }
}