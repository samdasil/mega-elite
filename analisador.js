// Constantes necessárias para os filtros
// const PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59];
// const historicoReal = [
//     [1, 2, 3, 4, 5, 6], // Exemplo de jogo que já ocorreu
//     [10, 20, 30, 40, 50, 60]
// ];

/**
 * Analisa uma lista de jogos baseada nos filtros estatísticos
 * @param {Array} listaDeJogos - Array de arrays, ex: [[2,3,6,4,8,9], [10,11,12,13,14,15]]
 */
function analisarJogos(listaDeJogos) {
    return listaDeJogos.map((jogoOriginal, index) => {
        // Garantir que o jogo esteja ordenado para as análises de sequência e ineditismo
        const jogo = [...jogoOriginal].sort((a, b) => a - b);
        
        // --- CÁLCULOS DOS FILTROS ---

        // 1. Soma
        const somaVal = jogo.reduce((a, b) => a + b, 0);
        const filtroSoma = (somaVal >= 150 && somaVal <= 220);

        // 2. Paridade
        const pares = jogo.filter(n => n % 2 === 0).length;
        const filtroParidade = (pares >= 2 && pares <= 4);

        // 3. Sequências
        let seqCount = 0;
        for (let i = 0; i < jogo.length - 1; i++) {
            if (jogo[i + 1] === jogo[i] + 1) seqCount++;
        }
        const filtroSequencia = (seqCount <= 1);

        // 4. Primos
        const totalPrimos = jogo.filter(n => PRIMOS.includes(n)).length;
        const filtroPrimos = (totalPrimos >= 1 && totalPrimos <= 3);

        // 5. Finais
        const finais = jogo.map(n => n % 10);
        const contagemFinais = {};
        let finalRepetidoMaisQueDois = false;
        finais.forEach(f => {
            contagemFinais[f] = (contagemFinais[f] || 0) + 1;
            if (contagemFinais[f] > 2) finalRepetidoMaisQueDois = true;
        });
        const filtroFinais = !finalRepetidoMaisQueDois;

        // 6. Quadrantes
        let quadrantes = new Set();
        jogo.forEach(n => {
            let linha = Math.ceil(n / 10);
            let coluna = n % 10 || 10;
            if (linha <= 3 && coluna <= 5) quadrantes.add("Q1");
            else if (linha <= 3 && coluna > 5) quadrantes.add("Q2");
            else if (linha > 3 && coluna <= 5) quadrantes.add("Q3");
            else quadrantes.add("Q4");
        });
        const filtroQuadrantes = (quadrantes.size >= 3);

        // 7. Ineditismo
        const jogoStr = jogo.join(',');
        const jaOcorreu = historicoReal.some(sorteio => {
            return [...sorteio].sort((a, b) => a - b).join(',') === jogoStr;
        });
        const filtroIneditismo = !jaOcorreu;

        // --- RETORNO DO OBJETO JSON ---
        return {
            jogo: index + 1,
            dezenas: jogo,
            analiseFiltros: {
                soma: { valido: filtroSoma, valor: somaVal },
                paridade: { valido: filtroParidade, valor: `${pares}P / ${6 - pares}I` },
                sequencia: { valido: filtroSequencia, valor: seqCount },
                primos: { valido: filtroPrimos, valor: totalPrimos },
                finais: { valido: filtroFinais, detalhes: contagemFinais },
                quadrantes: { valido: filtroQuadrantes, quantidade: quadrantes.size },
                inedito: { valido: filtroIneditismo }
            },
            aprovadoGeral: (filtroSoma && filtroParidade && filtroSequencia && filtroPrimos && filtroFinais && filtroQuadrantes && filtroIneditismo)
        };
    });
}

// --- EXEMPLO DE USO ---
const meusJogos = [
    [2, 3, 6, 4, 8, 9],           // Jogo do seu exemplo anterior
    [15, 22, 31, 38, 45, 52],     // Jogo equilibrado
    [1, 2, 3, 4, 5, 6]            // Jogo que vai falhar em quase tudo
];

const resultadoAnalise = analisarJogos(meusJogos);
console.log(JSON.stringify(resultadoAnalise, null, 2));