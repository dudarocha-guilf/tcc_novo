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
