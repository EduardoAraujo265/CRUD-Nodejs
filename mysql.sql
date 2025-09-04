 CREATE TABLE `usuarios` (
  `nome` varchar(500) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` char(12) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
);
