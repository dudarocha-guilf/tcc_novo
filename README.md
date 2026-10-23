# Letrika

Projeto educacional em HTML, CSS, JavaScript, PHP, mysqli e MySQL.

## Estrutura do projeto

- `letrika/database/` - Scripts SQL e banco de dados
- `letrika/backend/api.php` - API REST em PHP
- `letrika/backend/config/database.php` - conexão simples com MySQL usando mysqli
- `letrika/frontend/` - Interface web em HTML, CSS e JavaScript

## Como executar

1. Inicie o Apache e o MySQL pelo Laragon.
2. Confirme as credenciais do banco em `letrika/backend/.env`.
3. Abra `letrika/frontend/index.html` pelo Apache/Laragon.

A API usa os mesmos endpoints `/api/...` através de `letrika/backend/api.php` e sessões PHP.

## Área do professor

Para atualizar um banco existente, execute uma vez o script `letrika/database/migracao-professores.sql` no banco `letrika_db`. Depois, marque como professor apenas as contas autorizadas:

```sql
UPDATE usuarios SET perfil = 'professor' WHERE email = 'professor@escola.com';
```

As demais contas são alunos por padrão. A tela `letrika/frontend/professores.html` mostra acertos e erros individuais e as perguntas mais acertadas e erradas do quiz.

No cadastro, a opção Professor exige um código de convite. Defina `CODIGO_PROFESSOR` no arquivo `letrika/backend/.env` usando o formato de `letrika/backend/.env.example` e compartilhe o código apenas com os professores autorizados. Estudantes não precisam de código.
