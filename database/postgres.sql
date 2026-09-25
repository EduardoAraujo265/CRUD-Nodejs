CREATE TABLE public.usuarios (
    id SERIAL PRIMARY KEY,
    nome character varying(498),
    email character varying(253),
    telefone character(11),
    senha character varying(253)
);

CREATE TABLE public.admins (
    id SERIAL PRIMARY KEY,
    nome character varying(500),
    email character varying(253),
    -- Armazena o HASH bcrypt da senha, nunca a senha em texto puro.
    -- Gere o hash com: npm run hash-password "sua-senha"
    senha character varying(253)
);
