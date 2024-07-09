let editUserId = null;

function carregarUsuarios() {
  fetch('/usuarios')
    .then(response => response.json())      
    .then(json => {
      const todos = Object.values(json)
      const tbody = document.getElementById('table-body');
      tbody.innerHTML = '';

      todos.forEach(usuario => {
       
          const { id, nome, email, senha, telefone } = usuario; 
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${nome}</td>
            <td>${email}</td>
            <td>${senha}</td>
            <td>${telefone}</td>

            <button class="deletar" data-id="${id}">X</button>
            <button class="atualizar" data-id="${id}">Atualizar</button>
          `;
          tbody.appendChild(row);
        });
      const botoesRemover = document.querySelectorAll('.deletar');
      botoesRemover.forEach(botao => {
        botao.addEventListener('click', () => {
          const idUsuario = botao.getAttribute('data-id');
          removerUsuario(idUsuario);
          carregarUsuarios()
          console.log("usuario deletado")
        });
      });
      const botoesAtualizar = document.querySelectorAll('.atualizar');
  botoesAtualizar.forEach(botao => {
    botao.addEventListener('click', () => {
      const idUsuario = parseInt(botao.getAttribute('data-id'), 10); // Converter para número
      const usuario = todos.find(u => u.id === idUsuario);
      showEditModal(usuario);
    });
  });
      
    })
} 
carregarUsuarios()

function removerUsuario(id) {
  fetch(`/usuarios/${id}`, {
    method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
    console.log('User Deleted:', data);
    carregarUsuarios(); // Atualiza a tabela após remover o usuário
  })
  .catch(error => console.error('Error deleting usuario:', error));
}

  function adicionarUsuario(event) {
    event.preventDefault()
     
    let nome = document.getElementById('inputNome').value;
    let email = document.getElementById('inputEmail').value;
    let telefone = document.getElementById('inputTelefone').value;
    let senha = document.getElementById('inputSenha').value;

    if (!nome || !email || !senha || !telefone) {
      alert("Todos os campos precisam ser preenchidos!");
    return;
}

    const JSONformatted = JSON.stringify({ nome, email, telefone, senha })
    console.log(JSONformatted)
     fetch('/usuarios', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSONformatted,
  })
  .then(response => response.json())
  .then(data => {
      console.log('User Created:', data);
      carregarUsuarios(); // Atualiza a tabela após adicionar o usuário
  })
  .catch(error => console.error('Error adding usuario:', error));
}

function showEditModal(usuario) {
document.getElementById('editNome').value = usuario.nome;
document.getElementById('editEmail').value = usuario.email;
document.getElementById('editSenha').value = usuario.senha;
document.getElementById('editTelefone').value = usuario.telefone;
editUserId = usuario.id;
console.log(editUserId)
document.getElementById('editModal').style.display = 'block';
}

function atualizarUsuario(id) {
const nome = document.getElementById('editNome').value;
const email = document.getElementById('editEmail').value;
const senha = document.getElementById('editSenha').value;
const telefone = document.getElementById('editTelefone').value;

if (!nome || !email || !senha || !telefone) {
alert("Todos os campos precisam ser preenchidos!");
return;
}

const JSONformatted = JSON.stringify({ nome, email, senha, telefone, id });

fetch(`/usuarios/${id}`, {
method: 'PATCH',
headers: {
  'Content-Type': 'application/json'
},
body: JSONformatted
})
.then(response => response.json())
.then(data => {
console.log('User Updated:', data);
document.getElementById('editModal').style.display = 'none';
carregarUsuarios();
})
.catch(error => console.error('Error updating usuario:', error));
}

const meuform = document.querySelector('form');
console.log(meuform)
meuform.addEventListener('submit', adicionarUsuario);


document.addEventListener('DOMContentLoaded', () =>{
const myDiv = document.querySelector('#mydiv');
const table = document.createElement('table');
table.innerHTML = `
  <thead>
      <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Senha</th>
          <th>Telefone</th>
      </tr>
  </thead>
  <tbody id="table-body">
  </tbody>
`;
myDiv.appendChild(table);
})

document.addEventListener('DOMContentLoaded', () => {
const modal = document.getElementById('editModal');
const span = document.getElementsByClassName('close')[0];

span.onclick = function() {
modal.style.display = 'none';
}

window.onclick = function(event) {
if (event.target == modal) {
  modal.style.display = 'none';
}
}

const editForm = document.getElementById('editForm');
editForm.addEventListener('submit', (event) => {
event.preventDefault();
atualizarUsuario(editUserId);
});
});