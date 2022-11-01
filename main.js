const KEY_BD = '@usuario'

var listaRegistros = {
    ultimoGerado: 0,
    usuario: []
}

var FILTRO = ''

function gravarBD() {
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros))
}

function lerBD() {
    const data = localStorage.getItem(KEY_BD)
    if (data) {
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}

function pesquisar(value) {
    console.log('value :>> ', value);
    FILTRO = value;
    desenhar()
}

function desenhar() {

    const tbody = document.getElementById('listaRegistrosBody')
    if (tbody) {
        var data = listaRegistros.usuarios;
        if (FILTRO.trim()) {
            const expReg = eval('/${FILTRO.trim().replace(/[^\da-w]+/g, ".*")}/i')
            data = data.filter(usuario => {
                return expReg.test(usuario.nome) || expReg.test(usuario.senha)
            })
        }
        data = data
            .sort((a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map(usuario => {

                return `<tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.senha}</td>
                    <td>${usuario.valor}<td>
                    <td>${usuario.data}</td>
                    <td>
                        <button onclick = visualizar("cadastro", false,${usuario.nome})>Editar</button>
                        <button class ='vermelho' onclick = 'perguntarSeDelete(${usuario.id})'>Deletar</button>

                        </td>

                     </tr>`
            })

        tbody.innerHTML = data.join('')

    }
}

function insertUsuario(nome, usuario, senha, valor, data) {
    const id = listaRegistros.ultimoGerado + 1;
    listaRegistros.ultimoGerado = id;
    listaRegistros.usuario.push({
        nome,
        usuario,
        senha,
        valor,
        data
    })
    gravarBD()
    desenhar()
    visualizar('lista')
}

function editUsuario(nome, usuario, senha, valor, data) {
    var usuario = listaRegistros.usuarios.find(usuario => usuario.nome == nome)
    usuario.usuario = usuario;
    usuario.senha = senha;
    gravarBD()
    desenhar()
    visualizar('lista')

}

function deleteUsuario(nome) {
    listaRegistros.usuarios = listaRegistros.usuarios.filter(usuario => {
        return usuario.nome != nome
    })

    gravarBD()
    desenhar()
}

function limpaEdicao() {
    document.getElementById('nome').value = ''
    document.getElementById('fone').value = ''
}


function submeter(e) {
    e.preventDefault()
    const data = {
        nome: document.getElementById('nome').value || listaRegistros.ultimoGerado + 1,
        usuario: document.getElementById('usuario').value,
        senha: document.getElementById('senha').value,
        valor: document.getElementById('valor').value,
        data: document.getElementById('data').value,
    }

    if (data.id) {
        editUsuario(data.nome, data.usuario, data.senha, data.valor, data.dataDePagamento)
    } else {
        insertUsuario(data.nome, data.senha)
    }
}

function vizualizar(pagina, novo = false, id = null) {
    document.body.setAttribute('page', pagina)
    if (pagina === 'cadastro') {
        if (novo) limpaEdicao()
        if (nome) {
            const usuario = listaRegistros.usuarios.find(usuario => usuario.nome == nome)
            if (usuario) {
                document.getElementById('nome').value = usuario.nome
                document.getElementById('usuario').value = usuario.usuario
                document.getElementById('senha').value = usuario.senha
                document.getElementById('valor').value = usuario.valor
                document.getElementById('data de pagamento').value = usuario.dataDePagamento
            }
        }

        document.getElementById('nome').focus()
    }
}

window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submit)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })
})