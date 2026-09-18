document.addEventListener('DOMContentLoaded', async () => {
  const excluirBtn = document.getElementById('excluirContaBtn');
  const excluirMensagem = document.getElementById('excluirContaMensagem');

  excluirBtn.addEventListener('click', async () => {
    const confirmou = window.confirm('Tem certeza que deseja excluir sua conta? Essa ação remove seus dados e pontuações.');
    if (!confirmou) return;

    const usuario = JSON.parse(localStorage.getItem('letrikaUsuario'));
    if (!usuario) return;

    excluirBtn.disabled = true;
    excluirMensagem.textContent = 'Excluindo sua conta...';

    try {
      const resposta = await apiRequest('/usuarios/' + usuario.id, { method: 'DELETE' });
      localStorage.removeItem('letrikaUsuario');
      localStorage.removeItem('letrikaRoupinhas');
      excluirMensagem.textContent = resposta.message;
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);
    } catch (error) {
      excluirBtn.disabled = false;
      excluirMensagem.textContent = error.message;
    }
  });

  try {
    const usuario = JSON.parse(localStorage.getItem('letrikaUsuario'));
    if (!usuario) return;

    const perfil = await apiRequest('/usuarios/' + usuario.id);
    const dados = perfil.usuario;

    document.getElementById('perfilNome').textContent = dados.nome;
    document.getElementById('perfilUsuario').textContent = '@' + dados.nome_usuario;
    document.getElementById('perfilEmail').textContent = dados.email;
    document.getElementById('perfilData').textContent = new Date(dados.data_cadastro).toLocaleDateString('pt-BR');

    const ranking = await apiRequest('/ranking');
    const rankingLista = ranking.ranking || [];
    const posicao = rankingLista.findIndex((item) => item.id === Number(usuario.id)) + 1;
    document.getElementById('perfilRanking').textContent = posicao ? `#${posicao}` : 'Sem posição';

    const pontuacoes = await apiRequest('/pontuacoes/' + usuario.id);
    const lista = pontuacoes.pontuacoes || [];
    const corrida = lista.filter((item) => item.jogo_nome && item.jogo_nome.toLowerCase().includes('corrida'));
    const quiz = lista.filter((item) => item.jogo_nome && item.jogo_nome.toLowerCase().includes('quiz'));
    const total = lista.reduce((acc, item) => acc + Number(item.pontuacao), 0);

    document.getElementById('perfilTotal').textContent = total;
    document.getElementById('perfilCorrida').textContent = corrida.reduce((acc, item) => acc + Number(item.pontuacao), 0);
    document.getElementById('perfilQuiz').textContent = quiz.reduce((acc, item) => acc + Number(item.pontuacao), 0);
  } catch (error) {
    console.error(error);
  }
});
