document.addEventListener('DOMContentLoaded', async () => {
  try {
    const ranking = await apiRequest('/ranking');
    const geral = ranking.ranking || [];
    const listaGeral = document.getElementById('rankingGeral');
    listaGeral.innerHTML = geral.map((item, index) => `<li>#${index + 1} - ${item.nome} - ${item.pontuacao_total} pontos</li>`).join('');

    const corrida = await apiRequest('/ranking/jogo/1');
    const listaCorrida = document.getElementById('rankingCorrida');
    listaCorrida.innerHTML = (corrida.ranking || []).map((item, index) => `<li>#${index + 1} - ${item.nome} - ${item.pontuacao_total} pontos</li>`).join('') || '<li>Nenhuma pontuação registrada ainda.</li>';

    const quiz = await apiRequest('/ranking/jogo/2');
    const listaQuiz = document.getElementById('rankingQuiz');
    listaQuiz.innerHTML = (quiz.ranking || []).map((item, index) => `<li>#${index + 1} - ${item.nome} - ${item.pontuacao_total} pontos</li>`).join('') || '<li>Nenhuma pontuação registrada ainda.</li>';
  } catch (error) {
    console.error(error);
  }
});
