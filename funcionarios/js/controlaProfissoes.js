var listaProfissoes = [];

(function () {

    var isEditando = false;

    function salvarProfissoes() {
        if (validaInputs()) {
            var profissao = {};

            profissao.nome = $('#nome-profissao').val();
            profissao.area = $('#area-profissao').val();
            let idProfissao = $('#id-profissao').val();

            /* Caso nao tenha o id criar novo*/
            if (idProfissao == undefined || idProfissao == '') {
                profissao.id = new Date().getTime();
            } else { /* se tem esta editando*/
                profissao.id = parseInt(idProfissao);
            }

            if (isEditando) {
                excluiProfissao(profissao.id);
                listaProfissoes.push(profissao);
                isEditando = false;
            } else {
                listaProfissoes.push(profissao);
            }

            salvaProfissaoNoLocalStorage();
            renderizaProfissoes();
            limpaTudo();
            $("#Modal-Profissao").modal('hide');

            return true;
        }
    }

    function validaInputs() {
        if ($("#nome-profissao").val() === "Nome" ||
            $("#area-profissao").val() === "Área") {
            alert("Nome ou Area inválidos !!!");
            return false;
        }
        return true;
    }


    function renderizaProfissoes() {
        /* Busca tabela com esse ID*/
        const tbody = $("#corpo-tabela-profissoes");

        /* Zera conteudo da tabela*/
        tbody.html('');

        for (let i = 0; i < listaProfissoes.length; i++) {
            const profissao = listaProfissoes[i];

            /* cria elemento do tipo tr - table row */
            let linha = $('<tr>');

            linha.attr("id", "linha-profissoes");

            linha.on('click', function () {
                isEditando = true;
                $('#Modal-Profissao').modal("show");
                controlaTolltips();
                bloqueiaEdicaoProfissao();
                liberaExclusaoProfissao();
                editarProfissao(profissao.id)
            });

            /* cria elemento td - table data */
            let tdNome = $('<td>');
            let tdArea = $('<td>');
            let tdQtd = $('<td>');
            /* seta os conteudo das td com o que tem qeu ficar ali dentro*/
            tdNome.html(profissao.nome);
            tdArea.html(profissao.area);
            tdQtd.html(0);
            if (profissao) {
                /* concatena os Td dentro do Tr*/
                linha.append(tdNome).append(tdArea).append(tdQtd);
                /* pega o tr e joga dentro do corpo da tabela*/
                tbody.append(linha);
            }
        }
    }

    $('#Modal-profissao').on('show.bs.modal', function (event) {
        if (!isEditando) {
            limpaTudo();
        }
    });
    

    function editarProfissao(id) {
        let profissao = findProfissaoById(id);

        if (profissao) {
            $('#id-profissao').val(profissao.id);
            $("#nome-profissao").val(profissao.nome);
            $("#area-profissao").val(profissao.area);
        } else {
            alert("Nao foi possivel encontrar a Profissao");
        }
    }

    /* .filter vai filtrar o array e retornar true quando a condicao for verdadeira, entao ele adiciona na let pessoa*/
    function findProfissaoById(id) {
        let Profissoes = listaProfissoes.filter(function (val) {
            return val.id == id;
        });

        if (Profissoes.length == 0) {
            return undefined;
        } else {
            return Profissoes[0];
        }
    }

    function controlaTolltips() {
        $("#nome-profissao").tooltip(3);
        $("#area-profissao").tooltip(3);
    }

    function limpaTudo() {
        $("#nome-profissao").val('');
        $("#area-profissao").val('');
    }
    function liberaEdicaoProfissao() {
        $("#btn-limpar-profissao").prop('disabled', false);
        $('#btn-editar-profissao').prop('disabled', true);

        $("#nome-profissao").prop('disabled', false);
        $("#area-profissao").prop('disabled', false);
    }

    function bloqueiaEdicaoProfissao() {
        $("#btn-limpar-profissao").prop('disabled', true);
        $('#btn-editar-profissao').prop('disabled', false);

        $("#nome-profissao").prop('disabled', true);
        $("#area-profissao").prop('disabled', true);
    }

    function novoBloqueiaExclusaoProfissao() {
        limpaTudo();
        liberaEdicaoProfissao();
        $('#btn-editar-profissao').css("display", "none");
        $('#btn-excluir-profissao').css("display", "none");
    }

    function liberaExclusaoProfissao() {
        $('#btn-editar-profissao').css("display", "inline");
        $('#btn-excluir-profissao').css("display", "inline");
    }

    function excluiProfissao(id) {
        listaProfissoes = listaProfissoes.filter(function (val) {
            return val.id != id;
        });
    }

    function excluiProfissaoByButton() {
        let id = $("#id-profissao").val();
        excluiProfissao(id);
        salvaProfissaoNoLocalStorage();
        renderizaProfissoes();
        $('#Modal-Profissao').modal('hide');
    }

    function salvaProfissaoNoLocalStorage() {
        /* Convertendo Lista para JSON*/
        const listaJSON = JSON.stringify(listaProfissoes);

        /* Coloca a lista no LocalStorage */
        localStorage.setItem("listaProfissoes", listaJSON);
    }

    function pegaProfissaoDoLocalStorage() {
        /* Busca no Local Storage pela key lista*/
        const listaStorage = localStorage.getItem("listaProfissoes");
        /* converte para lista denovo*/
        listaProfissoes = JSON.parse(listaStorage) || [];

    }

    /* Executa assim que termina de carregar a pagina*/

    pegaProfissaoDoLocalStorage();
    renderizaProfissoes();

    // pega acao do botao Nova Profissao do Jumbotron
    $("#btn-novo-profissao-home").on("click", function (evt) {
        novoBloqueiaExclusaoProfissao();
    });
    // pega acao do botao Nova Profissao acima da tabela de Profissoes
    $("#btn-novo-profissao").on("click", function (evt) {
        novoBloqueiaExclusaoProfissao();
    });
    // pega acao do botao excluir Profissao dentro do modal de Profissao
    $("#btn-excluir-profissao").on("click", function (evt) {
        excluiProfissaoByButton();
    });
    // pega acao do botao limpar Profissao dentro do modal de Profissao
    $("#btn-limpar-profissao").on("click", function (evt) {
        limpaTudo();
    });
    // pega acao do botao editar Profissao dentro do modal de Profissao
    $("#btn-editar-profissao").on("click", function (evt) {
        liberaEdicaoProfissao();
    });
    // pega acao do botao salvar Profissao dentro do modal de Profissao
    $("#form-profissoes").on("submit", function (evt) {
        salvarProfissoes();
        // para stopeia a propagacao
        evt.stopPropagation();
        // previne a execucao padrao
        evt.preventDefault();
    });

    return{
    	listaProfissoes:listaProfissoes
    }
})();

