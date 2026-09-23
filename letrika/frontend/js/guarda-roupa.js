const roupasDisponiveis = [
  { emoji: '🧢', nome: 'Boné da concentração' },
  { emoji: '🧥', nome: 'Jaqueta das palavras' },
  { emoji: '👟', nome: 'Tênis da velocidade' },
  { emoji: '🕶️', nome: 'Óculos do desafio' }
];

const colecaoEl = document.getElementById('colecaoRoupinhas');
const contadorEl = document.getElementById('contadorRoupinhas');
const mensagemEl = document.getElementById('guardaMensagem');
const roupaVestidaEl = document.getElementById('roupaVestida');
let roupasSalvas = [];
let roupaEquipada = '';

async function salvarRoupaEquipada(emoji) {
  try {
    await apiRequest('/roupinhas/equipada', {
      method: 'PUT',
      body: JSON.stringify({ emoji })
    });
    roupaEquipada = emoji;
    roupaVestidaEl.textContent = emoji;
    mensagemEl.textContent = `Você está usando ${roupasSalvas.find((roupa) => roupa.emoji === emoji)?.nome || 'essa roupinha'}.`;
    renderColecao();
  } catch (error) {
    mensagemEl.textContent = error.message;
  }
}

function renderColecao() {
  contadorEl.textContent = `${roupasSalvas.length} ${roupasSalvas.length === 1 ? 'roupinha' : 'roupinhas'}`;
  roupaVestidaEl.textContent = roupaEquipada || '🧑‍🎓';

  if (roupasSalvas.length === 0) {
    colecaoEl.innerHTML = '<div class="colecao-vazia">Ainda não há roupinhas aqui. Jogue o quiz e acerte uma sequência!</div>';
    return;
  }

  colecaoEl.innerHTML = roupasSalvas.map((roupa) => {
    const equipada = roupa.emoji === roupaEquipada ? ' equipada' : '';
    return `<button class="item-roupa${equipada}" type="button" data-roupa="${roupa.emoji}" title="${roupa.nome}">
      <span>${roupa.emoji}</span>
      <strong>${roupa.nome}</strong>
      <small>${equipada ? 'Usando agora' : 'Vestir'}</small>
    </button>`;
  }).join('');

  colecaoEl.querySelectorAll('[data-roupa]').forEach((button) => {
    button.addEventListener('click', () => salvarRoupaEquipada(button.dataset.roupa));
  });
}

async function carregarColecao() {
  try {
    const resposta = await apiRequest('/roupinhas');
    roupasSalvas = resposta.roupinhas || [];
    roupaEquipada = roupasSalvas.find((roupa) => Number(roupa.equipada) === 1)?.emoji || '';
    renderColecao();
  } catch (error) {
    mensagemEl.textContent = error.message;
  }
}

async function iniciarGuardaRoupa() {
  try {
    await window.authReady;
    await carregarColecao();
  } catch (error) {
    console.error('Sessão inválida:', error);
  }
}

window.addEventListener('pageshow', iniciarGuardaRoupa);
