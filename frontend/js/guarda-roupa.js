
const roupasDisponiveis = [
  { emoji: '🧢', nome: 'Boné da concentração', acertos: 20 },
  { emoji: '🧥', nome: 'Jaqueta das palavras', acertos: 40 },
  { emoji: '👟', nome: 'Tênis da velocidade', acertos: 60 },
  { emoji: '🕶️', nome: 'Óculos do desafio', acertos: 80 }
];

let CHAVE_ACERTOS = '';
let CHAVE_ROUPINHAS = '';
let usuarioAtual = null;

const colecaoEl = document.getElementById('colecaoRoupinhas');
const contadorEl = document.getElementById('contadorRoupinhas');
const mensagemEl = document.getElementById('guardaMensagem');
const roupaVestidaEl = document.getElementById('roupaVestida');
const progressoEl = document.getElementById('progressoRoupinhas');

let roupasSalvas = [];
let roupaEquipada = '';
let acertosAcumulados = 0;

async function salvarRoupaEquipada(emoji) {
  const roupa = roupasDisponiveis.find(item => item.emoji === emoji);
  const possuiRoupa = roupasSalvas.some(item => item.emoji === emoji);

  if (!roupa || !possuiRoupa) {
    mensagemEl.textContent = 'Conquiste essa roupinha antes de equipá-la!';
    return;
  }

  try {
    await apiRequest('/roupinhas/equipada', {
      method: 'PUT',
      body: JSON.stringify({ emoji })
    });

    roupaEquipada = emoji;
    roupaVestidaEl.textContent = emoji;
    mensagemEl.textContent = `Você está usando ${roupa.nome}.`;

    renderColecao();
  } catch (error) {
    mensagemEl.textContent =
      error.message || 'Não foi possível equipar a roupinha.';
  }
}

function renderProgresso() {
  if (!progressoEl) return;

  const proxima = roupasDisponiveis.find(
    roupa => acertosAcumulados < roupa.acertos
  );

  if (!proxima) {
    progressoEl.innerHTML = `
      <div class="progresso-texto">
        <strong>🌟 Coleção completa!</strong>
        <span>Você desbloqueou todas as roupinhas!</span>
      </div>
      <div class="barra-recompensa">
        <div class="barra-recompensa-fill" style="width:100%"></div>
      </div>
      <small>${acertosAcumulados} acertos acumulados</small>
    `;
    return;
  }

  const anteriores = roupasDisponiveis.filter(
    roupa => roupa.acertos < proxima.acertos
  );
  const anterior = anteriores[anteriores.length - 1];

  const inicio = anterior ? anterior.acertos : 0;
  const intervalo = proxima.acertos - inicio;

  const progresso = Math.max(
    0,
    Math.min(100, ((acertosAcumulados - inicio) / intervalo) * 100)
  );

  const faltam = proxima.acertos - acertosAcumulados;

  progressoEl.innerHTML = `
    <div class="progresso-texto">
      <strong>🎁 Próxima recompensa: ${proxima.nome}</strong>
      <span>Faltam ${faltam} ${faltam === 1 ? 'acerto' : 'acertos'}!</span>
    </div>
    <div
      class="barra-recompensa"
      role="progressbar"
      aria-label="Progresso até a próxima roupinha"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="${Math.round(progresso)}"
    >
      <div class="barra-recompensa-fill" style="width:${progresso}%"></div>
    </div>
    <small>${acertosAcumulados} acertos acumulados</small>
  `;
}

function renderColecao() {
  if (!colecaoEl || !contadorEl || !roupaVestidaEl) return;

  const desbloqueadas = roupasDisponiveis.filter(
    roupa => acertosAcumulados >= roupa.acertos
  );

  contadorEl.textContent =
    `${desbloqueadas.length} de ${roupasDisponiveis.length} roupinhas`;

  roupaVestidaEl.textContent = roupaEquipada || '🧑‍🎓';

  renderProgresso();

  colecaoEl.innerHTML = roupasDisponiveis.map(roupa => {
    const conquistada = acertosAcumulados >= roupa.acertos;

    const salvaNoServidor = roupasSalvas.some(
      item => item.emoji === roupa.emoji
    );

    const equipada = roupa.emoji === roupaEquipada;
    const podeVestir = conquistada && salvaNoServidor;

    let status;

    if (equipada) {
      status = 'Usando agora';
    } else if (podeVestir) {
      status = 'Vestir';
    } else if (conquistada) {
      status = 'Sincronizando...';
    } else {
      status = `🔒 ${roupa.acertos} acertos`;
    }

    return `
      <article class="item-roupa ${conquistada ? 'roupa-liberada' : 'roupa-bloqueada'} ${equipada ? 'equipada' : ''}">
        <span aria-hidden="true">${conquistada ? roupa.emoji : '🎁'}</span>
        <strong>${roupa.nome}</strong>
        <small>${status}</small>
        ${
          podeVestir
            ? `<button
                 class="btn btn-secondary btn-vestir"
                 type="button"
                 data-roupa="${roupa.emoji}"
                 ${equipada ? 'disabled' : ''}
               >${equipada ? 'Equipada ✓' : 'Vestir'}</button>`
            : ''
        }
      </article>
    `;
  }).join('');

  colecaoEl.querySelectorAll('[data-roupa]').forEach(button => {
    button.addEventListener('click', () => {
      salvarRoupaEquipada(button.dataset.roupa);
    });
  });
}

async function carregarColecao() {
  // Busca o total do histórico da conta conectada.
  // O banco é a fonte principal, não o valor antigo do navegador.
  const historico = await apiRequest('/respostas-quiz/historico');

  acertosAcumulados = Number(historico?.estatisticas?.acertos ?? 0);

  if (!Number.isFinite(acertosAcumulados) || acertosAcumulados < 0) {
    throw new Error('O total de acertos recebido é inválido.');
  }

  // Guarda o total apenas na chave individual desse aluno.
  localStorage.setItem(CHAVE_ACERTOS, String(acertosAcumulados));

  try {
    const resposta = await apiRequest('/roupinhas');
    roupasSalvas = resposta.roupinhas || [];

    roupaEquipada =
      roupasSalvas.find(roupa => Number(roupa.equipada) === 1)?.emoji || '';

    renderColecao();

    const desbloqueadas = roupasDisponiveis.filter(
      roupa => acertosAcumulados >= roupa.acertos
    );

    const faltamSincronizar = desbloqueadas.some(
      roupa => !roupasSalvas.some(item => item.emoji === roupa.emoji)
    );

    if (faltamSincronizar) {
      mensagemEl.textContent =
        'Você atingiu uma recompensa. Vamos sincronizar suas conquistas.';
    } else if (!desbloqueadas.length) {
      mensagemEl.textContent =
        'Continue jogando para conquistar sua primeira roupinha!';
    } else {
      mensagemEl.textContent =
        'Suas conquistas estão aqui. Escolha uma roupinha para vestir!';
    }
  } catch (error) {
    renderColecao();
    mensagemEl.textContent =
      'Não foi possível carregar as roupas salvas. Verifique sua conexão.';
    throw error;
  }
}

async function iniciarGuardaRoupa() {
  try {
    const usuario = await window.authReady;

    if (!usuario || !usuario.id) {
      throw new Error('Não foi possível identificar a conta conectada.');
    }

    usuarioAtual = usuario;

    // Cada conta tem suas próprias chaves no navegador.
    CHAVE_ACERTOS =
      `letrikaAcertosAcumuladosV2_usuario_${usuarioAtual.id}`;

    CHAVE_ROUPINHAS =
      `letrikaRoupinhasV2_usuario_${usuarioAtual.id}`;

    await carregarColecao();
  } catch (error) {
    console.error('Erro ao iniciar o guarda-roupa:', error);

    if (mensagemEl) {
      mensagemEl.textContent =
        'Não foi possível carregar suas conquistas. Atualize a página e tente novamente.';
    }
  }
}

window.addEventListener('pageshow', iniciarGuardaRoupa);
