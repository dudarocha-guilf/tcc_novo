document.addEventListener('DOMContentLoaded', async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem('letrikaUsuario'));
    const nome = usuario?.nome || 'Jogador';
    document.getElementById('bemVindo').textContent = `Olá, ${nome}! Pronto para aprender brincando?`;

    const dados = await apiRequest('/ranking');
    const ranking = dados.ranking || [];
    const posicao = ranking.findIndex((item) => item.id === usuario?.id) + 1;
    document.getElementById('rankingUsuario').textContent = posicao ? `#${posicao} no ranking` : 'Sem posição ainda';

    const melhorCorrida = await apiRequest('/pontuacoes/' + usuario.id);
    const melhores = melhorCorrida.pontuacoes || [];
    const corrida = melhores.filter((item) => item.jogo_nome && item.jogo_nome.toLowerCase().includes('corrida'));
    const quiz = melhores.filter((item) => item.jogo_nome && item.jogo_nome.toLowerCase().includes('quiz'));

    document.getElementById('pontuacaoCorrida').textContent = corrida.reduce((acc, item) => acc + Number(item.pontuacao), 0);
    document.getElementById('pontuacaoQuiz').textContent = quiz.reduce((acc, item) => acc + Number(item.pontuacao), 0);
    document.getElementById('melhorCorrida').textContent = Math.max(0, ...corrida.map((item) => Number(item.pontuacao)), 0);
    document.getElementById('melhorQuiz').textContent = Math.max(0, ...quiz.map((item) => Number(item.pontuacao)), 0);
    document.getElementById('pontosTotais').textContent = `${Number(document.getElementById('pontuacaoCorrida').textContent) + Number(document.getElementById('pontuacaoQuiz').textContent)} pontos`;
  } catch (error) {
    console.error(error);
  }
});
