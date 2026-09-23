const bancoPerguntas = [
  {
    pergunta: 'Qual é a classificação da palavra “café”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Oxítona',
    explicacao: 'A sílaba tônica está na última sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “mesa”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Paroxítona',
    explicacao: 'A sílaba tônica está na penúltima sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “música”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Proparoxítona',
    explicacao: 'A sílaba tônica está na antepenúltima sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “papel”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Oxítona',
    explicacao: 'A sílaba tônica está na última sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “lâmpada”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Proparoxítona',
    explicacao: 'A sílaba tônica está na antepenúltima sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “janela”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Paroxítona',
    explicacao: 'A sílaba tônica está na penúltima sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “sofá”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Oxítona',
    explicacao: 'A sílaba tônica está na última sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “fácil”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Paroxítona',
    explicacao: 'A sílaba tônica está na penúltima sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “pássaro”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Proparoxítona',
    explicacao: 'A sílaba tônica está na antepenúltima sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “coração”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Oxítona',
    explicacao: 'A sílaba tônica está na última sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “tênis”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Paroxítona',
    explicacao: 'A sílaba tônica está na penúltima sílaba.'
  },
  {
    pergunta: 'Qual palavra está escrita corretamente?',
    alternativas: ['pássaro', 'passáro', 'pássáro'],
    correta: 'pássaro',
    explicacao: 'Pássaro é uma palavra proparoxítona e recebe acento na primeira sílaba.'
  },
  {
    pergunta: 'Qual palavra está escrita corretamente?',
    alternativas: ['vôce', 'você', 'voçê'],
    correta: 'você',
    explicacao: 'Você recebe acento circunflexo na última sílaba.'
  },
  {
    pergunta: 'Como se separa a palavra “janela”?',
    alternativas: ['ja-ne-la', 'jan-e-la', 'ja-nel-a'],
    correta: 'ja-ne-la',
    explicacao: 'A separação silábica correta é ja-ne-la.'
  },
];

const perguntas = [...bancoPerguntas]
  .sort(() => Math.random() - 0.5)
  .slice(0, 6);

let indice = 0;
let pontuacao = 0;
let sequencia = 0;
const roupinhas = [
  { emoji: '🧢', nome: 'Boné da concentração' },
  { emoji: '🧥', nome: 'Jaqueta das palavras' },
  { emoji: '👟', nome: 'Tênis da velocidade' },
  { emoji: '🕶️', nome: 'Óculos do desafio' }
];
let roupasDesbloqueadas = [];

const perguntaEl = document.getElementById('quizPergunta');
const opcoesEl = document.getElementById('quizOpcoes');
const feedbackEl = document.getElementById('quizFeedback');
const numEl = document.getElementById('questaoNum');
const pontuacaoEl = document.getElementById('pontuacaoQuizAtual');
const progressFillEl = document.getElementById('progressFill');
const sequenciaEl = document.getElementById('sequenciaAtual');
const roupinhaAtualEl = document.getElementById('roupinhaAtual');
const roupinhasEl = document.getElementById('roupinhas');
const reiniciarEl = document.getElementById('reiniciarQuiz');

reiniciarEl.addEventListener('click', () => {
  window.location.reload();
});

function renderRoupinhas() {
  roupinhasEl.innerHTML = roupasDesbloqueadas.length
    ? roupasDesbloqueadas.map((roupa) => `<span class="roupinha">${roupa}</span>`).join('')
    : '<span class="roupinha vazia">?</span>';
}

async function carregarRoupinhas() {
  try {
    let resposta = await apiRequest('/roupinhas');
    const servidor = resposta.roupinhas || [];
    roupasDesbloqueadas = servidor.map((roupa) => roupa.emoji);
    localStorage.setItem('letrikaRoupinhas', JSON.stringify(roupasDesbloqueadas));
    renderRoupinhas();
  } catch (error) {
    console.error('Erro ao carregar roupinhas:', error);
  }
}

async function desbloquearRoupinha() {
  const proxima = roupinhas.find((roupa) => !roupasDesbloqueadas.includes(roupa.emoji));
  if (!proxima) return false;

  try {
    await apiRequest('/roupinhas', {
      method: 'POST',
      body: JSON.stringify(proxima)
    });
    const resposta = await apiRequest('/roupinhas');
    roupasDesbloqueadas = (resposta.roupinhas || []).map((roupa) => roupa.emoji);
    localStorage.setItem('letrikaRoupinhas', JSON.stringify(roupasDesbloqueadas));
    roupinhaAtualEl.textContent = `Você ganhou a roupinha ${proxima.emoji}!`;
    renderRoupinhas();
    return true;
  } catch (error) {
    console.error('Erro ao guardar roupinha:', error);
    roupinhaAtualEl.textContent = 'Não foi possível guardar a roupinha. Tente novamente.';
    return false;
  }
}

function renderPergunta() {
  if (indice >= perguntas.length) {
    perguntaEl.textContent = 'Quiz concluído!';
    opcoesEl.innerHTML = '';
    feedbackEl.textContent = `Sua pontuação final foi ${pontuacao} pontos.`;
    salvarPontuacao('2', pontuacao).then(() => {
      feedbackEl.textContent += ' Pontuação salva no ranking!';
    });
    return;
  }

  const atual = perguntas[indice];
  numEl.textContent = `Questão ${indice + 1}`;
  perguntaEl.textContent = atual.pergunta;
  pontuacaoEl.textContent = `${pontuacao} pts`;
  sequenciaEl.textContent = sequencia;
  progressFillEl.style.width = `${((indice + 1) / perguntas.length) * 100}%`;

  opcoesEl.innerHTML = '';
  atual.alternativas.forEach((alternativa) => {
    const btn = document.createElement('button');
    btn.className = 'opcao';
    btn.textContent = alternativa;
    btn.addEventListener('click', () => responder(alternativa, atual));
    opcoesEl.appendChild(btn);
  });
}

async function responder(alternativa, atual) {
  const correta = alternativa === atual.correta;

  if (correta) {
    pontuacao += 10;
    sequencia += 1;
    feedbackEl.textContent = `Correto! ${atual.explicacao}`;
    if (sequencia % 2 === 0) {
      const desbloqueada = await desbloquearRoupinha();
      if (desbloqueada) {
        feedbackEl.textContent += ' Sequência de acertos: nova roupinha desbloqueada!';
      }
    }
  } else {
    sequencia = 0;
    feedbackEl.textContent = `Incorreto! ${atual.explicacao}`;
  }

  pontuacaoEl.textContent = `${pontuacao} pts`;
  sequenciaEl.textContent = sequencia;
  opcoesEl.innerHTML = '';
  indice += 1;

  setTimeout(renderPergunta, 1200);
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
    feedbackEl.textContent += ' Não foi possível salvar a pontuação.';
    return false;
  }
}

async function iniciarQuiz() {
  try {
    await window.authReady;
    await carregarRoupinhas();
    renderPergunta();
  } catch (error) {
    console.error('Sessão inválida:', error);
  }
}

iniciarQuiz();
