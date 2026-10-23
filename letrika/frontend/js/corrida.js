const bancoPalavras = [
  { palavra: 'cafe', correta: 'café', opcoes: ['cafe', 'café', 'cafê'] },
  { palavra: 'voce', correta: 'você', opcoes: ['voçe', 'você', 'voce'] },
  { palavra: 'arvore', correta: 'árvore', opcoes: ['arvore', 'árvore', 'arvoree'] },
  { palavra: 'lapis', correta: 'lápis', opcoes: ['lapis', 'lápis', 'lapís'] },
  { palavra: 'portugues', correta: 'português', opcoes: ['portugues', 'português', 'portuguêss'] },
  { palavra: 'acucar', correta: 'açúcar', opcoes: ['açucar', 'açúcar', 'acúcar'] },
  { palavra: 'onibus', correta: 'ônibus', opcoes: ['ônibus', 'onibus', 'ônibús'] },
  { palavra: 'tambem', correta: 'também', opcoes: ['tambem', 'támbem', 'também'] },
  { palavra: 'historia', correta: 'história', opcoes: ['história', 'historia', 'históriá'] },
  { palavra: 'infancia', correta: 'infância', opcoes: ['infancia', 'infáncia', 'infância'] },
  { palavra: 'heroi', correta: 'herói', opcoes: ['heroi', 'herói', 'héroi'] },
  { palavra: 'bau', correta: 'baú', opcoes: ['báu', 'bau', 'baú'] },
  { palavra: 'voo', correta: 'voo', opcoes: ['vôo', 'voô', 'voo'] },
  { palavra: 'assembleia', correta: 'assembleia', opcoes: ['assembléia', 'assembleia', 'assémbleia'] },
  { palavra: 'ideia', correta: 'ideia', opcoes: ['idéia', 'ideía', 'ideia'] },
  { palavra: 'jiboia', correta: 'jiboia', opcoes: ['jibóia', 'jiboia', 'jiboía'] }
];

let palavras = [];

let index = 0;
let score = 0;
let lives = 3;
let fase = 1;
let runnerProgress = 8;
let guardProgress = 0;
let mistakes = 0;
let gameOver = false;
let corridaIniciada = false;
let answerLocked = true;
let lastFrame = performance.now();
let audioContext;

const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const faseEl = document.getElementById('fase');
const distanciaEl = document.getElementById('distancia');
const perguntaTexto = document.getElementById('perguntaTexto');
const opcoesEl = document.getElementById('opcoes');
const resultadoEl = document.getElementById('resultado');
const runnerEl = document.getElementById('runner');
const guardEl = document.getElementById('guard');
const finishFlagEl = document.getElementById('finishFlag');
const gameAreaEl = document.querySelector('.game-area');
const iniciarEl = document.getElementById('iniciarCorrida');
const reiniciarEl = document.getElementById('reiniciarCorrida');
const DISTANCIA_CHEGADA = 80;

reiniciarEl.addEventListener('click', () => {
  window.location.reload();
});

iniciarEl.addEventListener('click', iniciarJogo);
document.addEventListener('keydown', (event) => {
  if (corridaIniciada || gameOver || ![' ', 'Enter'].includes(event.key)) return;
  event.preventDefault();
  iniciarJogo();
});

function atualizarPista() {
  runnerEl.style.left = `${runnerProgress}%`;
  guardEl.style.left = `${guardProgress}%`;

  const distancia = runnerProgress - guardProgress;
  distanciaEl.textContent = distancia > 35 ? 'segura' : distancia > 15 ? 'atenção' : 'perigo';
  distanciaEl.className = distancia <= 15 ? 'perigo-texto' : '';
}

function tocarSom(frequencia, duracao = 0.12) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioContext = audioContext || new AudioContextClass();
  if (audioContext.state === 'suspended') audioContext.resume();
  const oscilador = audioContext.createOscillator();
  const ganho = audioContext.createGain();
  oscilador.frequency.value = frequencia;
  oscilador.type = 'sine';
  ganho.gain.setValueAtTime(0.06, audioContext.currentTime);
  ganho.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duracao);
  oscilador.connect(ganho);
  ganho.connect(audioContext.destination);
  oscilador.start();
  oscilador.stop(audioContext.currentTime + duracao);
}

function animarCorrida(agora) {
  if (gameOver) return;

  const delta = Math.min((agora - lastFrame) / 1000, 0.1);
  lastFrame = agora;
  fase = Math.min(5, Math.floor(runnerProgress / 18) + 1);
  faseEl.textContent = fase;
  runnerProgress = Math.min(88, runnerProgress + (1.8 + fase * 0.25 + score / 120) * delta);
  guardProgress = Math.min(runnerProgress - 1, guardProgress + (0.65 + mistakes * 0.45 + fase * 0.12) * delta);
  atualizarPista();

  if (runnerProgress - guardProgress <= 5) {
    finalizarCorrida('O guarda alcançou você! Tente responder mais rápido.', true);
    return;
  }

  if (runnerProgress >= DISTANCIA_CHEGADA) {
    finalizarCorrida('Você cruzou a linha de chegada!');
    return;
  }

  requestAnimationFrame(animarCorrida);
}

function finalizarCorrida(mensagem, capturado = false) {
  if (gameOver) return;
  gameOver = true;
  corridaIniciada = false;
  answerLocked = true;
  gameAreaEl.classList.remove('corrida-ativa');
  iniciarEl.disabled = true;
  resultadoEl.textContent = `${mensagem} Pontuação final: ${score}.`;
  opcoesEl.querySelectorAll('button').forEach((button) => {
    button.disabled = true;
  });
  if (capturado) {
    tocarSom(160, 0.3);
    guardEl.classList.add('capturou');
  } else {
    tocarSom(880, 0.35);
    runnerProgress = 84;
    atualizarPista();
    finishFlagEl.classList.add('chegada');
  }
  salvarPontuacao('1', score).then(() => {
    resultadoEl.textContent += ' Pontuação salva no ranking!';
  });
}

function renderPergunta() {
  if (index >= palavras.length) {
    finalizarCorrida('Você cruzou a linha de chegada!');
    return;
  }

  const item = palavras[index];
  perguntaTexto.textContent = `Qual é a forma correta da palavra: ${item.palavra}?`;
  opcoesEl.innerHTML = '';

  item.opcoes.forEach((opcao) => {
    const btn = document.createElement('button');
    btn.className = 'opcao';
    btn.textContent = opcao;
    btn.addEventListener('click', () => responder(opcao, item));
    opcoesEl.appendChild(btn);
  });
}

function responder(opcao, item) {
  if (!corridaIniciada || gameOver || answerLocked) return;
  answerLocked = true;

  if (opcao === item.correta) {
    tocarSom(660);
    score += 10;
    runnerProgress = Math.min(88, runnerProgress + 10);
    guardProgress = Math.max(0, guardProgress - 3);
    resultadoEl.textContent = 'Correto! Você abriu distância do guarda.';
    runnerEl.textContent = '🏃💨';
    setTimeout(() => {
      runnerEl.textContent = '🏃';
    }, 500);
  } else {
    tocarSom(190, 0.22);
    lives -= 1;
    mistakes += 1;
    guardProgress = Math.min(runnerProgress - 1, guardProgress + 15);
    runnerProgress = Math.max(guardProgress + 1, runnerProgress - 3);
    resultadoEl.textContent = `Errado! A resposta correta era ${item.correta}.`;
    resultadoEl.textContent += ' O guarda se aproximou.';
  }

  atualizarPista();

  if (lives <= 0 || runnerProgress - guardProgress <= 5) {
    finalizarCorrida(lives <= 0 ? 'Você errou demais e o guarda pegou você!' : 'O guarda pegou você!', true);
    return;
  }

  if (runnerProgress >= DISTANCIA_CHEGADA) {
    finalizarCorrida('Você cruzou a linha de chegada!');
    return;
  }

  scoreEl.textContent = score;
  livesEl.textContent = lives;
  fase = Math.min(5, Math.floor(score / 30) + 1);
  faseEl.textContent = fase;
  index += 1;
  setTimeout(() => {
    answerLocked = false;
    renderPergunta();
  }, 900);
}

async function salvarPontuacao(jogoId, valor) {
  try {
    await apiRequest('/pontuacoes', {
      method: 'POST',
      body: JSON.stringify({ jogo_id: Number(jogoId), pontuacao: Number(valor) })
    });
    return true;
  } catch (error) {
    console.error('Erro ao salvar pontuação:', error);
    resultadoEl.textContent += ' Não foi possível salvar a pontuação.';
    return false;
  }
}

function iniciarJogo() {
  if (corridaIniciada || gameOver || !palavras.length) return;
  corridaIniciada = true;
  answerLocked = false;
  iniciarEl.disabled = true;
  iniciarEl.textContent = 'Corrida em andamento';
  gameAreaEl.classList.add('corrida-ativa');
  lastFrame = performance.now();
  renderPergunta();
  requestAnimationFrame(animarCorrida);
}

async function iniciarCorrida() {
  try {
    await window.authReady;
    let bancoCompleto = [...bancoPalavras];
    try {
      const dados = await apiRequest('/palavras-corrida');
      const chavesExistentes = new Set(bancoCompleto.map((item) => item.palavra.toLocaleLowerCase()));
      const cadastradas = (dados.palavras || []).filter((item) => {
        const textos = [item.palavra_incorreta, item.palavra_correta, item.alternativa_a, item.alternativa_b];
        return !textos.some((texto) => String(texto || '').includes('??'));
      }).map((item) => {
        const opcoes = [item.alternativa_a, item.alternativa_b];
        return {
          palavra: item.palavra_incorreta,
          correta: item.resposta_correta === 'A' ? item.alternativa_a : item.alternativa_b,
          opcoes
        };
      }).filter((item) => !chavesExistentes.has(item.palavra.toLocaleLowerCase()));
      bancoCompleto = [...bancoCompleto, ...cadastradas];
    } catch (error) {
      console.error('Não foi possível carregar palavras cadastradas:', error);
    }
    palavras = bancoCompleto.sort(() => Math.random() - 0.5);
    scoreEl.textContent = score;
    livesEl.textContent = lives;
    faseEl.textContent = fase;
    atualizarPista();
    opcoesEl.replaceChildren();
    resultadoEl.textContent = 'A corrida começa quando você clicar em Começar corrida ou pressionar Espaço.';
  } catch (error) {
    console.error('Sessão inválida:', error);
  }
}

iniciarCorrida();
