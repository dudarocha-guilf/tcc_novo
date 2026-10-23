
const currentPage = window.location.pathname.split('/').pop();

const protectedPages = [
  'dashboard.html',
  'perfil.html',
  'ranking.html',
  'corrida.html',
  'quiz.html',
  'guarda-roupa.html',
  'professores.html',
  'progresso.html'
];

// Verifica se o usuário está autenticado.
window.authReady = protectedPages.includes(currentPage)
  ? apiRequest('/auth/me')
      .then((data) => {
        if (!data || !data.usuario) {
          throw new Error('Não foi possível carregar sua conta.');
        }

        const usuario = data.usuario;

        localStorage.setItem(
          'letrikaUsuario',
          JSON.stringify(usuario)
        );

        if (
          currentPage === 'professores.html' &&
          usuario.perfil !== 'professor'
        ) {
          window.location.replace('dashboard.html');
          return null;
        }

        if (usuario.perfil === 'professor') {
          const nav = document.querySelector('.topbar nav');

          if (
            nav &&
            !nav.querySelector('a[href="professores.html"]')
          ) {
            const link = document.createElement('a');
            link.href = 'professores.html';
            link.textContent = 'Professores';

            const logout = nav.querySelector('#logoutBtn');

            if (logout) {
              nav.insertBefore(link, logout);
            } else {
              nav.appendChild(link);
            }
          }
        }

        return usuario;
      })
      .catch((error) => {
        console.error('Erro ao verificar sessão:', error);

        localStorage.removeItem('letrikaUsuario');

        if (currentPage !== 'login.html') {
          window.location.replace('login.html?v=7');
        }

        throw error;
      })
  : Promise.resolve(null);


document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // LOGIN
  // ==========================================

  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const emailInput = document.getElementById('email');
      const senhaInput = document.getElementById('senha');
      const perfilInput = document.getElementById('perfil');
      const mensagem = document.getElementById('mensagem');

      const botao = loginForm.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      if (!emailInput || !senhaInput || !mensagem) {
        console.error(
          'Confira se o formulário possui os IDs loginForm, email, senha e mensagem.'
        );
        return;
      }

      const email = emailInput.value.trim();
      const senha = senhaInput.value;
      const perfil = perfilInput?.value || 'aluno';

      if (!email || !senha) {
        mensagem.textContent = 'Digite seu e-mail e sua senha.';
        return;
      }

      if (botao) botao.disabled = true;

      mensagem.textContent = 'Verificando seus dados...';

      try {
        const data = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            senha,
            perfil
          })
        });

        if (!data || !data.usuario || !data.usuario.id) {
          console.error('Resposta da API:', data);

          throw new Error(
            'O servidor não retornou os dados da conta.'
          );
        }

        if (
          !['aluno', 'professor'].includes(data.usuario.perfil)
        ) {
          console.error('Perfil recebido:', data.usuario);

          throw new Error(
            'O servidor não informou o tipo da conta.'
          );
        }

        localStorage.setItem(
          'letrikaUsuario',
          JSON.stringify(data.usuario)
        );

        mensagem.textContent = 'Login realizado! Abrindo o Letrika...';

        const destino =
          data.usuario.perfil === 'professor'
            ? 'professores.html'
            : 'dashboard.html';

        window.location.assign(destino);

      } catch (error) {
        console.error('Erro no login:', error);

        mensagem.textContent =
          error.message || 'Não foi possível entrar. Tente novamente.';

        if (botao) botao.disabled = false;
      }
    });
  }


  // ==========================================
  // CADASTRO
  // ==========================================

  const cadastroForm = document.getElementById('cadastroForm');

  if (cadastroForm) {
    const perfilCadastro =
      document.getElementById('perfilCadastro');

    const codigoProfessorCampo =
      document.getElementById('codigoProfessorCampo');

    const codigoProfessor =
      document.getElementById('codigoProfessor');

    function atualizarCampoProfessor() {
      if (
        !perfilCadastro ||
        !codigoProfessorCampo ||
        !codigoProfessor
      ) {
        return;
      }

      const professor = perfilCadastro.value === 'professor';

      codigoProfessorCampo.hidden = !professor;
      codigoProfessor.required = professor;
    }

    if (perfilCadastro) {
      perfilCadastro.addEventListener(
        'change',
        atualizarCampoProfessor
      );

      atualizarCampoProfessor();
    }

    cadastroForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const mensagem = document.getElementById('mensagem');

      const valor = (id) =>
        document.getElementById(id)?.value?.trim() || '';

      const dados = {
        nome: valor('nome'),
        nome_usuario: valor('nome_usuario'),
        email: valor('email'),
        senha: document.getElementById('senha')?.value || '',
        confirmarSenha:
          document.getElementById('confirmarSenha')?.value || '',
        perfil: perfilCadastro?.value || 'aluno',
        codigo_professor: valor('codigoProfessor')
      };

      const botao = cadastroForm.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      if (!mensagem) return;

      if (botao) botao.disabled = true;

      mensagem.textContent = 'Criando conta...';

      try {
        const data = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify(dados)
        });

        mensagem.textContent =
          data.message || 'Cadastro realizado com sucesso!';

        window.setTimeout(() => {
          window.location.assign('login.html?v=7');
        }, 1000);

      } catch (error) {
        console.error('Erro no cadastro:', error);

        mensagem.textContent =
          error.message || 'Não foi possível criar a conta.';

        if (botao) botao.disabled = false;
      }
    });
  }


  // ==========================================
  // SAIR DA CONTA
  // ==========================================

  const logoutBtn = document.getElementById('logoutBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      logoutBtn.disabled = true;

      try {
        await apiRequest('/auth/logout', {
          method: 'POST'
        });

        localStorage.removeItem('letrikaUsuario');

        window.location.replace('login.html?v=7');

      } catch (error) {
        console.error('Erro ao sair:', error);

        logoutBtn.disabled = false;

        const mensagem =
          document.getElementById('perfilMensagem');

        if (mensagem) {
          mensagem.textContent =
            error.message || 'Não foi possível sair da conta.';
        }
      }
    });
  }

});
