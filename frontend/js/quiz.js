
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
  {
    pergunta: 'Qual é a classificação da palavra “jacaré”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Oxítona',
    explicacao: 'A sílaba mais forte é ré, a última sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “árvore”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Proparoxítona',
    explicacao: 'A sílaba mais forte é ár, a antepenúltima sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “brinquedo”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Paroxítona',
    explicacao: 'A sílaba mais forte é que, a penúltima sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “abacaxi”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Oxítona',
    explicacao: 'A sílaba mais forte é xi, a última sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “médico”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Proparoxítona',
    explicacao: 'A sílaba mais forte é mé, a antepenúltima sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “animal”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Oxítona',
    explicacao: 'A sílaba mais forte é mal, a última sílaba.'
  },
  {
    pergunta: 'Qual é a classificação da palavra “açúcar”?',
    alternativas: ['Oxítona', 'Paroxítona', 'Proparoxítona'],
    correta: 'Paroxítona',
    explicacao: 'A sílaba mais forte é ú, a penúltima sílaba.'
  },
  {
    pergunta: 'Qual palavra está escrita corretamente?',
    alternativas: ['lapis', 'lápis', 'lápís'],
    correta: 'lápis',
    explicacao: 'Lápis é uma palavra paroxítona terminada em “is” e recebe acento.'
  },
  {
    pergunta: 'Qual palavra está escrita corretamente?',
    alternativas: ['arvore', 'árvore', 'árvóre'],
    correta: 'árvore',
    explicacao: 'Árvore é proparoxítona; todas as proparoxítonas são acentuadas.'
  },
  {
    pergunta: 'Qual palavra está escrita corretamente?',
    alternativas: ['heroi', 'herói', 'heróí'],
    correta: 'herói',
    explicacao: 'Herói é uma oxítona com ditongo aberto “ói” e recebe acento.'
  },
  {
    pergunta: 'Qual palavra está escrita corretamente?',
    alternativas: ['bau', 'baú', 'baù'],
    correta: 'baú',
    explicacao: 'Baú recebe acento para marcar o hiato: ba-ú.'
  },
  {
    pergunta: 'Como se separa a palavra “boneca”?',
    alternativas: ['bo-ne-ca', 'bon-e-ca', 'bo-nec-a'],
    correta: 'bo-ne-ca',
    explicacao: 'Boneca tem três sílabas: bo-ne-ca.'
  },
  {
    pergunta: 'Como se separa a palavra “escola”?',
    alternativas: ['es-co-la', 'e-sco-la', 'es-col-a'],
    correta: 'es-co-la',
    explicacao: 'Escola tem três sílabas: es-co-la.'
  },
  {
    pergunta: 'Como se separa a palavra “abacaxi”?',
    alternativas: ['a-ba-ca-xi', 'ab-a-ca-xi', 'a-bac-ax-i'],
    correta: 'a-ba-ca-xi',
    explicacao: 'Abacaxi tem quatro sílabas: a-ba-ca-xi.'
  },
  {
    pergunta: 'Como se separa a palavra “pipoca”?',
    alternativas: ['pi-po-ca', 'pip-o-ca', 'pi-poc-a'],
    correta: 'pi-po-ca',
    explicacao: 'Pipoca tem três sílabas: pi-po-ca.'
  },
  {
    pergunta: 'Como se separa a palavra “borboleta”?',
    alternativas: ['bor-bo-le-ta', 'borb-o-le-ta', 'bor-bo-let-a'],
    correta: 'bor-bo-le-ta',
    explicacao: 'Borboleta tem quatro sílabas: bor-bo-le-ta.'
  },
  {
    pergunta: 'Quantas sílabas tem a palavra “sol”?',
    alternativas: ['Uma', 'Duas', 'Três'],
    correta: 'Uma',
    explicacao: 'Sol tem apenas uma sílaba; é uma palavra monossílaba.'
  },
  {
    pergunta: 'Quantas sílabas tem a palavra “gato”?',
    alternativas: ['Uma', 'Duas', 'Três'],
    correta: 'Duas',
    explicacao: 'Gato se divide em ga-to: são duas sílabas.'
  },
  {
    pergunta: 'Quantas sílabas tem a palavra “banana”?',
    alternativas: ['Duas', 'Três', 'Quatro'],
    correta: 'Três',
    explicacao: 'Banana se divide em ba-na-na: são três sílabas.'
  },
  {
    pergunta: 'Quantas sílabas tem a palavra “estrela”?',
    alternativas: ['Duas', 'Três', 'Quatro'],
    correta: 'Três',
    explicacao: 'Estrela se divide em es-tre-la: são três sílabas.'
  },
  {
    pergunta: 'Quantas sílabas tem a palavra “borboleta”?',
    alternativas: ['Três', 'Quatro', 'Cinco'],
    correta: 'Quatro',
    explicacao: 'Borboleta se divide em bor-bo-le-ta: são quatro sílabas.'
  },
  {
    pergunta: 'Em “café”, qual é a sílaba mais forte?',
    alternativas: ['ca', 'fé', 'As duas têm a mesma força'],
    correta: 'fé',
    explicacao: 'Falamos ca-FÉ: a sílaba tônica é “fé”.'
  },
  {
    pergunta: 'Em “banana”, qual é a sílaba mais forte?',
    alternativas: ['ba', 'na (do meio)', 'na (do fim)'],
    correta: 'na (do meio)',
    explicacao: 'Falamos ba-NA-na: a sílaba tônica é a do meio.'
  },
  {
    pergunta: 'Em “pássaro”, qual é a sílaba mais forte?',
    alternativas: ['pás', 'sa', 'ro'],
    correta: 'pás',
    explicacao: 'Falamos PÁS-sa-ro: a sílaba tônica é a primeira.'
  },
  {
    pergunta: 'Em “abacaxi”, qual é a sílaba mais forte?',
    alternativas: ['a', 'ba', 'xi'],
    correta: 'xi',
    explicacao: 'Falamos a-ba-ca-XI: a sílaba tônica é a última.'
  }
];

let perguntas = [];
let indice = 0;
let pontuacao = 0;
let sequencia = 0;
let perguntaRespondida = false;
let finalizacaoIniciada = false;

const respostasQuiz = [];
const respostasPendentes = [];

let CHAVE_ACERTOS = '';
let CHAVE_ROUPINHAS = '';
let CHAVE_PENDENTES = '';

let acertosAcumulados = 0;
let usuarioAtual = null;
let roupasDesbloqueadas = [];

const roupinhas = [
  { emoji: '🧢', nome: 'Boné da concentração', acertos: 20 },
  { emoji: '🧥', nome: 'Jaqueta das palavras', acertos: 40 },
  { emoji: '👟', nome: 'Tênis da velocidade', acertos: 60 },
  { emoji: '🕶️', nome: 'Óculos do desafio', acertos: 80 }
];

const perguntaEl = document.getElementById('quizPergunta');
const opcoesEl = document.getElementById('quizOpcoes');
const feedbackEl = document.getElementById('quizFeedback');
const numEl = document.getElementById('questaoNum');
const dificuldadeEl = document.getElementById('quizDificuldade');
const pontuacaoEl = document.getElementById('pontuacaoQuizAtual');
const progressFillEl = document.getElementById('progressFill');
const sequenciaEl = document.getElementById('sequenciaAtual');
const roupinhaAtualEl = document.getElementById('roupinhaAtual');
const roupinhasEl = document.getElementById('roupinhas');
const reiniciarEl = document.getElementById('reiniciarQuiz');
const proximaPerguntaEl = document.getElementById('proximaPergunta');

const modalConquistaEl = document.getElementById('modalConquista');
const itemConquistadoEl = document.getElementById('itemConquistado');
const mensagemProgressoConquistaEl =
  document.getElementById('mensagemProgressoConquista');

function mostrarFeedback(blocos) {
  if (!feedbackEl) return;

  feedbackEl.replaceChildren();

  blocos.forEach(({ classe, texto }) => {
    const elemento = document.createElement('div');
    elemento.className = classe;
    elemento.textContent = texto;
    feedbackEl.appendChild(elemento);
  });

  feedbackEl.setAttribute('aria-live', 'polite');
}

function fecharModalConquista() {
  if (modalConquistaEl) {
    modalConquistaEl.hidden = true;
  }

  if (proximaPerguntaEl && !proximaPerguntaEl.hidden) {
    proximaPerguntaEl.focus();
  }
}

document.getElementById('fecharConquista')?.addEventListener(
  'click',
  fecharModalConquista
);

document.getElementById('continuarConquista')?.addEventListener(
  'click',
  fecharModalConquista
);

function mostrarConquista(roupa) {
  if (!modalConquistaEl) return;

  if (itemConquistadoEl) {
    itemConquistadoEl.replaceChildren();

    const emoji = document.createElement('span');
    emoji.textContent = roupa.emoji;

    const nome = document.createElement('strong');
    nome.textContent = roupa.nome;

    itemConquistadoEl.append(emoji, nome);
  }

  const proxima = roupinhas.find(
    item =>
      item.acertos > acertosAcumulados &&
      !roupasDesbloqueadas.includes(item.emoji)
  );

  if (mensagemProgressoConquistaEl) {
    mensagemProgressoConquistaEl.textContent = proxima
      ? `Faltam ${proxima.acertos - acertosAcumulados} acertos para desbloquear ${proxima.nome}!`
      : 'Você conquistou todas as roupinhas desta coleção!';
  }

  modalConquistaEl.hidden = false;

  document.getElementById('continuarConquista')?.focus();
}

reiniciarEl?.addEventListener('click', () => {
  window.location.reload();
});

proximaPerguntaEl?.addEventListener('click', () => {
  if (!perguntaRespondida || finalizacaoIniciada) return;

  if (indice >= perguntas.length) return;

  indice += 1;
  renderPergunta();
});

function atualizarRoupinhas() {
  roupasDesbloqueadas = roupinhas
    .filter(roupa => acertosAcumulados >= roupa.acertos)
    .map(roupa => roupa.emoji);

  if (CHAVE_ROUPINHAS) {
    localStorage.setItem(
      CHAVE_ROUPINHAS,
      JSON.stringify(roupasDesbloqueadas)
    );
  }

  renderRoupinhas();
}

function renderRoupinhas() {
  if (!roupinhasEl) return;

  roupinhasEl.replaceChildren();

  if (roupasDesbloqueadas.length === 0) {
    const vazio = document.createElement('span');
    vazio.className = 'roupinha vazia';
    vazio.textContent = '🔒';
    vazio.title = 'Continue jogando para desbloquear roupinhas!';
    roupinhasEl.appendChild(vazio);
    return;
  }

  roupasDesbloqueadas.forEach(emoji => {
    const item = document.createElement('span');
    item.className = 'roupinha';
    item.textContent = emoji;

    const roupa = roupinhas.find(r => r.emoji === emoji);

    if (roupa) item.title = roupa.nome;

    roupinhasEl.appendChild(item);
  });
}

async function carregarRoupinhas() {
  atualizarRoupinhas();

  // Sincroniza as recompensas com a conta no servidor.
  try {
    const resposta = await apiRequest('/roupinhas');
    const roupasServidor = resposta.roupinhas || [];

    for (const roupa of roupinhas) {
      if (
        acertosAcumulados >= roupa.acertos &&
        !roupasServidor.some(item => item.emoji === roupa.emoji)
      ) {
        await apiRequest('/roupinhas', {
          method: 'POST',
          body: JSON.stringify({
            emoji: roupa.emoji,
            nome: roupa.nome
          })
        });
      }
    }
  } catch (erro) {
    console.error('Não foi possível sincronizar as roupinhas:', erro);
  }
}

async function desbloquearRoupinha() {
  const proxima = roupinhas.find(
    roupa =>
      acertosAcumulados >= roupa.acertos &&
      !roupasDesbloqueadas.includes(roupa.emoji)
  );

  atualizarRoupinhas();

  if (!proxima) return null;

  if (roupinhaAtualEl) {
    roupinhaAtualEl.textContent =
      `🎉 Você conquistou ${proxima.emoji} ${proxima.nome}!`;
  }

  mostrarConquista(proxima);

  try {
    const resposta = await apiRequest('/roupinhas');
    const roupasServidor = resposta.roupinhas || [];

    if (!roupasServidor.some(item => item.emoji === proxima.emoji)) {
      await apiRequest('/roupinhas', {
        method: 'POST',
        body: JSON.stringify({
          emoji: proxima.emoji,
          nome: proxima.nome
        })
      });
    }
  } catch (erro) {
    console.error('Erro ao salvar a roupinha:', erro);
  }

  return proxima;
}

function obterDificuldade(pergunta) {
  if (
    ['facil', 'medio', 'dificil'].includes(pergunta.dificuldade)
  ) {
    return pergunta.dificuldade;
  }

  const enunciado = pergunta.pergunta
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (enunciado.startsWith('quantas silabas')) return 'facil';
  if (enunciado.startsWith('em ')) return 'dificil';

  if (
    enunciado.startsWith('como se separa') ||
    enunciado.startsWith('qual palavra esta escrita')
  ) {
    return 'medio';
  }

  return 'facil';
}

function montarFilaPerguntas(banco) {
  const ordem = ['facil', 'dificil', 'medio'];

  const grupos = {
    facil: [],
    dificil: [],
    medio: []
  };

  banco.forEach(pergunta => {
    grupos[obterDificuldade(pergunta)].push(pergunta);
  });

  Object.values(grupos).forEach(grupo => {
    grupo.sort(() => Math.random() - 0.5);
  });

  const fila = [];
  let cursor = 0;
  const limite = Math.min(12, banco.length);

  while (fila.length < limite) {
    let encontrou = false;

    for (let tentativa = 0; tentativa < ordem.length; tentativa += 1) {
      const dificuldade = ordem[cursor % ordem.length];
      cursor += 1;

      if (grupos[dificuldade].length > 0) {
        fila.push(grupos[dificuldade].shift());
        encontrou = true;
        break;
      }
    }

    if (!encontrou) break;
  }

  return fila;
}

function rotuloDificuldade(dificuldade) {
  return {
    facil: 'Fácil',
    dificil: 'Difícil',
    medio: 'Média'
  }[dificuldade] || 'Fácil';
}

// Persiste as respostas pendentes por conta, para tentar
// enviá-las novamente se uma requisição falhar.
function guardarPendentes() {
  if (!CHAVE_PENDENTES) return;

  localStorage.setItem(
    CHAVE_PENDENTES,
    JSON.stringify(respostasPendentes)
  );
}

async function salvarRespostasQuiz() {
  if (respostasPendentes.length === 0) return true;

  const lote = respostasPendentes.slice();

  try {
    await apiRequest('/respostas-quiz', {
      method: 'POST',
      body: JSON.stringify({
        respostas: lote
      })
    });

    respostasPendentes.splice(0, lote.length);
    guardarPendentes();

    return true;
  } catch (erro) {
    console.error('ERRO AO SALVAR RESPOSTAS:', erro);
    console.error('RESPOSTAS QUE FALHARAM:', lote);
    alert(
      'Não foi possível salvar as respostas no banco. ' +
      'Abra o console (F12) para ver o erro.'
    );
    guardarPendentes();
    return false;
  }
}

async function salvarPontuacao(jogoId, valor) {
  try {
    await apiRequest('/pontuacoes', {
      method: 'POST',
      body: JSON.stringify({
        jogo_id: Number(jogoId),
        pontuacao: Number(valor)
      })
    });

    return true;
  } catch (erro) {
    console.error('Erro ao salvar pontuação:', erro);
    return false;
  }
}

function renderPergunta() {
  if (indice >= perguntas.length) {
    if (perguntaEl) perguntaEl.textContent = 'Quiz concluído! 🎉';
    if (opcoesEl) opcoesEl.replaceChildren();

    if (proximaPerguntaEl) proximaPerguntaEl.hidden = true;

    mostrarFeedback([
      {
        classe: 'feedback-titulo',
        texto: '🏆 Parabéns por concluir o desafio!'
      },
      {
        classe: 'feedback-resposta',
        texto: `Sua pontuação final: ${pontuacao} pontos`
      },
      {
        classe: 'feedback-total',
        texto: `⭐ Total de acertos acumulados: ${acertosAcumulados}`
      }
    ]);

    if (!finalizacaoIniciada) {
      finalizacaoIniciada = true;

      finalizarQuiz();
    }

    return;
  }

  const atual = perguntas[indice];

  perguntaRespondida = false;

  if (proximaPerguntaEl) proximaPerguntaEl.hidden = true;

  if (numEl) numEl.textContent = `Questão ${indice + 1}`;

  if (dificuldadeEl) {
    dificuldadeEl.textContent =
      `Nível ${rotuloDificuldade(obterDificuldade(atual))}`;
  }

  if (perguntaEl) perguntaEl.textContent = atual.pergunta;

  if (pontuacaoEl) pontuacaoEl.textContent = `${pontuacao} pts`;
  if (sequenciaEl) sequenciaEl.textContent = sequencia;

  if (progressFillEl) {
    progressFillEl.style.width =
      `${((indice + 1) / perguntas.length) * 100}%`;
  }

  if (feedbackEl) feedbackEl.replaceChildren();
  if (opcoesEl) opcoesEl.replaceChildren();

  atual.alternativas.forEach(alternativa => {
    const btn = document.createElement('button');

    btn.className = 'opcao';
    btn.type = 'button';
    btn.textContent = alternativa;

    btn.addEventListener('click', () => {
      responder(alternativa, atual);
    });

    opcoesEl?.appendChild(btn);
  });
}

async function responder(alternativa, atual) {
  if (perguntaRespondida || finalizacaoIniciada) return;

  perguntaRespondida = true;

  const correta = alternativa === atual.correta;

  const resposta = {
    pergunta: atual.pergunta,
    alternativa,
    acertou: correta
  };

  respostasQuiz.push(resposta);
  respostasPendentes.push(resposta);
  guardarPendentes();

  opcoesEl?.querySelectorAll('button').forEach(botao => {
    botao.disabled = true;

    if (botao.textContent === atual.correta) {
      botao.classList.add('correta');
    } else if (botao.textContent === alternativa) {
      botao.classList.add('incorreta');
    }
  });

  if (correta) {
    pontuacao += 10;
    sequencia += 1;
    acertosAcumulados += 1;

    if (CHAVE_ACERTOS) {
      localStorage.setItem(
        CHAVE_ACERTOS,
        String(acertosAcumulados)
      );
    }
  } else {
    sequencia = 0;
  }

  // Salva cada resposta, sem esperar o fim da partida.
  const salvouResposta = await salvarRespostasQuiz();

  if (correta) {
    const blocos = [
      {
        classe: 'feedback-titulo',
        texto: '🎉 Muito bem! Você acertou!'
      },
      {
        classe: 'feedback-resposta',
        texto: `Resposta correta: ${atual.correta}`
      },
      {
        classe: 'feedback-explicacao',
        texto: atual.explicacao
      },
      {
        classe: 'feedback-total',
        texto: `⭐ Total de acertos: ${acertosAcumulados}`
      }
    ];

    mostrarFeedback(blocos);

    const roupaNova = await desbloquearRoupinha();

    if (roupaNova) {
      mostrarFeedback([
        ...blocos,
        {
          classe: 'feedback-recompensa',
          texto: `🎁 Nova roupinha desbloqueada: ${roupaNova.emoji} ${roupaNova.nome}!`
        }
      ]);
    }
  } else {
    mostrarFeedback([
      {
        classe: 'feedback-titulo',
        texto: '💗 Continue tentando!'
      },
      {
        classe: 'feedback-resposta',
        texto: `Resposta correta: ${atual.correta}`
      },
      {
        classe: 'feedback-explicacao',
        texto: atual.explicacao
      },
      {
        classe: 'feedback-total',
        texto: `⭐ Total de acertos: ${acertosAcumulados}`
      }
    ]);
  }

  if (!salvouResposta) {
    const aviso = document.createElement('div');
    aviso.className = 'feedback-explicacao';
    aviso.textContent =
      '⚠️ Sua resposta está guardada neste navegador e será reenviada na próxima tentativa.';
    feedbackEl?.appendChild(aviso);
  }

  if (pontuacaoEl) pontuacaoEl.textContent = `${pontuacao} pts`;
  if (sequenciaEl) sequenciaEl.textContent = sequencia;

  if (proximaPerguntaEl) {
    proximaPerguntaEl.textContent =
      indice === perguntas.length - 1
        ? 'Ver resultado'
        : 'Próxima pergunta';

    proximaPerguntaEl.hidden = false;
  }

  if (!modalConquistaEl || modalConquistaEl.hidden) {
    proximaPerguntaEl?.focus();
  }
}

async function finalizarQuiz() {
  const respostasSalvas = await salvarRespostasQuiz();
  const pontuacaoSalva = await salvarPontuacao('2', pontuacao);

  if (respostasSalvas && pontuacaoSalva && feedbackEl) {
    const aviso = document.createElement('div');
    aviso.className = 'feedback-explicacao';
    aviso.textContent = '✅ Resultado salvo com sucesso!';
    feedbackEl.appendChild(aviso);
  } else if (feedbackEl) {
    const aviso = document.createElement('div');
    aviso.className = 'feedback-explicacao';
    aviso.textContent =
      '⚠️ Parte do resultado não foi salva. Verifique sua conexão antes de sair.';
    feedbackEl.appendChild(aviso);
  }
}

async function iniciarQuiz() {
  try {
    const usuario = await window.authReady;

    if (!usuario || !usuario.id) {
      throw new Error('Não foi possível identificar a conta conectada.');
    }

    usuarioAtual = usuario;

    CHAVE_ACERTOS =
      `letrikaAcertosAcumuladosV2_usuario_${usuario.id}`;

    CHAVE_ROUPINHAS =
      `letrikaRoupinhasV2_usuario_${usuario.id}`;

    CHAVE_PENDENTES =
      `letrikaRespostasPendentes_usuario_${usuario.id}`;

    // Recupera respostas que não conseguiram ser enviadas anteriormente.
    try {
      const pendentesSalvos = JSON.parse(
        localStorage.getItem(CHAVE_PENDENTES) || '[]'
      );

      if (Array.isArray(pendentesSalvos)) {
        respostasPendentes.push(...pendentesSalvos);
      }
    } catch (erro) {
      console.error('Erro ao recuperar respostas pendentes:', erro);
    }

    // Primeiro tenta enviar as respostas pendentes.
    await salvarRespostasQuiz();

    // O banco é a fonte oficial do total acumulado.
    const historico = await apiRequest('/respostas-quiz/historico');

    const totalServidor = Number(
      historico?.estatisticas?.acertos ?? 0
    );

    if (!Number.isFinite(totalServidor) || totalServidor < 0) {
      throw new Error('O histórico recebido contém um total inválido.');
    }

    acertosAcumulados = totalServidor;

    localStorage.setItem(
      CHAVE_ACERTOS,
      String(acertosAcumulados)
    );

    await carregarRoupinhas();

    perguntas = montarFilaPerguntas(bancoPerguntas);

    indice = 0;
    pontuacao = 0;
    sequencia = 0;
    perguntaRespondida = false;
    finalizacaoIniciada = false;

    respostasQuiz.length = 0;

    renderPergunta();
  } catch (erro) {
    console.error('Erro ao iniciar o quiz:', erro);

    mostrarFeedback([
      {
        classe: 'feedback-titulo',
        texto: 'Não foi possível carregar seu progresso.'
      },
      {
        classe: 'feedback-explicacao',
        texto: 'Confira se você está conectada à sua conta e se o servidor está funcionando.'
      }
    ]);
  }
}

console.log('LETRIKA: arquivo quiz.js carregado!');
iniciarQuiz();
