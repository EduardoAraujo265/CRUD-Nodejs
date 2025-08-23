 CREATE TABLE `usuarios` (
  `nome` varchar(500) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` char(12) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
);
CREATE TABLE public.usuarios (
    nome character varying(500),
    email character varying(255),
    telefone character(12),
    senha character varying(255),
    id SERIAL PRIMARY KEY
);
