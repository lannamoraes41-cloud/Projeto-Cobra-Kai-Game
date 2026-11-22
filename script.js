/* ==========================
        COBRA KAI
========================== */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tamanho = 30;
const total = canvas.width / tamanho;

let cobra;
let direcaoX;
let direcaoY;
let comida;
let pontos = 0;
let jogo;
let velocidade;

let jogoIniciado = false;
let ranking = [];

let tipoComida = "🍎";
let valorComida = 1;

// INICIAR JOGO

function iniciarJogo() {

   cobra = [
    {x:10, y:10}
];

    direcaoX = 1;
    direcaoY = 0;

    pontos = 0;
    velocidade = 250;
    jogoIniciado = true;

    gerarComida();

    document.getElementById("pontuacao").innerHTML =
        "Pontuação: " + pontos;

    clearInterval(jogo);

    jogo = setInterval(atualizar, velocidade);

    desenhar();
}

// GERAR COMIDAS

function gerarComida() {

    // Evitar comida em cima da cobra
    do {
        comida = {
            x: Math.floor(Math.random() * total),
            y: Math.floor(Math.random() * total)
        };

    } while (
        cobra.some(parte =>
            parte.x === comida.x &&
            parte.y === comida.y
        )
    );

    let sorteio = Math.random();

    if (sorteio < 0.70) {

        tipoComida = "🍎";
        valorComida = 1;

    } else if (sorteio < 0.95) {

        tipoComida = "⭐";
        valorComida = 5;

    } else {

        tipoComida = "💎";
        valorComida = 10;
    }
}

// BOTAO COMECAR JOGO

function comecarJogo() {

    let nome = document.getElementById("nomeJogador")
        .value.trim();

    if (nome === "") {
        alert("Digite seu nome para começar!");
        return;
    }

    iniciarJogo();
}

// ATUALIZAR RANKING

function atualizarRanking() {

    ranking.sort((a, b) => b.pontos - a.pontos);

    const rankingElemento =
        document.getElementById("ranking");

    rankingElemento.innerHTML = "";

    if (ranking.length === 0) {
        rankingElemento.textContent =
            "Nenhum jogador ainda";
        return;
    }

    ranking.forEach((jogador, indice) => {

        const item = document.createElement("div");
        item.className = "item-ranking";

        const posicao = document.createElement("strong");
        posicao.textContent = `${indice + 1}º Lugar`;

        item.appendChild(posicao);
        item.appendChild(document.createElement("br"));

        item.appendChild(
            document.createTextNode(jogador.nome)
        );

        item.appendChild(document.createElement("br"));

        item.appendChild(
            document.createTextNode(
                `${jogador.pontos} pontos`
            )
        );

        rankingElemento.appendChild(item);
    });
}

// QUADRICULADO DO TABULEIRO

function desenharGrade() {

    ctx.strokeStyle = "rgba(57, 255, 136, 0.12)";
    ctx.lineWidth = 1;

    // Linhas verticais
    for (let x = 0; x <= canvas.width; x += tamanho) {

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Linhas horizontais
    for (let y = 0; y <= canvas.height; y += tamanho) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// DESENHAR O JOGO


function desenhar() {

    // Fundo escuro e quadriculado
    ctx.fillStyle = "#020803";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    desenharGrade();

    // Desenhar as frutas
    ctx.font = "25px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        tipoComida,
        comida.x * tamanho + tamanho / 2,
        comida.y * tamanho + tamanho / 2
    );

    // Corpo da cobrinha ninja
    for (let indice = cobra.length - 1; indice > 0; indice--) {

        const parte = cobra[indice];
        const x = parte.x * tamanho + tamanho / 2;
        const y = parte.y * tamanho + tamanho / 2;

        ctx.save();

        ctx.shadowColor = "#39ff14";
        ctx.shadowBlur = 7;

        // Escamas verdes arredondadas
        ctx.fillStyle = indice % 2 === 0 ? "#39c928" : "#68ef36";
        ctx.strokeStyle = "#176c18";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Barriga amarela
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#f5d64b";

        ctx.beginPath();
        ctx.ellipse(x, y + 7, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Brilho das escamas
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.ellipse(x - 4, y - 5, 5, 3, -0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Cabeça da cobrinha ninja
    const cabeca = cobra[0];

    const x = cabeca.x * tamanho + tamanho / 2;
    const y = cabeca.y * tamanho + tamanho / 2;

    ctx.save();
    ctx.translate(x, y);

    // A cabeça acompanha a direção
    let angulo = 0;

    if (direcaoX === -1) angulo = Math.PI;
    if (direcaoY === 1) angulo = Math.PI / 2;
    if (direcaoY === -1) angulo = -Math.PI / 2;

    ctx.rotate(angulo);

    // Cabeça verde
    ctx.shadowColor = "#39ff14";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#53dc28";
    ctx.strokeStyle = "#145b13";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Faixa vermelha ninja
    ctx.fillStyle = "#e82929";
    ctx.fillRect(-11, -10, 22, 5);

    // Pontas da faixa
    ctx.beginPath();
    ctx.moveTo(-10, -8);
    ctx.lineTo(-17, -13);
    ctx.lineTo(-15, -5);
    ctx.closePath();
    ctx.fill();

    // Óculos escuros
    ctx.fillStyle = "#101010";

    ctx.beginPath();
    ctx.roundRect(-10, -5, 9, 8, 3);
    ctx.roundRect(2, -5, 9, 8, 3);
    ctx.fill();

    // Ponte dos óculos
    ctx.strokeStyle = "#101010";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-1, -2);
    ctx.lineTo(2, -2);
    ctx.stroke();

    // Reflexo nos óculos
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillRect(-8, -4, 3, 2);
    ctx.fillRect(4, -4, 3, 2);

    // Focinho
    ctx.fillStyle = "#79ef47";
    ctx.beginPath();
    ctx.ellipse(10, 5, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Narina
    ctx.fillStyle = "#16591c";
    ctx.beginPath();
    ctx.arc(12, 3, 1, 0, Math.PI * 2);
    ctx.fill();

    // Sorriso
    ctx.strokeStyle = "#173b16";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(6, 5, 5, 0.2, 1.5);
    ctx.stroke();

    // Língua vermelha bifurcada
    ctx.strokeStyle = "#ff4242";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(13, 9);
    ctx.lineTo(19, 12);
    ctx.lineTo(23, 9);
    ctx.moveTo(19, 12);
    ctx.lineTo(22, 15);
    ctx.stroke();

    ctx.restore();

    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
}


// MOVIMENTACAO DA COBRINHA

function atualizar() {

    if (!jogoIniciado) return;

    let cabeca = {
        x: cobra[0].x + direcaoX,
        y: cobra[0].y + direcaoY
    };

    // Colisao com as paredes
    if (
        cabeca.x < 0 ||
        cabeca.y < 0 ||
        cabeca.x >= total ||
        cabeca.y >= total
    ) {
        finalizarJogo();
        return;
    }

    // Verificar se vai comer
    const vaiComer =
        cabeca.x === comida.x &&
        cabeca.y === comida.y;

    // Ao nao comer, a cauda vai sair da posicao
    const corpoVerificado = vaiComer
        ? cobra
        : cobra.slice(0, -1);

    // Colisao com o proprio corpo
    for (let parte of corpoVerificado) {

        if (
            parte.x === cabeca.x &&
            parte.y === cabeca.y
        ) {
            finalizarJogo();
            return;
        }
    }

    // Nova posicao da cabeca
    cobra.unshift(cabeca);

    if (vaiComer) {

        pontos += valorComida;

        document.getElementById("pontuacao").innerHTML =
            "Pontuação: " + pontos;

        // Aumentar velocidade
        if (
            pontos % 5 === 0 &&
            velocidade > 60
        ) {
            velocidade -= 10;

            clearInterval(jogo);

            jogo = setInterval(
                atualizar,
                velocidade
            );
        }

        gerarComida();

    } else {

        // Remove a ultima parte
        cobra.pop();
    }

    desenhar();
}

// FINALIZAR JOGO

function finalizarJogo() {

    if (!jogoIniciado) return;

    clearInterval(jogo);
    jogoIniciado = false;

    let nome = document.getElementById("nomeJogador")
        .value.trim();

    ranking.push({
        nome: nome || "Sem Nome",
        pontos: pontos
    });

    atualizarRanking();

    alert("Game Over! Sua pontuação foi: " + pontos);
}

// CONTROLES DO TECLADO

document.addEventListener("keydown", (evento) => {

    if (!jogoIniciado) return;

    const teclas = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
    ];

    if (!teclas.includes(evento.key)) return;

    // Evitar que as setas rolem a pagina
    evento.preventDefault();

    switch (evento.key) {

        case "ArrowUp":
            if (direcaoY === 0) {
                direcaoX = 0;
                direcaoY = -1;
            }
            break;

        case "ArrowDown":
            if (direcaoY === 0) {
                direcaoX = 0;
                direcaoY = 1;
            }
            break;

        case "ArrowLeft":
            if (direcaoX === 0) {
                direcaoX = -1;
                direcaoY = 0;
            }
            break;

        case "ArrowRight":
            if (direcaoX === 0) {
                direcaoX = 1;
                direcaoY = 0;
            }
            break;
    }
});

// BOTAO REINICIAR JOGO

function reiniciarJogo() {

    let nome = document.getElementById("nomeJogador")
        .value.trim();

    if (nome === "") {
        alert("Digite seu nome para começar!");
        return;
    }

    iniciarJogo();
}
