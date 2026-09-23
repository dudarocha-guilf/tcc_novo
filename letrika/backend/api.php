<?php

declare(strict_types=1);

session_start();
require __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $data): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function requestBody(): array
{
    $body = json_decode(file_get_contents('php://input'), true);
    return is_array($body) ? $body : [];
}

function executeQuery(mysqli $db, string $sql, string $types = '', array $params = []): mysqli_stmt
{
    $statement = $db->prepare($sql);
    if (!$statement) {
        throw new RuntimeException($db->error);
    }

    if ($types !== '') {
        $values = [$types, ...$params];
        $references = [];
        foreach ($values as $key => &$value) {
            $references[$key] = &$value;
        }
        if (!call_user_func_array([$statement, 'bind_param'], $references)) {
            throw new RuntimeException($statement->error);
        }
    }

    if (!$statement->execute()) {
        throw new RuntimeException($statement->error);
    }

    return $statement;
}

function fetchRows(mysqli_stmt $statement): array
{
    $result = $statement->get_result();
    return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
}

function requireAuth(): array
{
    if (empty($_SESSION['user'])) {
        respond(401, ['message' => 'Você precisa entrar para acessar esta área.']);
    }

    return $_SESSION['user'];
}

function getPath(): string
{
    if (!empty($_GET['path'])) {
        return trim((string) $_GET['path'], '/');
    }

    if (!empty($_SERVER['PATH_INFO'])) {
        return trim($_SERVER['PATH_INFO'], '/');
    }

    $requestUri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
    $position = strpos($requestUri, '/api.php');
    return $position === false ? '' : trim(substr($requestUri, $position + 8), '/');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$segments = array_values(array_filter(explode('/', getPath()), static fn ($part) => $part !== ''));
$body = requestBody();

try {
    if ($method === 'POST' && $segments === ['auth', 'register']) {
        $nome = trim((string) ($body['nome'] ?? ''));
        $nomeUsuario = trim((string) ($body['nome_usuario'] ?? ''));
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $senha = (string) ($body['senha'] ?? '');
        $confirmarSenha = (string) ($body['confirmarSenha'] ?? '');

        if ($nome === '' || $nomeUsuario === '' || $email === '' || $senha === '' || $confirmarSenha === '') {
            respond(400, ['message' => 'Preencha todos os campos.']);
        }
        if (strlen($nome) < 2) {
            respond(400, ['message' => 'O nome deve ter pelo menos 2 caracteres.']);
        }
        if (strlen($nomeUsuario) < 3) {
            respond(400, ['message' => 'O nome de usuário deve ter pelo menos 3 caracteres.']);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            respond(400, ['message' => 'Digite um e-mail válido.']);
        }
        if (strlen($senha) < 6) {
            respond(400, ['message' => 'A senha deve ter pelo menos 6 caracteres.']);
        }
        if ($senha !== $confirmarSenha) {
            respond(400, ['message' => 'As senhas não conferem.']);
        }

        $existing = fetchRows(executeQuery(
            $db,
            'SELECT email, nome_usuario FROM usuarios WHERE email = ? OR nome_usuario = ?',
            'ss',
            [$email, $nomeUsuario]
        ));
        if ($existing) {
            respond(409, [
                'message' => $existing[0]['email'] === $email
                    ? 'Este e-mail já está cadastrado.'
                    : 'Este nome de usuário já está em uso.'
            ]);
        }

        $hash = password_hash($senha, PASSWORD_BCRYPT);
        $statement = executeQuery(
            $db,
            'INSERT INTO usuarios (nome, nome_usuario, email, senha, avatar) VALUES (?, ?, ?, ?, ?)',
            'sssss',
            [$nome, $nomeUsuario, $email, $hash, 'default-avatar.png']
        );
        respond(201, [
            'message' => 'Cadastro realizado com sucesso!',
            'usuario' => [
                'id' => $db->insert_id,
                'nome' => $nome,
                'nome_usuario' => $nomeUsuario,
                'email' => $email
            ]
        ]);
    }

    if ($method === 'POST' && $segments === ['auth', 'login']) {
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $senha = (string) ($body['senha'] ?? '');
        if ($email === '' || $senha === '') {
            respond(400, ['message' => 'Informe e-mail e senha.']);
        }

        $rows = fetchRows(executeQuery($db, 'SELECT * FROM usuarios WHERE email = ?', 's', [$email]));
        if (!$rows || !password_verify($senha, $rows[0]['senha'])) {
            respond(401, ['message' => 'E-mail ou senha incorretos.']);
        }

        $usuario = $rows[0];
        $_SESSION['user'] = [
            'id' => (int) $usuario['id'],
            'nome' => $usuario['nome'],
            'nome_usuario' => $usuario['nome_usuario'],
            'email' => $usuario['email'],
            'avatar' => $usuario['avatar']
        ];
        respond(200, ['message' => 'Login realizado com sucesso!', 'usuario' => $_SESSION['user']]);
    }

    if ($method === 'POST' && $segments === ['auth', 'logout']) {
        session_destroy();
        respond(200, ['message' => 'Logout realizado com sucesso!']);
    }

    if ($method === 'GET' && $segments === ['auth', 'me']) {
        $user = requireAuth();
        $rows = fetchRows(executeQuery(
            $db,
            'SELECT id, nome, nome_usuario, email, avatar, data_cadastro FROM usuarios WHERE id = ?',
            'i',
            [(int) $user['id']]
        ));
        if (!$rows) {
            respond(404, ['message' => 'Usuário não encontrado.']);
        }
        respond(200, ['usuario' => $rows[0]]);
    }

    if (count($segments) === 2 && $segments[0] === 'usuarios') {
        $user = requireAuth();
        $id = (int) $segments[1];

        if ($method === 'GET') {
            $rows = fetchRows(executeQuery(
                $db,
                'SELECT id, nome, nome_usuario, email, avatar, data_cadastro FROM usuarios WHERE id = ?',
                'i',
                [$id]
            ));
            respond($rows ? 200 : 404, $rows ? ['usuario' => $rows[0]] : ['message' => 'Usuário não encontrado.']);
        }

        if ($method === 'PUT') {
            $nome = trim((string) ($body['nome'] ?? ''));
            $nomeUsuario = trim((string) ($body['nome_usuario'] ?? ''));
            $email = strtolower(trim((string) ($body['email'] ?? '')));
            $avatar = (string) ($body['avatar'] ?? 'default-avatar.png');
            if ($nome === '' || $nomeUsuario === '' || $email === '') {
                respond(400, ['message' => 'Nome, nome de usuário e e-mail são obrigatórios.']);
            }
            $existing = fetchRows(executeQuery(
                $db,
                'SELECT id FROM usuarios WHERE (email = ? OR nome_usuario = ?) AND id != ?',
                'ssi',
                [$email, $nomeUsuario, $id]
            ));
            if ($existing) {
                respond(409, ['message' => 'E-mail ou nome de usuário já em uso.']);
            }
            executeQuery(
                $db,
                'UPDATE usuarios SET nome = ?, nome_usuario = ?, email = ?, avatar = ? WHERE id = ?',
                'ssssi',
                [$nome, $nomeUsuario, $email, $avatar, $id]
            );
            respond(200, ['message' => 'Perfil atualizado com sucesso!']);
        }

        if ($method === 'DELETE') {
            if ((int) $user['id'] !== $id) {
                respond(403, ['message' => 'Você só pode excluir a própria conta.']);
            }
            $statement = executeQuery($db, 'DELETE FROM usuarios WHERE id = ?', 'i', [$id]);
            if ($statement->affected_rows === 0) {
                respond(404, ['message' => 'Conta não encontrada.']);
            }
            session_destroy();
            respond(200, ['message' => 'Sua conta foi excluída com sucesso.']);
        }
    }

    if ($method === 'GET' && $segments === ['jogos']) {
        $rows = fetchRows(executeQuery($db, 'SELECT * FROM jogos WHERE ativo = 1 ORDER BY id'));
        respond(200, ['jogos' => $rows]);
    }

    if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'jogos') {
        $rows = fetchRows(executeQuery($db, 'SELECT * FROM jogos WHERE id = ? AND ativo = 1', 'i', [(int) $segments[1]]));
        respond($rows ? 200 : 404, $rows ? ['jogo' => $rows[0]] : ['message' => 'Jogo não encontrado.']);
    }

    if ($method === 'GET' && $segments === ['perguntas']) {
        $rows = fetchRows(executeQuery($db, 'SELECT * FROM perguntas WHERE ativo = 1 ORDER BY id'));
        respond(200, ['perguntas' => $rows]);
    }

    if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'perguntas') {
        $rows = fetchRows(executeQuery($db, 'SELECT * FROM perguntas WHERE id = ? AND ativo = 1', 'i', [(int) $segments[1]]));
        respond($rows ? 200 : 404, $rows ? ['pergunta' => $rows[0]] : ['message' => 'Pergunta não encontrada.']);
    }

    if ($segments === ['pontuacoes'] && $method === 'POST') {
        $user = requireAuth();
        $jogoId = (int) ($body['jogo_id'] ?? 0);
        $pontuacao = $body['pontuacao'] ?? null;
        if (!$jogoId || ($pontuacao === null || $pontuacao === '')) {
            respond(400, ['message' => 'Jogo e pontuação são obrigatórios.']);
        }
        if (!is_numeric($pontuacao) || (float) $pontuacao < 0) {
            respond(400, ['message' => 'Pontuação inválida.']);
        }
        executeQuery($db, 'INSERT INTO pontuacoes (usuario_id, jogo_id, pontuacao) VALUES (?, ?, ?)', 'iii', [(int) $user['id'], $jogoId, (int) $pontuacao]);
        respond(201, ['message' => 'Pontuação salva com sucesso!']);
    }

    if (count($segments) === 2 && $segments[0] === 'pontuacoes' && $method === 'GET') {
        $rows = fetchRows(executeQuery(
            $db,
            'SELECT p.id, p.pontuacao, p.data_partida, j.nome AS jogo_nome FROM pontuacoes p INNER JOIN jogos j ON j.id = p.jogo_id WHERE p.usuario_id = ? ORDER BY p.data_partida DESC',
            'i',
            [(int) $segments[1]]
        ));
        respond(200, ['pontuacoes' => $rows]);
    }

    if ($method === 'GET' && $segments === ['ranking']) {
        $rows = fetchRows(executeQuery($db, 'SELECT u.id, u.nome, u.avatar, u.nome_usuario, COALESCE(SUM(p.pontuacao), 0) AS pontuacao_total FROM usuarios u LEFT JOIN pontuacoes p ON p.usuario_id = u.id GROUP BY u.id, u.nome, u.avatar, u.nome_usuario ORDER BY pontuacao_total DESC, u.nome ASC LIMIT 20'));
        respond(200, ['ranking' => $rows]);
    }

    if ($method === 'GET' && count($segments) === 3 && $segments[0] === 'ranking' && $segments[1] === 'jogo') {
        $rows = fetchRows(executeQuery($db, 'SELECT u.id, u.nome, u.avatar, u.nome_usuario, SUM(p.pontuacao) AS pontuacao_total FROM usuarios u INNER JOIN pontuacoes p ON p.usuario_id = u.id WHERE p.jogo_id = ? GROUP BY u.id, u.nome, u.avatar, u.nome_usuario ORDER BY pontuacao_total DESC, u.nome ASC', 'i', [(int) $segments[2]]));
        respond(200, ['ranking' => $rows]);
    }

    if ($segments === ['roupinhas'] && $method === 'GET') {
        $user = requireAuth();
        $rows = fetchRows(executeQuery($db, 'SELECT id, emoji, nome, equipada, data_conquista FROM roupinhas_usuario WHERE usuario_id = ? ORDER BY data_conquista ASC', 'i', [(int) $user['id']]));
        respond(200, ['roupinhas' => $rows]);
    }

    if ($segments === ['roupinhas'] && $method === 'POST') {
        $user = requireAuth();
        $emoji = (string) ($body['emoji'] ?? '');
        $nome = (string) ($body['nome'] ?? '');
        if ($emoji === '' || $nome === '') {
            respond(400, ['message' => 'Emoji e nome da roupinha são obrigatórios.']);
        }
        executeQuery($db, 'INSERT INTO roupinhas_usuario (usuario_id, emoji, nome) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE nome = VALUES(nome)', 'iss', [(int) $user['id'], $emoji, $nome]);
        respond(201, ['message' => 'Roupinha guardada na sua coleção.']);
    }

    if ($segments === ['roupinhas', 'equipada'] && $method === 'PUT') {
        $user = requireAuth();
        $emoji = (string) ($body['emoji'] ?? '');
        $db->begin_transaction();
        try {
            executeQuery($db, 'UPDATE roupinhas_usuario SET equipada = 0 WHERE usuario_id = ?', 'i', [(int) $user['id']]);
            $statement = executeQuery($db, 'UPDATE roupinhas_usuario SET equipada = 1 WHERE usuario_id = ? AND emoji = ?', 'is', [(int) $user['id'], $emoji]);
            if ($statement->affected_rows === 0) {
                $db->rollback();
                respond(404, ['message' => 'Essa roupinha ainda não foi conquistada.']);
            }
            $db->commit();
            respond(200, ['message' => 'Roupinha equipada!']);
        } catch (Throwable $error) {
            $db->rollback();
            throw $error;
        }
    }

    respond(404, ['message' => 'Rota não encontrada.']);
} catch (Throwable $error) {
    error_log($error->getMessage());
    respond(500, ['message' => 'Erro interno do servidor.']);
}
