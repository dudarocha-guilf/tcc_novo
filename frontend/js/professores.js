const mensagemRelatorio = document.getElementById('relatorioMensagem');
const tabelaAlunos = document.getElementById('tabelaAlunos');
const perguntasAcertadas = document.getElementById('perguntasAcertadas');
const perguntasErradas = document.getElementById('perguntasErradas');

function criarCelula(valor, tag = 'td') {
  const celula = document.createElement(tag);
  celula.textContent = valor;
  return celula;
}

function renderizarAlunos(alunos) {
  tabelaAlunos.replaceChildren();
  if (!alunos.length) {
    const linha = document.createElement('tr');
    const celula = criarCelula('Nenhum aluno cadastrado.');
    celula.colSpan = 5;
    linha.appendChild(celula);
    tabelaAlunos.appendChild(linha);
    return;
  }

  alunos.forEach((aluno, indice) => {
    const linha = document.createElement('tr');
    linha.append(
      criarCelula(indice + 1),
      criarCelula(`${aluno.nome} (@${aluno.nome_usuario})`),
      criarCelula(Number(aluno.respondidas)),
      criarCelula(Number(aluno.acertos)),
      criarCelula(Number(aluno.erros))
    );
    tabelaAlunos.appendChild(linha);
  });
}

function renderizarPerguntas(lista, elemento, metrica, mensagemVazia) {
  elemento.replaceChildren();
  if (!lista.length) {
    const item = document.createElement('li');
    item.textContent = mensagemVazia;
    elemento.appendChild(item);
    return;
  }

  lista.slice(0, 5).forEach((pergunta) => {
    const item = document.createElement('li');
    item.textContent = `${pergunta.pergunta} (${Number(pergunta[metrica])} ${metrica})`;
    elemento.appendChild(item);
  });
}

async function carregarRelatorio() {
  mensagemRelatorio.textContent = 'Carregando relatório...';
  try {
    const relatorio = await apiRequest('/professores/relatorio');
    const alunos = relatorio.alunos || [];
    const perguntas = relatorio.perguntas || [];
    const totalRespostas = alunos.reduce((total, aluno) => total + Number(aluno.respondidas), 0);
    const totalAcertos = alunos.reduce((total, aluno) => total + Number(aluno.acertos), 0);

    document.getElementById('totalAlunos').textContent = alunos.length;
    document.getElementById('totalRespostas').textContent = totalRespostas;
    document.getElementById('percentualAcertos').textContent = totalRespostas
      ? `${Math.round((totalAcertos / totalRespostas) * 100)}%`
      : '0%';
    renderizarAlunos(alunos);
    const comAcertos = perguntas.filter((pergunta) => Number(pergunta.acertos) > 0);
    const comErros = perguntas.filter((pergunta) => Number(pergunta.erros) > 0);
    renderizarPerguntas(
      comAcertos.sort((a, b) => Number(b.acertos) - Number(a.acertos)),
      perguntasAcertadas,
      'acertos',
      'Nenhum acerto registrado ainda.'
    );
    renderizarPerguntas(
      comErros.sort((a, b) => Number(b.erros) - Number(a.erros)),
      perguntasErradas,
      'erros',
      'Nenhum erro registrado ainda.'
    );
    mensagemRelatorio.textContent = '';
  } catch (error) {
    mensagemRelatorio.textContent = error.message;
  }
}

document.getElementById('atualizarRelatorio').addEventListener('click', carregarRelatorio);

async function enviarPergunta(evento, endpoint, mensagemId) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const mensagem = document.getElementById(mensagemId);
  const dados = Object.fromEntries(new FormData(formulario).entries());
  mensagem.textContent = 'Salvando pergunta...';
  try {
    const resposta = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(dados)
    });
    mensagem.textContent = resposta.message;
    formulario.reset();
  } catch (error) {
    mensagem.textContent = error.message;
  }
}

document.getElementById('formPerguntaQuiz').addEventListener('submit', (evento) => {
  enviarPergunta(evento, '/professores/perguntas', 'mensagemPerguntaQuiz');
});

document.getElementById('formPerguntaCorrida').addEventListener('submit', (evento) => {
  enviarPergunta(evento, '/professores/palavras-corrida', 'mensagemPerguntaCorrida');
});

window.authReady.then((usuario) => {
  if (usuario?.perfil === 'professor') carregarRelatorio();
});