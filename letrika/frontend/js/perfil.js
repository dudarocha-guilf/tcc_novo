
document.addEventListener('DOMContentLoaded', iniciarPerfil);

async function iniciarPerfil() {
  const editarBtn = document.getElementById('editarPerfilBtn');
  const painel = document.getElementById('editarPerfilPainel');
  const formulario = document.getElementById('formEditarPerfil');
  const cancelarBtn = document.getElementById('cancelarEdicaoBtn');
  const salvarBtn = document.getElementById('salvarPerfilBtn');

  const mensagem = document.getElementById('perfilMensagem');
  const mensagemEdicao = document.getElementById('editarPerfilMensagem');

  const campoNome = document.getElementById('editarNome');
  const campoUsuario = document.getElementById('editarNomeUsuario');
  const campoEmail = document.getElementById('editarEmail');
  const campoAvatar = document.getElementById('editarAvatar');

  const avatarExibido = document.getElementById('perfilAvatar');
  const excluirBtn = document.getElementById('excluirContaBtn');
  const excluirMensagem = document.getElementById('excluirContaMensagem');

  let usuario = null;
  let avatarOriginal = '';

  const avatares = [
    '👩‍🎓',
    '👨‍🎓',
    '🦊',
    '🐱',
    '🐼',
    '🐸',
    '🐰',
    '🦄'
  ];

  function mostrarMensagem(elemento, texto) {
    if (elemento) elemento.textContent = texto;
  }

  function mostrarAvatar(avatar) {
    // Exibe o avatar padrão para contas antigas que usam um nome de arquivo.
    avatarExibido.textContent = avatares.includes(avatar)
      ? avatar
      : '👩‍🎓';
  }

  function prepararCampoAvatar(avatar) {
    const existe = Array.from(campoAvatar.options).some(
      opcao => opcao.value === avatar
    );

    // Preserva avatares antigos que já estão salvos na conta.
    if (avatar && !existe) {
      const opcao = document.createElement('option');
      opcao.value = avatar;
      opcao.textContent = 'Avatar atual';
      campoAvatar.appendChild(opcao);
    }

    campoAvatar.value = avatar || '👩‍🎓';
  }

  function exibirDados(dados) {
    usuario = dados;

    document.getElementById('perfilNome').textContent =
      dados.nome || '';

    document.getElementById('perfilUsuario').textContent =
      '@' + (dados.nome_usuario || '');

    document.getElementById('perfilEmail').textContent =
      dados.email || '';

    const data = dados.data_cadastro
      ? new Date(dados.data_cadastro)
      : null;

    document.getElementById('perfilData').textContent =
      data && !Number.isNaN(data.getTime())
        ? data.toLocaleDateString('pt-BR')
        : 'Não disponível';

    avatarOriginal = dados.avatar || 'default-avatar.png';
    mostrarAvatar(avatarOriginal);
  }

  function abrirEdicao() {
    if (!usuario) {
      mostrarMensagem(
        mensagem,
        'Os dados ainda estão carregando. Aguarde um instante.'
      );
      return;
    }

    campoNome.value = usuario.nome || '';
    campoUsuario.value = usuario.nome_usuario || '';
    campoEmail.value = usuario.email || '';

    prepararCampoAvatar(avatarOriginal);

    mostrarMensagem(mensagem, '');
    mostrarMensagem(mensagemEdicao, '');

    painel.hidden = false;
    editarBtn.hidden = true;

    campoNome.focus();
  }

  function fecharEdicao() {
    formulario.reset();

    mostrarAvatar(avatarOriginal);

    painel.hidden = true;
    editarBtn.hidden = false;

    mostrarMensagem(mensagemEdicao, '');
  }

  // Botão para abrir a edição.
  editarBtn.addEventListener('click', abrirEdicao);

  // Botão para cancelar sem salvar.
  cancelarBtn.addEventListener('click', fecharEdicao);

  // Pré-visualiza o avatar escolhido.
  campoAvatar.addEventListener('change', () => {
    mostrarAvatar(campoAvatar.value);
  });

  // Salva as alterações no backend e no MySQL.
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    if (!usuario || !usuario.id) {
      mostrarMensagem(
        mensagemEdicao,
        'Não foi possível identificar sua conta. Entre novamente.'
      );
      return;
    }

    const dados = {
      nome: campoNome.value.trim(),
      nome_usuario: campoUsuario.value.trim(),
      email: campoEmail.value.trim().toLowerCase(),
      avatar: campoAvatar.value
    };

    if (dados.nome.length < 2) {
      mostrarMensagem(
        mensagemEdicao,
        'O nome precisa ter pelo menos 2 caracteres.'
      );
      campoNome.focus();
      return;
    }

    if (dados.nome_usuario.length < 3) {
      mostrarMensagem(
        mensagemEdicao,
        'O nome de usuário precisa ter pelo menos 3 caracteres.'
      );
      campoUsuario.focus();
      return;
    }

    if (!campoEmail.validity.valid || !dados.email) {
      mostrarMensagem(mensagemEdicao, 'Digite um e-mail válido.');
      campoEmail.focus();
      return;
    }

    salvarBtn.disabled = true;
    cancelarBtn.disabled = true;

    mostrarMensagem(mensagemEdicao, 'Salvando alterações...');

    try {
      const resposta = await apiRequest(
        '/usuarios/' + encodeURIComponent(usuario.id),
        {
          method: 'PUT',
          body: JSON.stringify(dados)
        }
      );

      // Usa os dados devolvidos pelo servidor após salvar.
      const usuarioAtualizado = resposta.usuario || {
        ...usuario,
        ...dados
      };

      exibirDados({
        ...usuario,
        ...usuarioAtualizado
      });

      // Mantém os dados atualizados no navegador.
      const usuarioAnterior = JSON.parse(
        localStorage.getItem('letrikaUsuario') || '{}'
      );

      localStorage.setItem(
        'letrikaUsuario',
        JSON.stringify({
          ...usuarioAnterior,
          ...usuarioAtualizado
        })
      );

      fecharEdicao();

      mostrarMensagem(
        mensagem,
        resposta.message || 'Perfil atualizado com sucesso! 💗'
      );

    } catch (erro) {
      console.error('Erro ao editar perfil:', erro);

      mostrarMensagem(
        mensagemEdicao,
        erro.message || 'Não foi possível salvar as alterações.'
      );

    } finally {
      salvarBtn.disabled = false;
      cancelarBtn.disabled = false;
    }
  });

  // Carrega o perfil da sessão autenticada.
  try {
    if (window.authReady) {
      await window.authReady;
    }

    const resposta = await apiRequest('/auth/me');

    if (!resposta.usuario) {
      throw new Error('Não foi possível carregar seu perfil.');
    }

    exibirDados(resposta.usuario);

  } catch (erro) {
    console.error('Erro ao carregar perfil:', erro);

    mostrarMensagem(
      mensagem,
      erro.message || 'Não foi possível carregar o perfil.'
    );

    editarBtn.disabled = true;
    return;
  }

  // Carrega a posição no ranking.
  try {
    const resposta = await apiRequest('/ranking');
    const ranking = resposta.ranking || [];

    const posicao = ranking.findIndex(
      item => Number(item.id) === Number(usuario.id)
    );

    document.getElementById('perfilRanking').textContent =
      posicao >= 0 ? `#${posicao + 1}` : 'Sem posição';

  } catch (erro) {
    console.error('Erro ao carregar ranking:', erro);

    document.getElementById('perfilRanking').textContent =
      'Indisponível';
  }

  // Carrega as pontuações.
  try {
    const resposta = await apiRequest(
      '/pontuacoes/' + encodeURIComponent(usuario.id)
    );

    const pontuacoes = resposta.pontuacoes || [];

    const total = pontuacoes.reduce(
      (soma, item) => soma + Number(item.pontuacao || 0),
      0
    );

    const corrida = pontuacoes
      .filter(item =>
        (item.jogo_nome || '').toLowerCase().includes('corrida')
      )
      .reduce(
        (soma, item) => soma + Number(item.pontuacao || 0),
        0
      );

    const quiz = pontuacoes
      .filter(item =>
        (item.jogo_nome || '').toLowerCase().includes('quiz')
      )
      .reduce(
        (soma, item) => soma + Number(item.pontuacao || 0),
        0
      );

    document.getElementById('perfilTotal').textContent = total;
    document.getElementById('perfilCorrida').textContent = corrida;
    document.getElementById('perfilQuiz').textContent = quiz;

  } catch (erro) {
    console.error('Erro ao carregar pontuações:', erro);
  }

  // Mantém o botão de excluir conta.
  if (excluirBtn) {
    excluirBtn.addEventListener('click', async () => {
      const confirmou = window.confirm(
        'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.'
      );

      if (!confirmou) return;

      excluirBtn.disabled = true;
      mostrarMensagem(excluirMensagem, 'Excluindo conta...');

      try {
        const resposta = await apiRequest(
          '/usuarios/' + encodeURIComponent(usuario.id),
          { method: 'DELETE' }
        );

        localStorage.removeItem('letrikaUsuario');

        mostrarMensagem(
          excluirMensagem,
          resposta.message || 'Conta excluída.'
        );

        window.location.replace('login.html?v=8');

      } catch (erro) {
        console.error('Erro ao excluir conta:', erro);

        mostrarMensagem(
          excluirMensagem,
          erro.message || 'Não foi possível excluir a conta.'
        );

        excluirBtn.disabled = false;
      }
    });
  }
}
