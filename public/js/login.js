$(function () {
  $('#entrar').click(function () {
    const email = $('#email').val();
    const senha = $('#password').val();

    if (!email || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message !== 'Login bem-sucedido') {
          alert(data.message || 'Não foi possível entrar');
          return;
        }
        window.location.href = '/dashboard';
      })
      .catch((error) => console.error('Erro durante o login:', error));
  });
});
