
document.addEventListener('DOMContentLoaded', carregarProgresso);

const medalhasLetrika = [
  { nome: 'Primeiro passo', descricao: '1 acerto', limite: 1, emoji: '🌱' },
  { nome: 'Aprendiz', descricao: '10 acertos', limite: 10, emoji: '🥉' },
  { nome: 'Explorador', descricao: '25 acertos', limite: 25, emoji: '🥈' },
  { nome: 'Mestre das palavras', descricao: '50 acertos', limite: 50, emoji: '🥇' },
  { nome: 'Lenda Letrika', descricao: '100 acertos', limite: 100, emoji: '🏆' }
];

async function carregarProgresso() {
  const mensagem = document.getElementById('progressoMensagem');

  try {
    if (window.authReady) {
      await window.authReady;
    }

    const sessao = await apiRequest('/auth/me');

    if (!sessao.usuario || !sessao.usuario.id) {
      throw new Error('Não foi possível identificar sua conta.');
    }

    const usuarioId = sessao.usuario.id;

    const [respostaHistorico, respostaPontuacoes] = await Promise.all([
      apiRequest('/respostas-quiz/historico'),
      apiRequest('/pontuacoes/' + encodeURIComponent(usuarioId))
    ]);

    const estatisticas = respostaHistorico.estatisticas || {};
    const historico = respostaHistorico.historico || [];
    const pontuacoes = respostaPontuacoes.pontuacoes || [];

    const total = Number(estatisticas.total_respondidas || 0);
    const acertos = Number(estatisticas.acertos || 0);
    const erros = Number(estatisticas.erros || 0);

    const pontuacaoTotal = pontuacoes.reduce(
      (soma, item) => soma + Number(item.pontuacao || 0),
      0
    );

    document.getElementById('statRespondidas').textContent = total;
    document.getElementById('statAcertos').textContent = acertos;

    const precisao = total > 0
      ? Math.round((acertos / total) * 100)
      : 0;

    document.getElementById('statPrecisao').textContent =
      `${precisao}%`;

    document.getElementById('statPontuacao').textContent =
      pontuacaoTotal.toLocaleString('pt-BR');

    atualizarNivel(acertos);
    mostrarMedalhas(acertos);
    mostrarHistorico(historico);

    mensagem.textContent =
      'Suas estatísticas foram atualizadas com sucesso! 💗';

  } catch (erro) {
    console.error('Erro ao carregar progresso:', erro);

    mensagem.textContent =
      erro.message || 'Não foi possível carregar seu progresso.';

    document.getElementById('listaMedalhas').innerHTML =
      '<p class="progresso-vazio">Não foi possível carregar as medalhas.</p>';

    document.getElementById('historicoLista').innerHTML =
      '<p class="progresso-vazio">Não foi possível carregar o histórico.</p>';
  }
}

function atualizarNivel(acertos) {
  // A cada 10 acertos completos, o estudante sobe de nível.
  const nivel = Math.floor(acertos / 10) + 1;
  const acertosNoNivel = acertos % 10;
  const porcentagem = acertosNoNivel * 10;
  const proximoLimite = Math.ceil((acertos + 1) / 10) * 10;

  const nomes = [
    'Aprendiz de palavras',
    'Explorador das sílabas',
    'Aventureiro da língua',
    'Guardião da gramática',
    'Mestre das palavras'
  ];

  const nome = nomes[Math.min(nivel - 1, nomes.length - 1)];

  document.getElementById('nivelNumero').textContent = nivel;
  document.getElementById('nivelNome').textContent = nome;

  document.getElementById('nivelDescricao').textContent =
    `${acertos} respostas corretas acumuladas. Continue praticando!`;

  document.getElementById('barraNivel').style.width =
    `${porcentagem}%`;

  document.getElementById('barraNivelAcessivel')
    .setAttribute('aria-valuenow', String(porcentagem));

  document.getElementById('progressoProximoNivel').textContent =
    `${acertosNoNivel} de 10 acertos para avançar de nível. ` +
    `Sua próxima meta é chegar a ${proximoLimite} acertos.`;
}

function mostrarMedalhas(acertos) {
  const container = document.getElementById('listaMedalhas');

  container.innerHTML = medalhasLetrika.map(medalha => {
    const desbloqueada = acertos >= medalha.limite;

    return `
      <article class="medalha ${desbloqueada ? 'desbloqueada' : ''}">
        <div class="medalha-icone" aria-hidden="true">
          ${medalha.emoji}
        </div>
        <h3>${medalha.nome}</h3>
        <p>${medalha.descricao}</p>
        <p>${desbloqueada ? 'Desbloqueada!' : 'Ainda bloqueada'}</p>
      </article>
    `;
  }).join('');
}

function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caractere]);
}

function mostrarHistorico(historico) {
  const container = document.getElementById('historicoLista');

  if (!historico.length) {
    container.innerHTML =
      '<p class="progresso-vazio">Você ainda não tem respostas registradas. ' +
      'Jogue o quiz e suas respostas aparecerão aqui!</p>';
    return;
  }

  container.innerHTML = historico.map(item => {
    const acertou = Number(item.acertou) === 1;
    const classe = acertou ? 'acerto' : 'erro';

    return `
      <article class="historico-item ${classe}">
        <p class="historico-pergunta">
          ${escaparHTML(item.pergunta)}
        </p>
        <p class="historico-resposta">
          Sua resposta: ${escaparHTML(item.alternativa_escolhida)}
        </p>
        <span class="historico-resultado">
          ${acertou ? '✅ Resposta correta' : '💗 Resposta incorreta'}
        </span>
      </article>
    `;
  }).join('');
}
