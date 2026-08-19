# CRUD em Node.js

Dashboard que realiza as quatro operações de um CRUD (usuários) usando **Node.js, Express, HTML, CSS e JavaScript**, com suporte a **MySQL** e **PostgreSQL**.

> Projeto originalmente feito para a disciplina *Construção de Aplicações Web* da FAETERJ-RIO, reestruturado para seguir boas práticas de organização, segurança e manutenção.

## Estrutura do projeto

```
crud-nodejs/
├── api/
│   └── index.js          # handler serverless (Vercel) — reaproveita src/app.js
├── database/
│   ├── mysql.sql          # schema MySQL
│   └── postgres.sql       # schema PostgreSQL
├── public/                 # tudo que é servido estaticamente
│   ├── css/
│   ├── js/
│   ├── login.html
│   └── dashboard.html
├── scripts/
│   ├── setup.js             # gera .env + cria banco/tabelas/admin (npm run setup)
│   └── hashPassword.js      # gera hash bcrypt para uma senha, isoladamente
├── src/
│   ├── config/             # variáveis de ambiente e conexão com o banco
│   ├── controllers/        # regras da aplicação (o que cada rota faz)
│   ├── middleware/         # autenticação, validação e tratamento de erros
│   ├── repositories/       # todas as queries SQL, isoladas por entidade
│   ├── routes/             # definição das rotas Express
│   ├── validators/         # regras de validação de entrada
│   ├── app.js               # monta o Express app (usado por src/server.js e api/index.js)
│   └── server.js            # sobe o servidor HTTP (uso local / fora de serverless)
├── .env.example
├── package.json
└── vercel.json
```

## Por que essa reestruturação?

O projeto original tinha toda a lógica solta na raiz do repositório (`create.js`, `read.js`, `update.js`, `delete.js`, `auth.js`, `index.js`), cada arquivo abrindo sua própria instância do Express e misturando SQL, regras de negócio e resposta HTTP no mesmo lugar. Isso trazia alguns problemas sérios, corrigidos nesta versão:

- **Senhas em texto puro.** Usuários e admins tinham a senha salva sem hash no banco, comparada com `===`. Agora todas as senhas passam por `bcrypt` antes de ir ao banco, e o login usa `bcrypt.compare`.
- **Credenciais de admin expostas no HTML.** O `login.html` antigo mostrava literalmente o e-mail e a senha do admin na tela. Isso foi removido.
- **Login que não protegia nada.** Após "logar", o front-end só redirecionava para `/head.html`, mas essa página (e toda a API) continuava acessível diretamente por qualquer pessoa, sem sessão. Agora o login gera um **JWT em cookie `httpOnly`**, e tanto `/dashboard` quanto todas as rotas `/usuarios/*` exigem esse token válido.
- **Painel expondo a senha de cada usuário.** A tabela do dashboard e a própria API devolviam a senha (ou hash) de cada usuário. A rota de listagem agora nunca retorna a coluna `senha`.
- **Bugs silenciosos.** `delete.js` nunca respondia ao cliente (a requisição ficava "pendurada" até dar timeout) e `update.js`/`create.js` engoliam erros em blocos `catch` vazios. Agora existe um middleware central de erro que sempre responde algo coerente e loga a exceção.
- **SQL Injection parcial.** A maior parte já usava queries parametrizadas, mas ficava espalhada e duplicada entre MySQL e Postgres em cada arquivo. Agora só existe um lugar (`src/repositories`) com as queries, sempre parametrizadas.
- **`vercel.json` inconsistente.** O `build` apontava para `index.js` mas o `rewrite` mandava tudo para `/api`, uma rota que não existia. Agora há um handler dedicado em `api/index.js`.
- **Falta de validação de entrada.** Não havia checagem de formato de e-mail, tamanho de senha etc. no back-end (só no HTML, que é trivialmente contornável). Agora isso é validado com `express-validator` antes de chegar ao controller.

## Configuração

### Opção rápida: script de setup

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Rode o setup interativo — ele pergunta os dados do banco, gera o `.env`
   (com um `JWT_SECRET` aleatório), cria o banco de dados e as tabelas, e
   pode cadastrar o primeiro admin já com a senha em hash:
   ```bash
   npm run setup
   ```
3. Suba o servidor:
   ```bash
   npm run dev   # com reload automático (nodemon)
   # ou
   npm start
   ```
4. Acesse `http://localhost:5000` (ou a porta que você definiu no setup).

> O script de setup exige que o servidor MySQL/PostgreSQL já esteja rodando
> e acessível com um usuário que tenha permissão de `CREATE DATABASE`.
> Se preferir, rode `npm run setup` de novo a qualquer momento — ele
> pergunta antes de sobrescrever um `.env` existente.

### Opção manual

1. Instale as dependências: `npm install`.
2. Copie `.env.example` para `.env` e preencha os valores (banco, `JWT_SECRET`, porta).
3. Crie o banco e as tabelas executando `database/mysql.sql` ou `database/postgres.sql`, conforme o banco escolhido em `DB_CLIENT`.
4. Gere o hash da senha do admin e insira manualmente na tabela `admins`:
   ```bash
   npm run hash-password "sua-senha-aqui"
   ```
5. Suba o servidor com `npm run dev` ou `npm start`.

## Rotas principais

| Método | Rota             | Descrição                              | Autenticado? |
|--------|-------------------|-----------------------------------------|--------------|
| POST   | `/auth/login`      | Autentica o admin e emite o cookie JWT  | Não          |
| POST   | `/auth/logout`     | Invalida a sessão local                 | Não          |
| GET    | `/usuarios`        | Lista usuários                          | Sim          |
| POST   | `/usuarios`        | Cria usuário                            | Sim          |
| PATCH  | `/usuarios/:id`    | Atualiza usuário                        | Sim          |
| DELETE | `/usuarios/:id`    | Remove usuário                          | Sim          |
| GET    | `/dashboard`       | Painel administrativo                   | Sim          |

## Possíveis próximos passos

- Adicionar testes automatizados (ex.: Jest + Supertest) para os controllers e repositórios.
- Trocar cookies por refresh tokens caso o app cresça para múltiplos serviços.
- Adicionar paginação e busca na listagem de usuários.
- Adicionar um linter/formatter (ESLint + Prettier) e um pipeline de CI simples.

## Screenshots

### Dashboard
![Dashboard](https://github.com/EduardoAraujo265/CRUD-Nodejs/blob/main/Images/Dashboard2.png)

### Modal para atualizar os usuários
![Dashboard Modal](https://github.com/EduardoAraujo265/CRUD-Nodejs/blob/main/Images/Dashboard2_Modal.png)
