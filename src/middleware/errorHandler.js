function notFound(req, res) {
  res.status(404).json({ message: 'Rota não encontrada' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message =
    status === 500 ? 'Erro interno do servidor' : err.message || 'Erro na requisição';

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
