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

    // Fundo escuro
    ctx.fillStyle = "#020803";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quadriculado
    desenharGrade();

    // DESENHAR COMIDA
    ctx.font = "25px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        tipoComida,
        comida.x * tamanho + tamanho / 2,
        comida.y * tamanho + tamanho / 2
    );

    // DESENHAR CORPO DA COBRINHA
    cobra.forEach((parte, indice) => {

        // A cabeca sera desenhada depois
        if (indice === 0) return;

        let x = parte.x * tamanho;
        let y = parte.y * tamanho;

        // Corpo verde neon
        ctx.fillStyle = "#39ff14";
        ctx.shadowColor = "#39ff14";
        ctx.shadowBlur = 4;

        ctx.beginPath();

        ctx.roundRect(
            x + 4,
            y + 4,
            tamanho - 8,
            tamanho - 8,
            6
        );

        ctx.fill();

        // Reflexo na parte superior
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.20)";

        ctx.beginPath();

        ctx.roundRect(
            x + 6,
            y + 5,
            tamanho - 12,
            5,
            3
        );

        ctx.fill();
    });

   
    const cabeca = cobra[0];

    ctx.shadowBlur = 0;
    ctx.font = "27px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "🐍",
        cabeca.x * tamanho + tamanho / 2,
        cabeca.y * tamanho + tamanho / 2
    );

    ctx.shadowBlur = 0;
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
