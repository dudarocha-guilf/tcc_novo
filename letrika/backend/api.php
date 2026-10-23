
<?php

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

function getProfessorSignupCode(): string
{
    $environmentCode = getenv('CODIGO_PROFESSOR');

    if ($environmentCode !== false && trim($environmentCode) !== '') {
        return trim($environmentCode);
    }

    $environmentFile = __DIR__ . '/.env';

    $settings = is_file($environmentFile)
        ? @parse_ini_file($environmentFile, false, INI_SCANNER_RAW)
        : false;

    return is_array($settings)
        ? trim((string) ($settings['CODIGO_PROFESSOR'] ?? ''))
        : '';
}

function executeQuery(
    mysqli $db,
    string $sql,
    string $types = '',
    array $params = []
): mysqli_stmt {
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

        if (!call_user_func_array(
            [$statement, 'bind_param'],
            $references
        )) {
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

    return $result
        ? $result->fetch_all(MYSQLI_ASSOC)
        : [];
}

function requireAuth(): array
{
    if (empty($_SESSION['user'])) {
        respond(401, [
            'message' => 'Você precisa entrar para acessar esta área.'
        ]);
    }

    return $_SESSION['user'];
}

function requireProfessor(): array
{
    $user = requireAuth();

    if (($user['perfil'] ?? 'aluno') !== 'professor') {
        respond(403, [
            'message' => 'Acesso permitido apenas para professores.'
        ]);
    }

    return $user;
}

function getPath(): string
{
    if (!empty($_GET['path'])) {
        return trim((string) $_GET['path'], '/');
    }

    if (!empty($_SERVER['PATH_INFO'])) {
        return trim($_SERVER['PATH_INFO'], '/');
    }

    $requestUri = parse_url(
        $_SERVER['REQUEST_URI'] ?? '',
        PHP_URL_PATH
    ) ?: '';

    $position = strpos($requestUri, '/api.php');

    return $position === false
        ? ''
        : trim(substr($requestUri, $position + 8), '/');
}

function validarDadosPerfil(
    string $nome,
    string $nomeUsuario,
    string $email,
    string $avatar
): void {
    if ($nome === '' || $nomeUsuario === '' || $email === '') {
        respond(400, [
            'message' =>
                'Nome, nome de usuário e e-mail são obrigatórios.'
        ]);
    }

    if (strlen($nome) < 2 || strlen($nome) > 100) {
        respond(400, [
            'message' => 'O nome deve ter entre 2 e 100 caracteres.'
        ]);
    }

    if (strlen($nomeUsuario) < 3 || strlen($nomeUsuario) > 50) {
        respond(400, [
            'message' =>
                'O nome de usuário deve ter entre 3 e 50 caracteres.'
        ]);
    }

    if (
        strlen($email) > 100 ||
        !filter_var($email, FILTER_VALIDATE_EMAIL)
    ) {
        respond(400, [
            'message' => 'Digite um e-mail válido.'
        ]);
    }

    if ($avatar === '' || strlen($avatar) > 100) {
        respond(400, [
            'message' => 'Selecione um avatar válido.'
        ]);
    }
}

function obterUsuarioPorId(mysqli $db, int $id): array
{
    $rows = fetchRows(executeQuery(
        $db,
        'SELECT id, nome, nome_usuario, email, avatar, data_cadastro
         FROM usuarios
         WHERE id = ?',
        'i',
        [$id]
    ));

    if (!$rows) {
        respond(404, [
            'message' => 'Usuário não encontrado.'
        ]);
    }

    return $rows[0];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$segments = array_values(array_filter(
    explode('/', getPath()),
    static fn ($part) => $part !== ''
));

$body = requestBody();

try {

    /*
    |--------------------------------------------------------------------------
    | CADASTRO
    |--------------------------------------------------------------------------
    */

    if ($method === 'POST' && $segments === ['auth', 'register']) {
        $nome = trim((string) ($body['nome'] ?? ''));
        $nomeUsuario = trim((string) ($body['nome_usuario'] ?? ''));
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $senha = (string) ($body['senha'] ?? '');
        $confirmarSenha = (string) ($body['confirmarSenha'] ?? '');
        $perfil = (string) ($body['perfil'] ?? 'aluno');
        $codigoProfessor = (string) ($body['codigo_professor'] ?? '');

        if (
            $nome === '' ||
            $nomeUsuario === '' ||
            $email === '' ||
            $senha === '' ||
            $confirmarSenha === ''
        ) {
            respond(400, [
                'message' => 'Preencha todos os campos.'
            ]);
        }

        if (strlen($nome) < 2 || strlen($nome) > 100) {
            respond(400, [
                'message' => 'O nome deve ter entre 2 e 100 caracteres.'
            ]);
        }

        if (
            strlen($nomeUsuario) < 3 ||
            strlen($nomeUsuario) > 50
        ) {
            respond(400, [
                'message' =>
                    'O nome de usuário deve ter entre 3 e 50 caracteres.'
            ]);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 100) {
            respond(400, [
                'message' => 'Digite um e-mail válido.'
            ]);
        }

        if (strlen($senha) < 6) {
            respond(400, [
                'message' => 'A senha deve ter pelo menos 6 caracteres.'
            ]);
        }

        if ($senha !== $confirmarSenha) {
            respond(400, [
                'message' => 'As senhas não conferem.'
            ]);
        }

        if (!in_array($perfil, ['aluno', 'professor'], true)) {
            respond(400, [
                'message' => 'Selecione estudante ou professor.'
            ]);
        }

        if ($perfil === 'professor') {
            $codigoConfigurado = getProfessorSignupCode();

            if ($codigoConfigurado === '') {
                respond(503, [
                    'message' =>
                        'O cadastro de professores ainda não está habilitado.'
                ]);
            }

            if (!hash_equals($codigoConfigurado, $codigoProfessor)) {
                respond(403, [
                    'message' => 'Código de convite do professor inválido.'
                ]);
            }
        }

        $existing = fetchRows(executeQuery(
            $db,
            'SELECT email, nome_usuario
             FROM usuarios
             WHERE email = ? OR nome_usuario = ?',
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
        $avatar = 'default-avatar.png';

        executeQuery(
            $db,
            'INSERT INTO usuarios
             (nome, nome_usuario, email, senha, perfil, avatar)
             VALUES (?, ?, ?, ?, ?, ?)',
            'ssssss',
            [
                $nome,
                $nomeUsuario,
                $email,
                $hash,
                $perfil,
                $avatar
            ]
        );

        respond(201, [
            'message' => 'Cadastro realizado com sucesso!',
            'usuario' => [
                'id' => $db->insert_id,
                'nome' => $nome,
                'nome_usuario' => $nomeUsuario,
                'email' => $email,
                'perfil' => $perfil,
                'avatar' => $avatar
            ]
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    if ($method === 'POST' && $segments === ['auth', 'login']) {
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $senha = (string) ($body['senha'] ?? '');

        if ($email === '' || $senha === '') {
            respond(400, [
                'message' => 'Informe e-mail e senha.'
            ]);
        }

        $rows = fetchRows(executeQuery(
            $db,
            'SELECT * FROM usuarios WHERE email = ?',
            's',
            [$email]
        ));

        if (!$rows || !password_verify($senha, $rows[0]['senha'])) {
            respond(401, [
                'message' => 'E-mail ou senha incorretos.'
            ]);
        }

        $usuario = $rows[0];
        $perfilConta = $usuario['perfil'] ?? 'aluno';
        $perfilSolicitado = (string) ($body['perfil'] ?? 'aluno');

        if (!in_array($perfilSolicitado, ['aluno', 'professor'], true)) {
            respond(400, [
                'message' => 'Selecione estudante ou professor.'
            ]);
        }

        if ($perfilSolicitado !== $perfilConta) {
            respond(403, [
                'message' =>
                    'O tipo de acesso selecionado não corresponde a esta conta.'
            ]);
        }

        session_regenerate_id(true);

        $_SESSION['user'] = [
            'id' => (int) $usuario['id'],
            'nome' => $usuario['nome'],
            'nome_usuario' => $usuario['nome_usuario'],
            'email' => $usuario['email'],
            'perfil' => $perfilConta,
            'avatar' => $usuario['avatar']
        ];

        respond(200, [
            'message' => 'Login realizado com sucesso!',
            'usuario' => $_SESSION['user']
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    if ($method === 'POST' && $segments === ['auth', 'logout']) {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $cookie = session_get_cookie_params();

            setcookie(
                session_name(),
                '',
                time() - 42000,
                $cookie['path'],
                $cookie['domain'],
                $cookie['secure'],
                $cookie['httponly']
            );
        }

        session_destroy();

        respond(200, [
            'message' => 'Logout realizado com sucesso!'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | USUÁRIO DA SESSÃO ATUAL
    |--------------------------------------------------------------------------
    */

    if ($method === 'GET' && $segments === ['auth', 'me']) {
        $user = requireAuth();

        $usuario = obterUsuarioPorId(
            $db,
            (int) $user['id']
        );

        $usuario['perfil'] = $user['perfil'] ?? 'aluno';

        respond(200, [
            'usuario' => $usuario
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PERFIL: CONSULTAR, EDITAR E EXCLUIR
    |--------------------------------------------------------------------------
    */

    if (
        count($segments) === 2 &&
        $segments[0] === 'usuarios'
    ) {
        $user = requireAuth();
        $id = filter_var(
            $segments[1],
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1]]
        );

        if ($id === false) {
            respond(400, [
                'message' => 'Identificação de usuário inválida.'
            ]);
        }

        $id = (int) $id;

        if ((int) $user['id'] !== $id) {
            respond(403, [
                'message' =>
                    'Você só pode acessar e modificar a própria conta.'
            ]);
        }

        /*
        |------------------------------------------------------------------
        | Consultar perfil
        |------------------------------------------------------------------
        */

        if ($method === 'GET') {
            $usuario = obterUsuarioPorId($db, $id);
            $usuario['perfil'] = $user['perfil'] ?? 'aluno';

            respond(200, [
                'usuario' => $usuario
            ]);
        }

        /*
        |------------------------------------------------------------------
        | Editar perfil
        |------------------------------------------------------------------
        */

        if ($method === 'PUT') {
            $nome = trim((string) ($body['nome'] ?? ''));
            $nomeUsuario = trim((string) ($body['nome_usuario'] ?? ''));
            $email = strtolower(trim((string) ($body['email'] ?? '')));
            $avatar = trim((string) ($body['avatar'] ?? ''));

            validarDadosPerfil(
                $nome,
                $nomeUsuario,
                $email,
                $avatar
            );

            $existing = fetchRows(executeQuery(
                $db,
                'SELECT id
                 FROM usuarios
                 WHERE (email = ? OR nome_usuario = ?)
                   AND id != ?',
                'ssi',
                [$email, $nomeUsuario, $id]
            ));

            if ($existing) {
                respond(409, [
                    'message' =>
                        'E-mail ou nome de usuário já está em uso.'
                ]);
            }

            executeQuery(
                $db,
                'UPDATE usuarios
                 SET nome = ?,
                     nome_usuario = ?,
                     email = ?,
                     avatar = ?
                 WHERE id = ?',
                'ssssi',
                [
                    $nome,
                    $nomeUsuario,
                    $email,
                    $avatar,
                    $id
                ]
            );

            /*
             * Atualiza a sessão para que o novo nome, e-mail e avatar
             * sejam usados nas próximas requisições autenticadas.
             */
            $_SESSION['user']['id'] = $id;
            $_SESSION['user']['nome'] = $nome;
            $_SESSION['user']['nome_usuario'] = $nomeUsuario;
            $_SESSION['user']['email'] = $email;
            $_SESSION['user']['avatar'] = $avatar;

            respond(200, [
                'message' => 'Perfil atualizado com sucesso!',
                'usuario' => [
                    'id' => $id,
                    'nome' => $nome,
                    'nome_usuario' => $nomeUsuario,
                    'email' => $email,
                    'avatar' => $avatar,
                    'perfil' => $user['perfil'] ?? 'aluno'
                ]
            ]);
        }

        /*
        |------------------------------------------------------------------
        | Excluir conta
        |------------------------------------------------------------------
        */

        if ($method === 'DELETE') {
            $statement = executeQuery(
                $db,
                'DELETE FROM usuarios WHERE id = ?',
                'i',
                [$id]
            );

            if ($statement->affected_rows === 0) {
                respond(404, [
                    'message' => 'Conta não encontrada.'
                ]);
            }

            $_SESSION = [];
            session_destroy();

            respond(200, [
                'message' => 'Sua conta foi excluída com sucesso.'
            ]);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | JOGOS
    |--------------------------------------------------------------------------
    */

    if ($method === 'GET' && $segments === ['jogos']) {
        $rows = fetchRows(executeQuery(
            $db,
            'SELECT * FROM jogos
             WHERE ativo = 1
             ORDER BY id'
        ));

        respond(200, ['jogos' => $rows]);
    }

    if (
        $method === 'GET' &&
        count($segments) === 2 &&
        $segments[0] === 'jogos'
    ) {
        $rows = fetchRows(executeQuery(
            $db,
            'SELECT * FROM jogos
             WHERE id = ? AND ativo = 1',
            'i',
            [(int) $segments[1]]
        ));

        respond(
            $rows ? 200 : 404,
            $rows
                ? ['jogo' => $rows[0]]
                : ['message' => 'Jogo não encontrado.']
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PERGUNTAS
    |--------------------------------------------------------------------------
    */

    if ($method === 'GET' && $segments === ['perguntas']) {
        $rows = fetchRows(executeQuery(
            $db,
            'SELECT * FROM perguntas
             WHERE ativo = 1
             ORDER BY id'
        ));

        respond(200, ['perguntas' => $rows]);
    }

    if (
        $method === 'GET' &&
        count($segments) === 2 &&
        $segments[0] === 'perguntas'
    ) {
        $rows = fetchRows(executeQuery(
            $db,
            'SELECT * FROM perguntas
             WHERE id = ? AND ativo = 1',
            'i',
            [(int) $segments[1]]
        ));

        respond(
            $rows ? 200 : 404,
            $rows
                ? ['pergunta' => $rows[0]]
                : ['message' => 'Pergunta não encontrada.']
        );
    }

    /*
    |--------------------------------------------------------------------------
    | PROFESSOR: ADICIONAR PERGUNTA DO QUIZ
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'POST' &&
        $segments === ['professores', 'perguntas']
    ) {
        requireProfessor();

        $palavra = trim((string) ($body['palavra'] ?? ''));
        $pergunta = trim((string) ($body['pergunta'] ?? ''));
        $alternativaA = trim((string) ($body['alternativa_a'] ?? ''));
        $alternativaB = trim((string) ($body['alternativa_b'] ?? ''));
        $alternativaC = trim((string) ($body['alternativa_c'] ?? ''));
        $respostaCorreta = strtoupper(
            trim((string) ($body['resposta_correta'] ?? ''))
        );
        $explicacao = trim((string) ($body['explicacao'] ?? ''));
        $dificuldade = (string) ($body['dificuldade'] ?? 'facil');

        if (
            $palavra === '' ||
            $pergunta === '' ||
            $alternativaA === '' ||
            $alternativaB === '' ||
            $alternativaC === '' ||
            !in_array($respostaCorreta, ['A', 'B', 'C'], true) ||
            !in_array($dificuldade, ['facil', 'medio', 'dificil'], true)
        ) {
            respond(400, [
                'message' =>
                    'Preencha a pergunta, as três alternativas, a resposta correta e a dificuldade.'
            ]);
        }

        $jogo = fetchRows(executeQuery(
            $db,
            "SELECT id FROM jogos
             WHERE tipo = 'quiz' AND ativo = 1
             ORDER BY id LIMIT 1"
        ));

        if (!$jogo) {
            respond(500, [
                'message' => 'O jogo de quiz não está configurado.'
            ]);
        }

        executeQuery(
            $db,
            'INSERT INTO perguntas
             (jogo_id, palavra, pergunta, alternativa_a, alternativa_b,
              alternativa_c, resposta_correta, explicacao, dificuldade)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            'issssssss',
            [
                (int) $jogo[0]['id'],
                $palavra,
                $pergunta,
                $alternativaA,
                $alternativaB,
                $alternativaC,
                $respostaCorreta,
                $explicacao,
                $dificuldade
            ]
        );

        respond(201, [
            'message' => 'Pergunta do quiz adicionada com sucesso.'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PALAVRAS DA CORRIDA
    |--------------------------------------------------------------------------
    */

    if ($method === 'GET' && $segments === ['palavras-corrida']) {
        $rows = fetchRows(executeQuery(
            $db,
            'SELECT * FROM palavras_corrida
             WHERE ativo = 1
             ORDER BY id'
        ));

        respond(200, ['palavras' => $rows]);
    }

    /*
    |--------------------------------------------------------------------------
    | PROFESSOR: ADICIONAR PALAVRA DA CORRIDA
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'POST' &&
        $segments === ['professores', 'palavras-corrida']
    ) {
        requireProfessor();

        $palavraIncorreta = trim(
            (string) ($body['palavra_incorreta'] ?? '')
        );
        $palavraCorreta = trim(
            (string) ($body['palavra_correta'] ?? '')
        );
        $alternativaA = trim((string) ($body['alternativa_a'] ?? ''));
        $alternativaB = trim((string) ($body['alternativa_b'] ?? ''));
        $respostaCorreta = strtoupper(
            trim((string) ($body['resposta_correta'] ?? ''))
        );
        $dificuldade = (string) ($body['dificuldade'] ?? 'facil');

        if (
            $palavraIncorreta === '' ||
            $palavraCorreta === '' ||
            $alternativaA === '' ||
            $alternativaB === '' ||
            !in_array($respostaCorreta, ['A', 'B'], true) ||
            !in_array($dificuldade, ['facil', 'medio', 'dificil'], true)
        ) {
            respond(400, [
                'message' =>
                    'Preencha as palavras, as duas alternativas, a resposta correta e a dificuldade.'
            ]);
        }

        $alternativaCorreta = $respostaCorreta === 'A'
            ? $alternativaA
            : $alternativaB;

        if ($alternativaCorreta !== $palavraCorreta) {
            respond(400, [
                'message' =>
                    'A alternativa marcada como correta deve ser igual à palavra correta.'
            ]);
        }

        $duplicada = fetchRows(executeQuery(
            $db,
            'SELECT id FROM palavras_corrida
             WHERE palavra_incorreta = ? AND palavra_correta = ?',
            'ss',
            [$palavraIncorreta, $palavraCorreta]
        ));

        if ($duplicada) {
            respond(409, [
                'message' => 'Essa palavra já foi cadastrada na corrida.'
            ]);
        }

        executeQuery(
            $db,
            'INSERT INTO palavras_corrida
             (palavra_incorreta, palavra_correta, alternativa_a,
              alternativa_b, resposta_correta, acao, dificuldade)
             VALUES (?, ?, ?, ?, ?, ?, ?)',
            'sssssss',
            [
                $palavraIncorreta,
                $palavraCorreta,
                $alternativaA,
                $alternativaB,
                $respostaCorreta,
                'continuar',
                $dificuldade
            ]
        );

        respond(201, [
            'message' => 'Pergunta da corrida adicionada com sucesso.'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | SALVAR PONTUAÇÃO
    |--------------------------------------------------------------------------
    */

    if ($segments === ['pontuacoes'] && $method === 'POST') {
        $user = requireAuth();

        $jogoId = (int) ($body['jogo_id'] ?? 0);
        $pontuacao = $body['pontuacao'] ?? null;

        if (
            !$jogoId ||
            $pontuacao === null ||
            $pontuacao === ''
        ) {
            respond(400, [
                'message' => 'Jogo e pontuação são obrigatórios.'
            ]);
        }

        if (!is_numeric($pontuacao) || (float) $pontuacao < 0) {
            respond(400, [
                'message' => 'Pontuação inválida.'
            ]);
        }

        executeQuery(
            $db,
            'INSERT INTO pontuacoes
             (usuario_id, jogo_id, pontuacao)
             VALUES (?, ?, ?)',
            'iii',
            [
                (int) $user['id'],
                $jogoId,
                (int) $pontuacao
            ]
        );

        respond(201, [
            'message' => 'Pontuação salva com sucesso!'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CONSULTAR PONTUAÇÕES DO PRÓPRIO USUÁRIO
    |--------------------------------------------------------------------------
    */

    if (
        count($segments) === 2 &&
        $segments[0] === 'pontuacoes' &&
        $method === 'GET'
    ) {
        $user = requireAuth();
        $id = (int) $segments[1];

        if ((int) $user['id'] !== $id) {
            respond(403, [
                'message' => 'Você só pode consultar suas próprias pontuações.'
            ]);
        }

        $rows = fetchRows(executeQuery(
            $db,
            'SELECT p.id, p.pontuacao, p.data_partida,
                    j.nome AS jogo_nome
             FROM pontuacoes p
             INNER JOIN jogos j ON j.id = p.jogo_id
             WHERE p.usuario_id = ?
             ORDER BY p.data_partida DESC',
            'i',
            [$id]
        ));

        respond(200, ['pontuacoes' => $rows]);
    }

    /*
    |--------------------------------------------------------------------------
    | SALVAR RESPOSTAS DO QUIZ
    |--------------------------------------------------------------------------
    */

    
    /*
    |--------------------------------------------------------------------------
    | CONSULTAR HISTÓRICO E ESTATÍSTICAS DO QUIZ
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $segments === ['respostas-quiz', 'historico']
    ) {
        $user = requireAuth();
        $usuarioId = (int) $user['id'];

        // Conta todas as respostas registradas para este estudante.
        $estatisticas = fetchRows(executeQuery(
            $db,
            'SELECT
                COUNT(*) AS total_respondidas,
                COALESCE(SUM(CASE WHEN acertou = 1 THEN 1 ELSE 0 END), 0) AS acertos,
                COALESCE(SUM(CASE WHEN acertou = 0 THEN 1 ELSE 0 END), 0) AS erros
             FROM respostas_quiz
             WHERE usuario_id = ?',
            'i',
            [$usuarioId]
        ));

        // Busca as 20 respostas mais recentes.
        $historico = fetchRows(executeQuery(
            $db,
            'SELECT
                id,
                pergunta,
                alternativa_escolhida,
                acertou
             FROM respostas_quiz
             WHERE usuario_id = ?
             ORDER BY id DESC
             LIMIT 20',
            'i',
            [$usuarioId]
        ));

        respond(200, [
            'estatisticas' => $estatisticas[0] ?? [
                'total_respondidas' => 0,
                'acertos' => 0,
                'erros' => 0
            ],
            'historico' => $historico
        ]);
    }

    if (
        $segments === ['respostas-quiz'] &&
        $method === 'POST'
    ) {
        $user = requireAuth();
        $respostas = $body['respostas'] ?? null;

        if (
            !is_array($respostas) ||
            count($respostas) === 0 ||
            count($respostas) > 100
        ) {
            respond(400, [
                'message' => 'Envie as respostas do quiz para salvar.'
            ]);
        }

        $db->begin_transaction();

        try {
            foreach ($respostas as $resposta) {
                $pergunta = trim(
                    (string) ($resposta['pergunta'] ?? '')
                );
                $alternativa = trim(
                    (string) ($resposta['alternativa'] ?? '')
                );
                $acertou = $resposta['acertou'] ?? null;

                if (
                    $pergunta === '' ||
                    strlen($pergunta) > 500 ||
                    $alternativa === '' ||
                    strlen($alternativa) > 255 ||
                    !in_array($acertou, [true, false, 0, 1], true)
                ) {
                    $db->rollback();

                    respond(400, [
                        'message' => 'Uma das respostas do quiz é inválida.'
                    ]);
                }

                executeQuery(
                    $db,
                    'INSERT INTO respostas_quiz
                     (usuario_id, pergunta, alternativa_escolhida, acertou)
                     VALUES (?, ?, ?, ?)',
                    'issi',
                    [
                        (int) $user['id'],
                        $pergunta,
                        $alternativa,
                        (int) $acertou
                    ]
                );
            }

            $db->commit();
        } catch (Throwable $error) {
            $db->rollback();
            throw $error;
        }

        respond(201, [
            'message' => 'Respostas do quiz salvas com sucesso.'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | RELATÓRIO DO PROFESSOR
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $segments === ['professores', 'relatorio']
    ) {
        requireProfessor();

        $alunos = fetchRows(executeQuery(
            $db,
            "SELECT u.id, u.nome, u.nome_usuario,
                    COUNT(r.id) AS respondidas,
                    COALESCE(SUM(r.acertou = 1), 0) AS acertos,
                    COALESCE(SUM(r.acertou = 0), 0) AS erros
             FROM usuarios u
             LEFT JOIN respostas_quiz r ON r.usuario_id = u.id
             WHERE u.perfil = 'aluno'
             GROUP BY u.id, u.nome, u.nome_usuario
             ORDER BY acertos DESC, erros ASC, u.nome ASC"
        ));

        $perguntas = fetchRows(executeQuery(
            $db,
            'SELECT pergunta,
                    COUNT(*) AS respondidas,
                    SUM(acertou = 1) AS acertos,
                    SUM(acertou = 0) AS erros
             FROM respostas_quiz
             GROUP BY pergunta
             ORDER BY acertos DESC, pergunta ASC'
        ));

        respond(200, [
            'alunos' => $alunos,
            'perguntas' => $perguntas
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | RANKING GERAL
    |--------------------------------------------------------------------------
    */

    if ($method === 'GET' && $segments === ['ranking']) {
        $rows = fetchRows(executeQuery(
            $db,
            'SELECT u.id, u.nome, u.avatar, u.nome_usuario,
                    COALESCE(SUM(p.pontuacao), 0) AS pontuacao_total
             FROM usuarios u
             LEFT JOIN pontuacoes p ON p.usuario_id = u.id
             GROUP BY u.id, u.nome, u.avatar, u.nome_usuario
             ORDER BY pontuacao_total DESC, u.nome ASC
             LIMIT 20'
        ));

        respond(200, ['ranking' => $rows]);
    }

    /*
    |--------------------------------------------------------------------------
    | RANKING POR JOGO
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        count($segments) === 3 &&
        $segments[0] === 'ranking' &&
        $segments[1] === 'jogo'
    ) {
        $jogoId = (int) $segments[2];

        $rows = fetchRows(executeQuery(
            $db,
            'SELECT u.id, u.nome, u.avatar, u.nome_usuario,
                    SUM(p.pontuacao) AS pontuacao_total
             FROM usuarios u
             INNER JOIN pontuacoes p ON p.usuario_id = u.id
             WHERE p.jogo_id = ?
             GROUP BY u.id, u.nome, u.avatar, u.nome_usuario
             ORDER BY pontuacao_total DESC, u.nome ASC',
            'i',
            [$jogoId]
        ));

        respond(200, ['ranking' => $rows]);
    }

    /*
    |--------------------------------------------------------------------------
    | ROUPINHAS DO USUÁRIO
    |--------------------------------------------------------------------------
    */

    if ($segments === ['roupinhas'] && $method === 'GET') {
        $user = requireAuth();

        $rows = fetchRows(executeQuery(
            $db,
            'SELECT id, emoji, nome, equipada, data_conquista
             FROM roupinhas_usuario
             WHERE usuario_id = ?
             ORDER BY data_conquista ASC',
            'i',
            [(int) $user['id']]
        ));

        respond(200, ['roupinhas' => $rows]);
    }

    /*
    |--------------------------------------------------------------------------
    | CONQUISTAR / SALVAR ROUPINHA
    |--------------------------------------------------------------------------
    */

    if ($segments === ['roupinhas'] && $method === 'POST') {
        $user = requireAuth();

        $emoji = trim((string) ($body['emoji'] ?? ''));
        $nome = trim((string) ($body['nome'] ?? ''));

        if ($emoji === '' || $nome === '') {
            respond(400, [
                'message' =>
                    'Emoji e nome da roupinha são obrigatórios.'
            ]);
        }

        executeQuery(
            $db,
            'INSERT INTO roupinhas_usuario
             (usuario_id, emoji, nome)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE nome = VALUES(nome)',
            'iss',
            [
                (int) $user['id'],
                $emoji,
                $nome
            ]
        );

        respond(201, [
            'message' => 'Roupinha guardada na sua coleção.'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | EQUIPAR ROUPINHA
    |--------------------------------------------------------------------------
    */

    if (
        $segments === ['roupinhas', 'equipada'] &&
        $method === 'PUT'
    ) {
        $user = requireAuth();
        $emoji = trim((string) ($body['emoji'] ?? ''));

        if ($emoji === '') {
            respond(400, [
                'message' => 'Selecione uma roupinha.'
            ]);
        }

        $db->begin_transaction();

        try {
            executeQuery(
                $db,
                'UPDATE roupinhas_usuario
                 SET equipada = 0
                 WHERE usuario_id = ?',
                'i',
                [(int) $user['id']]
            );

            $statement = executeQuery(
                $db,
                'UPDATE roupinhas_usuario
                 SET equipada = 1
                 WHERE usuario_id = ? AND emoji = ?',
                'is',
                [
                    (int) $user['id'],
                    $emoji
                ]
            );

            if ($statement->affected_rows === 0) {
                $db->rollback();

                respond(404, [
                    'message' =>
                        'Essa roupinha ainda não foi conquistada.'
                ]);
            }

            $db->commit();

            respond(200, [
                'message' => 'Roupinha equipada!'
            ]);
        } catch (Throwable $error) {
            $db->rollback();
            throw $error;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | ROTA NÃO ENCONTRADA
    |--------------------------------------------------------------------------
    */

    respond(404, [
        'message' => 'Rota não encontrada.'
    ]);

} catch (Throwable $error) {
    error_log($error->getMessage());

    respond(500, [
        'message' => 'Erro interno do servidor.'
    ]);
}
