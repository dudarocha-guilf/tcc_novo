document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value;
      const mensagem = document.getElementById('mensagem');

      try {
        mensagem.textContent = 'Entrando...';
        const data = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, senha })
        });

        mensagem.textContent = data.message;
        localStorage.setItem('letrikaUsuario', JSON.stringify(data.usuario));
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } catch (error) {
        mensagem.textContent = error.message;
      }
    });
  }

  const cadastroForm = document.getElementById('cadastroForm');
  if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const mensagem = document.getElementById('mensagem');
      const dados = {
        nome: document.getElementById('nome').value,
        nome_usuario: document.getElementById('nome_usuario').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        confirmarSenha: document.getElementById('confirmarSenha').value
      };

      try {
        mensagem.textContent = 'Criando conta...';
        const data = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify(dados)
        });

        mensagem.textContent = data.message;
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
      } catch (error) {
        mensagem.textContent = error.message;
      }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
        localStorage.removeItem('letrikaUsuario');
        window.location.href = 'login.html';
      } catch (error) {
        console.error(error);
      }
    });
  }

  const currentPage = window.location.pathname.split('/').pop();
  const protectedPages = ['dashboard.html', 'perfil.html', 'ranking.html', 'corrida.html', 'quiz.html', 'guarda-roupa.html'];

  if (protectedPages.includes(currentPage)) {
    fetch(`${API_BASE_URL}/auth/me`, { method: 'GET', credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Não autenticado');
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('letrikaUsuario', JSON.stringify(data.usuario));
      })
      .catch(() => {
        window.location.href = 'login.html';
      });
  }
});
