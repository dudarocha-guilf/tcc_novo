-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3308
-- Generation Time: Oct 23, 2026 at 02:36 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `letrika_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `jogos`
--

CREATE TABLE `jogos` (
  `id` int NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `tipo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ativo` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jogos`
--

INSERT INTO `jogos` (`id`, `nome`, `descricao`, `tipo`, `ativo`) VALUES
(1, 'Corrida de Acentos', 'Corrida de palavras com acentos e regras da l??ngua portuguesa.', 'corrida', 1),
(2, 'Quiz de Acentuação e Sílabas', 'Pratique acentuação, sílaba tônica, escrita correta e separação silábica.', 'quiz', 1);

-- --------------------------------------------------------

--
-- Table structure for table `palavras_corrida`
--

CREATE TABLE `palavras_corrida` (
  `id` int NOT NULL,
  `palavra_incorreta` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `palavra_correta` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alternativa_a` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alternativa_b` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resposta_correta` enum('A','B') COLLATE utf8mb4_unicode_ci NOT NULL,
  `acao` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dificuldade` enum('facil','medio','dificil') COLLATE utf8mb4_unicode_ci DEFAULT 'facil',
  `ativo` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `palavras_corrida`
--

INSERT INTO `palavras_corrida` (`id`, `palavra_incorreta`, `palavra_correta`, `alternativa_a`, `alternativa_b`, `resposta_correta`, `acao`, `dificuldade`, `ativo`) VALUES
(1, 'cafe', 'caf??', 'cafe', 'caf??', 'B', 'pular', 'facil', 1),
(2, 'voce', 'voc??', 'voc??', 'voce', 'A', 'agachar', 'facil', 1),
(3, 'arvore', '??rvore', '??rvore', 'arvore', 'A', 'desviar', 'medio', 1),
(4, 'lapis', 'l??pis', 'lapis', 'l??pis', 'B', 'continuar', 'medio', 1),
(5, 'portugues', 'portugu??s', 'portugu??s', 'portugues', 'A', 'avancar', 'dificil', 1),
(6, 'Pe', 'Pé', 'Pé', 'Pè', 'A', 'continuar', 'medio', 1);

-- --------------------------------------------------------

--
-- Table structure for table `perguntas`
--

CREATE TABLE `perguntas` (
  `id` int NOT NULL,
  `jogo_id` int NOT NULL,
  `palavra` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pergunta` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `alternativa_a` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alternativa_b` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alternativa_c` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resposta_correta` enum('A','B','C') COLLATE utf8mb4_unicode_ci NOT NULL,
  `explicacao` text COLLATE utf8mb4_unicode_ci,
  `dificuldade` enum('facil','medio','dificil') COLLATE utf8mb4_unicode_ci DEFAULT 'facil',
  `ativo` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `perguntas`
--

INSERT INTO `perguntas` (`id`, `jogo_id`, `palavra`, `pergunta`, `alternativa_a`, `alternativa_b`, `alternativa_c`, `resposta_correta`, `explicacao`, `dificuldade`, `ativo`) VALUES
(1, 2, 'caf??', 'Qual ?? a classifica????o da palavra ???caf??????', 'Ox??tona', 'Parox??tona', 'Proparox??tona', 'A', 'A palavra caf?? tem a s??laba t??nica na ??ltima s??laba: caf??.', 'facil', 1),
(2, 2, 'mesa', 'Qual ?? a classifica????o da palavra ???mesa????', 'Ox??tona', 'Parox??tona', 'Proparox??tona', 'B', 'A palavra mesa tem a s??laba t??nica na pen??ltima s??laba: me-sa.', 'facil', 1),
(3, 2, 'm??sica', 'Qual ?? a classifica????o da palavra ???m??sica????', 'Ox??tona', 'Parox??tona', 'Proparox??tona', 'C', 'A palavra m??sica tem a s??laba t??nica na antepen??ltima s??laba: m??-si-ca.', 'facil', 1);

-- --------------------------------------------------------

--
-- Table structure for table `pontuacoes`
--

CREATE TABLE `pontuacoes` (
  `id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `jogo_id` int NOT NULL,
  `pontuacao` int NOT NULL DEFAULT '0',
  `data_partida` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pontuacoes`
--

INSERT INTO `pontuacoes` (`id`, `usuario_id`, `jogo_id`, `pontuacao`, `data_partida`) VALUES
(73, 58, 2, 120, '2026-10-21 14:26:13'),
(74, 59, 1, 50, '2026-10-21 17:48:55'),
(75, 59, 2, 80, '2026-10-21 17:50:29'),
(76, 59, 2, 120, '2026-10-21 17:53:49'),
(77, 59, 1, 50, '2026-10-21 17:56:14'),
(78, 58, 1, 50, '2026-10-21 17:56:57');

-- --------------------------------------------------------

--
-- Table structure for table `respostas_quiz`
--

CREATE TABLE `respostas_quiz` (
  `id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `pergunta` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alternativa_escolhida` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `acertou` tinyint(1) NOT NULL,
  `data_resposta` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `respostas_quiz`
--

INSERT INTO `respostas_quiz` (`id`, `usuario_id`, `pergunta`, `alternativa_escolhida`, `acertou`, `data_resposta`) VALUES
(181, 58, 'Quantas sílabas tem a palavra “estrela”?', 'Três', 1, '2026-10-21 14:25:19'),
(182, 58, 'Em “abacaxi”, qual é a sílaba mais forte?', 'xi', 1, '2026-10-21 14:25:25'),
(183, 58, 'Como se separa a palavra “janela”?', 'ja-ne-la', 1, '2026-10-21 14:25:34'),
(184, 58, 'Qual é a classificação da palavra “janela”?', 'Paroxítona', 1, '2026-10-21 14:25:43'),
(185, 58, 'Em “café”, qual é a sílaba mais forte?', 'fé', 1, '2026-10-21 14:25:47'),
(186, 58, 'Qual palavra está escrita corretamente?', 'herói', 1, '2026-10-21 14:25:52'),
(187, 58, 'Qual é a classificação da palavra “música”?', 'Proparoxítona', 1, '2026-10-21 14:25:55'),
(188, 58, 'Em “pássaro”, qual é a sílaba mais forte?', 'pás', 1, '2026-10-21 14:25:58'),
(189, 58, 'Qual palavra está escrita corretamente?', 'pássaro', 1, '2026-10-21 14:26:01'),
(190, 58, 'Qual é a classificação da palavra “médico”?', 'Proparoxítona', 1, '2026-10-21 14:26:06'),
(191, 58, 'Em “banana”, qual é a sílaba mais forte?', 'na (do meio)', 1, '2026-10-21 14:26:09'),
(192, 58, 'Qual palavra está escrita corretamente?', 'você', 1, '2026-10-21 14:26:13'),
(193, 58, 'Qual é a classificação da palavra “café”?', 'Oxítona', 1, '2026-10-21 14:26:52'),
(194, 58, 'Em “banana”, qual é a sílaba mais forte?', 'na (do meio)', 1, '2026-10-21 14:26:54'),
(195, 58, 'Qual palavra está escrita corretamente?', 'lápis', 1, '2026-10-21 14:26:57'),
(196, 58, 'Qual é a classificação da palavra “açúcar”?', 'Oxítona', 0, '2026-10-21 14:27:06'),
(197, 58, 'Em “café”, qual é a sílaba mais forte?', 'fé', 1, '2026-10-21 14:27:17'),
(198, 58, 'Qual palavra está escrita corretamente?', 'você', 1, '2026-10-21 14:27:20'),
(199, 58, 'Qual é a classificação da palavra “janela”?', 'Paroxítona', 1, '2026-10-21 14:27:24'),
(200, 58, 'Em “abacaxi”, qual é a sílaba mais forte?', 'xi', 1, '2026-10-21 14:27:26'),
(201, 58, 'Qual palavra está escrita corretamente?', 'herói', 1, '2026-10-21 14:27:28'),
(202, 59, 'Qual é a classificação da palavra “mesa”?', 'Paroxítona', 1, '2026-10-21 17:49:52'),
(203, 59, 'Em “banana”, qual é a sílaba mais forte?', 'na (do meio)', 1, '2026-10-21 17:49:54'),
(204, 59, 'Como se separa a palavra “borboleta”?', 'bor-bo-le-ta', 1, '2026-10-21 17:49:58'),
(205, 59, 'Qual é a classificação da palavra “lâmpada”?', 'Paroxítona', 0, '2026-10-21 17:50:02'),
(206, 59, 'Em “abacaxi”, qual é a sílaba mais forte?', 'xi', 1, '2026-10-21 17:50:07'),
(207, 59, 'Qual palavra está escrita corretamente?', 'bau', 0, '2026-10-21 17:50:10'),
(208, 59, 'Qual é a classificação da palavra “jacaré”?', 'Oxítona', 1, '2026-10-21 17:50:13'),
(209, 59, 'Em “pássaro”, qual é a sílaba mais forte?', 'pás', 1, '2026-10-21 17:50:16'),
(210, 59, 'Qual palavra está escrita corretamente?', 'passáro', 0, '2026-10-21 17:50:20'),
(211, 59, 'Qual é a classificação da palavra “abacaxi”?', 'Paroxítona', 0, '2026-10-21 17:50:23'),
(212, 59, 'Em “café”, qual é a sílaba mais forte?', 'fé', 1, '2026-10-21 17:50:26'),
(213, 59, 'Como se separa a palavra “janela”?', 'ja-ne-la', 1, '2026-10-21 17:50:28'),
(214, 59, 'Qual é a classificação da palavra “animal”?', 'Oxítona', 1, '2026-10-21 17:52:25'),
(215, 59, 'Em “pássaro”, qual é a sílaba mais forte?', 'pás', 1, '2026-10-21 17:52:27'),
(216, 59, 'Qual palavra está escrita corretamente?', 'você', 1, '2026-10-21 17:52:30'),
(217, 59, 'Qual é a classificação da palavra “açúcar”?', 'Paroxítona', 1, '2026-10-21 17:52:37'),
(218, 59, 'Em “banana”, qual é a sílaba mais forte?', 'na (do meio)', 1, '2026-10-21 17:52:40'),
(219, 59, 'Qual palavra está escrita corretamente?', 'pássaro', 1, '2026-10-21 17:52:43'),
(220, 59, 'Qual é a classificação da palavra “tênis”?', 'Paroxítona', 1, '2026-10-21 17:52:46'),
(221, 59, 'Em “café”, qual é a sílaba mais forte?', 'fé', 1, '2026-10-21 17:52:59'),
(222, 59, 'Como se separa a palavra “abacaxi”?', 'a-ba-ca-xi', 1, '2026-10-21 17:53:02'),
(223, 59, 'Quantas sílabas tem a palavra “banana”?', 'Três', 1, '2026-10-21 17:53:08'),
(224, 59, 'Em “abacaxi”, qual é a sílaba mais forte?', 'xi', 1, '2026-10-21 17:53:42'),
(225, 59, 'Qual palavra está escrita corretamente?', 'lápis', 1, '2026-10-21 17:53:45');

-- --------------------------------------------------------

--
-- Table structure for table `roupinhas_usuario`
--

CREATE TABLE `roupinhas_usuario` (
  `id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `emoji` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipada` tinyint(1) DEFAULT '0',
  `data_conquista` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roupinhas_usuario`
--

INSERT INTO `roupinhas_usuario` (`id`, `usuario_id`, `emoji`, `nome`, `equipada`, `data_conquista`) VALUES
(92, 58, '🧢', 'Boné da concentração', 1, '2026-10-21 14:27:28'),
(93, 59, '🧢', 'Boné da concentração', 1, '2026-10-21 17:53:46');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome_usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `perfil` enum('aluno','professor') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'aluno',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'default-avatar.png',
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `nome_usuario`, `email`, `senha`, `perfil`, `avatar`, `data_cadastro`) VALUES
(26, 'Renan Junior', 'renan1_junior', 'renan1@gmail.com', '$2y$10$aiuPKzB/zve7XtDcRWCzGe0ziuXpNINYusTb1bvqHG5gOiP0q0P3S', 'professor', 'default-avatar.png', '2026-10-09 11:22:14'),
(58, 'Melissa', 'mel_issa', 'mel@gmail.com', '$2y$10$9zpN1BZa3IjrTPp78crMs.u.FugnEwG0YrNcQaxb3jxbuZyIOw6HO', 'aluno', 'default-avatar.png', '2026-10-21 14:03:11'),
(59, 'Miguel', 'miguel_', 'miguel@gmail.com', '$2y$10$4k1QjydQuGwwPxwYy79pWOuGuedZ9fa6bKsOwTZ8eZPnRd9Ail2Oe', 'aluno', '🐸', '2026-10-21 17:45:39'),
(60, 'Roberto', 'roberto_', 'roberto@gmail.com', '$2y$10$Q4rUVOpuDzbVt510WS5zneHAF/01vFh4U2qyi5LXHDawPznSzANxa', 'professor', 'default-avatar.png', '2026-10-23 14:23:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jogos`
--
ALTER TABLE `jogos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `palavras_corrida`
--
ALTER TABLE `palavras_corrida`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_palavra_corrida` (`palavra_incorreta`,`palavra_correta`);

--
-- Indexes for table `perguntas`
--
ALTER TABLE `perguntas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_perguntas_jogo` (`jogo_id`);

--
-- Indexes for table `pontuacoes`
--
ALTER TABLE `pontuacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_usuario_id` (`usuario_id`),
  ADD KEY `idx_jogo_id` (`jogo_id`);

--
-- Indexes for table `respostas_quiz`
--
ALTER TABLE `respostas_quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_respostas_quiz_usuario` (`usuario_id`),
  ADD KEY `idx_respostas_quiz_acertou` (`acertou`);

--
-- Indexes for table `roupinhas_usuario`
--
ALTER TABLE `roupinhas_usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_roupinha_usuario` (`usuario_id`,`emoji`),
  ADD KEY `idx_roupinhas_usuario` (`usuario_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome_usuario` (`nome_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jogos`
--
ALTER TABLE `jogos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `palavras_corrida`
--
ALTER TABLE `palavras_corrida`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `perguntas`
--
ALTER TABLE `perguntas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pontuacoes`
--
ALTER TABLE `pontuacoes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `respostas_quiz`
--
ALTER TABLE `respostas_quiz`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=226;

--
-- AUTO_INCREMENT for table `roupinhas_usuario`
--
ALTER TABLE `roupinhas_usuario`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `perguntas`
--
ALTER TABLE `perguntas`
  ADD CONSTRAINT `fk_perguntas_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pontuacoes`
--
ALTER TABLE `pontuacoes`
  ADD CONSTRAINT `fk_pontuacoes_jogo` FOREIGN KEY (`jogo_id`) REFERENCES `jogos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pontuacoes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `respostas_quiz`
--
ALTER TABLE `respostas_quiz`
  ADD CONSTRAINT `fk_respostas_quiz_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `roupinhas_usuario`
--
ALTER TABLE `roupinhas_usuario`
  ADD CONSTRAINT `fk_roupinhas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
