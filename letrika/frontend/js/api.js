
const API_BASE_URL = '../backend/api.php?path=';

async function apiRequest(endpoint, options = {}) {
  const caminho = String(endpoint).replace(/^\/+/, '');
  const url = `${API_BASE_URL}${caminho}`;

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const texto = await response.text();
  let data;

  try {
    data = JSON.parse(texto);
  } catch (error) {
    console.error('Endereço solicitado:', url);
    console.error('Resposta do servidor:', texto);

    throw new Error(
      `Resposta inválida do servidor (HTTP ${response.status}). ` +
      'Confira o caminho do backend.'
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Erro na requisição (${response.status}).`
    );
  }

  return data;
}
