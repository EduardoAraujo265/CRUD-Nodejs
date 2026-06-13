

$(function () { 
  $('#entrar').click(function (){
    var email = $('#email').val();
    var senha = $('#password').val();
    if (!email || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const JSONformatted = JSON.stringify({ email, senha })
    console.log(JSONformatted)
     fetch('/auth', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSONformatted,
  })
  .then(response => response.json())
  .then(data => {
      if(data.message === 'Login ou senha incorretos') {
        alert('Login ou senha incorretos');
        return;
      }
      console.log('Login bem-sucedido:', data);
      window.location.href = '/head.html'; // Redireciona para a página principal após o login
  })
  .catch(error => console.error('Error during login:', error));

  })


    
    
})
