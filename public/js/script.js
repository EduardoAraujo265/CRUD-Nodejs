let editUserId = null;

function carregarUsuarios() {
  fetch('/usuarios')
    .then((response) => {
      if (response.status === 401) {
        window.location.href = '/';
        return [];
      }
      return response.json();
    })
    .then((usuarios) => {
      const tbody = document.getElementById('table-body');
      tbody.innerHTML = '';

      usuarios.forEach((usuario) => {
        const { id, nome, email, telefone } = usuario;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${nome}</td>
          <td>${email}</td>
          <td>${telefone}</td>
          <td class="acoes">
            <button class="deletar" data-id="${id}">X</button>
            <button class="atualizar" data-id="${id}">Atualizar</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      document.querySelectorAll('.deletar').forEach((botao) => {
        botao.addEventListener('click', () => {
          const idUsuario = botao.getAttribute('data-id');
          removerUsuario(idUsuario);
        });
      });

      document.querySelectorAll('.atualizar').forEach((botao) => {
        botao.addEventListener('click', () => {
          const idUsuario = parseInt(botao.getAttribute('data-id'), 10);
          const usuario = usuarios.find((u) => u.id === idUsuario);
          showEditModal(usuario);
        });
      });
    })
    .catch((error) => console.error('Erro ao carregar usuários:', error));
}

carregarUsuarios();

function removerUsuario(id) {
  fetch(`/usuarios/${id}`, { method: 'DELETE' })
    .then((response) => response.json())
    .then(() => carregarUsuarios())
    .catch((error) => console.error('Erro ao remover usuário:', error));
}

function adicionarUsuario(event) {
  event.preventDefault();

  const nome = document.getElementById('inputNome').value;
  const email = document.getElementById('inputEmail').value;
  const telefone = document.getElementById('inputTelefone').value;
  const senha = document.getElementById('inputSenha').value;

  if (!nome || !email || !senha || !telefone) {
    alert('Todos os campos precisam ser preenchidos!');
    return;
  }

  fetch('/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, telefone, senha }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors.map((e) => e.mensagem).join('\n'));
        return;
      }
      document.querySelector('form').reset();
      carregarUsuarios();
    })
    .catch((error) => console.error('Erro ao adicionar usuário:', error));
}

function showEditModal(usuario) {
  document.getElementById('editNome').value = usuario.nome;
  document.getElementById('editEmail').value = usuario.email;
  document.getElementById('editSenha').value = '';
  document.getElementById('editTelefone').value = usuario.telefone;
  editUserId = usuario.id;
  document.getElementById('editModal').style.display = 'block';
}

function atualizarUsuario(id) {
  const nome = document.getElementById('editNome').value;
  const email = document.getElementById('editEmail').value;
  const senha = document.getElementById('editSenha').value;
  const telefone = document.getElementById('editTelefone').value;

  if (!nome || !email || !senha || !telefone) {
    alert('Todos os campos precisam ser preenchidos!');
    return;
  }

  fetch(`/usuarios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha, telefone }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors.map((e) => e.mensagem).join('\n'));
        return;
      }
      document.getElementById('editModal').style.display = 'none';
      carregarUsuarios();
    })
    .catch((error) => console.error('Erro ao atualizar usuário:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  const myDiv = document.querySelector('#mydiv');
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Telefone</th>
        <th class="acoes">Ações</th>
      </tr>
    </thead>
    <tbody id="table-body"></tbody>
  `;
  myDiv.appendChild(table);

  document.querySelector('form').addEventListener('submit', adicionarUsuario);

  const modal = document.getElementById('editModal');
  document.getElementsByClassName('close')[0].onclick = () => {
    modal.style.display = 'none';
  };
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
  document.getElementById('editForm').addEventListener('submit', (event) => {
    event.preventDefault();
    atualizarUsuario(editUserId);
  });

  document.getElementById('sair').addEventListener('click', () => {
    fetch('/auth/logout', { method: 'POST' }).finally(() => {
      window.location.href = '/';
    });
  });
});
