// ==============================
// 1️⃣ INFORME SEUS JOGOS AQUI
// Cada jogo deve ter 8 dezenas
// ==============================
//[12,19,21,35,40,53,58,59]
const meusJogos = [
    [3,22,26,29,31,34,38,48],
    [16,24,34,35,43,55],
    [3,16,21,29,37,58],
    [7,23,24,30,33,50],
    [4,7,17,33,40,52],
    [12,14,23,39,40,51],
    [2,30,33,43,45,54],
    [1,3,30,45,56,59],
    [11,17,30,39,54,59],
    [9,20,24,33,43,54],
    [7,16,32,38,51,55],
    [6,19,22,42,45,60],
    [8,17,23,44,45,49],
    [4,13,14,23,51,60],
    [14,19,20,24,35,48],
    [17,21,34,35,38,56],
    [11,26,29,32,58,59],
    [8,22,30,41,47,55],
    [6,13,15,32,34,50],
    [11,22,25,28,58,60],
    [10,12,14,21,51,53],
    [9,13,22,36,50,54],
    [5,8,24,31,53,55],
    [4,20,22,31,32,49],
    [5,15,22,34,37,47],
    [5,31,32,39,48,56],
    [6,7,36,45,49,53],
    [1,15,18,27,48,52],
    [8,10,23,28,37,60],
    [9,16,25,29,42,60],
    [12,14,40,41,47,60],
    [13,16,17,21,40,47],
    [4,31,36,46,51,52],
    [7,25,34,40,49,53],
    [12,17,31,34,39,51],
    [5,14,26,28,31,48],
    [4,25,37,44,45,57],
    [12,17,33,51,52,55]
];

// ==============================
// 2️⃣ INFORME O SORTEIO AQUI
// (6 dezenas da Mega-Sena)
// ==============================
//const dezenasSorteadas = [16,24,27,31,45,46];
var dezenasSorteadas = [];
var resultadoFinal = [];
var title = document.getElementById('title');

// ==============================
// 3️⃣ FUNÇÃO DE CONFERÊNCIA
// ==============================
function conferirJogos(jogos, sorteio) {
  return jogos.map((jogo, index) => {
    const acertos = jogo.filter(num => sorteio.includes(num));
    const totalAcertos = acertos.length;

    let resultado = "Não premiado";
    if (totalAcertos === 4) resultado = "Quadra";
    if (totalAcertos === 5) resultado = "Quina";
    if (totalAcertos >= 6) resultado = "Sena";

    return {
      jogo: index + 1,
      dezenas: jogo,
      acertos: acertos,
      totalAcertos,
      resultado
    };
  });
}

// ==============================
// 4️⃣ EXECUÇÃO
// ==============================
function executar() {
    const input = document.getElementById('numeros-sorteados');
    if(!input.value) {
        alert("Por favor, insira as dezenas sorteadas no formato: 9,10,15,46,49,51");
        return;
    }
    dezenasSorteadas = input.value.trim().split(',').map(Number);; 
    resultadoFinal = conferirJogos(meusJogos, dezenasSorteadas);
    renderizarJogos(resultadoFinal);
    console.log("🎯 Resultado do Sorteio:", dezenasSorteadas);
    console.table(resultadoFinal);
}

// ==============================
// 5️⃣ EXIBIÇÃO
// ==============================


const container = document.getElementById('container-jogos');

// antiga sem a coroa 
// function renderizarJogos() {
//   container.innerHTML = resultadoFinal.map(item => {
//       const ePremiado = item.resultado !== 'Não premiado';
      
//       return `
//           <div class="card ${ePremiado ? 'premiado' : ''}">
//               <div class="header">
//                   <span class="jogo-num">Jogo #${item.jogo}</span>
//                   <span class="status">${item.resultado}</span>
//               </div>
//               <div class="dezenas">
//                   ${item.dezenas.map(num => {
//                       // Verifica se o número atual está na lista de acertos
//                       const classeAcerto = item.acertos.includes(num) ? 'acerto' : '';
//                       return `<div class="bola ${classeAcerto}">${num.toString().padStart(2, '0')}</div>`;
//                   }).join('')}
//               </div>
//               <div class="footer">
//                   Total de acertos: <strong>${item.totalAcertos}</strong>
//               </div>
//           </div>
//       `;
//   }).join('');
// }

function renderizarJogos() {
    container.innerHTML = resultadoFinal.map(item => {
        const ePremiado = item.resultado !== 'Não premiado';
        
        // Criamos a variável da coroa: se for premiado, ela recebe o HTML, senão fica vazia
        const coroaHtml = ePremiado ? '<div class="coroa">👑</div>' : '';
        
        return `
            <div class="card ${ePremiado ? 'premiado' : ''}">
                ${coroaHtml} <div class="header">
                    <span class="jogo-num">Jogo #${item.jogo}</span>
                    <span class="status">${item.resultado}</span>
                </div>
                
                <div class="dezenas">
                    ${item.dezenas.map(num => {
                        const classeAcerto = item.acertos.includes(num) ? 'acerto' : '';
                        return `<div class="bola ${classeAcerto}">${num.toString().padStart(2, '0')}</div>`;
                    }).join('')}
                </div>
                
                <div class="footer">
                    Total de acertos: <strong>${item.totalAcertos}</strong>
                </div>
            </div>
        `;
    }).join('');
}

async function buscarUltimoResultadoCaixa() {
    try {
        const response = await fetch(`https://loteriascaixa-api.herokuapp.com/api/megasena/latest`);
        const dados = await response.json();
        const input = document.getElementById('numeros-sorteados');
        
        // As dezenas costumam vir como string ou array de strings
        dezenasSorteadas = dados.dezenas.map(Number);
        
        title.textContent = `Resultado do Sorteio ${dados.concurso}`;
        input.value = dezenasSorteadas.join(',');

        if (dezenasSorteadas.length > 0) {
            resultadoFinal = conferirJogos(meusJogos, dezenasSorteadas);
            renderizarJogos(resultadoFinal);
        }

        console.log(`Resultado do concurso ${dados.concurso}:`, dezenasSorteadas);
        return dezenasSorteadas;
    } catch (erro) {
        console.error("Erro ao buscar API:", erro);
    }
}

buscarUltimoResultadoCaixa();
