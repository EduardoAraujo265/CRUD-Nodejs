CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(498) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` char(11) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(500) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  -- Armazena o HASH bcrypt da senha, nunca a senha em texto puro.
  -- Gere o hash com: npm run hash-password "sua-senha"
  `senha` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
