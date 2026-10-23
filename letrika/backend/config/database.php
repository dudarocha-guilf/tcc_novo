<?php

declare(strict_types=1);

$host = '127.0.0.1';
$port = 3308;
$database = 'letrika_db';
$user = 'root';
$password = '';

mysqli_report(MYSQLI_REPORT_OFF);
$db = new mysqli($host, $user, $password, $database, $port);

if ($db->connect_errno) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    exit(json_encode(['message' => 'Falha na conexão com o banco de dados.'], JSON_UNESCAPED_UNICODE));
}

if (!$db->set_charset('utf8mb4')) {
    throw new RuntimeException('Falha ao configurar o charset do banco de dados: ' . $db->error);
}
