
var listaProfissoes = PROFISSAO.listaProfissoes;

FUNCIONARIOS = (function () {
    var listaFuncionarios = [];
    var isEditando = false;
    var listaEstados = [];
    var listaCidades = [];

    function salvarfuncionarios() {
        if (validaInputs()) {
            var funcionario = {};

            funcionario.nome = $("#nome-funcionario").val();
            funcionario.sexo = $("#sexo-funcionario").val();
            funcionario.cpf = $("#cpf-funcionario").val();
            funcionario.telefone = $("#telefone-funcionario").val();
            funcionario.estado = $("#estado-funcionario option:selected").text();
            funcionario.codEstado = $("#estado-funcionario").val();
            funcionario.cidade = $("#cidade-funcionario").val();
            funcionario.profissao = $("#profissao-funcionario").val();
            funcionario.salario = $("#salario-funcionario").val();
            let idfuncionario = $('#id-funcionario').val();

            /* Caso nao tenha o id criar novo*/
            if (idfuncionario == undefined || idfuncionario == '') {
                funcionario.id = new Date().getTime();
            } else { /* se tem esta editando*/
                funcionario.id = parseInt(idfuncionario);
            }

            if (isEditando) {
                excluifuncionario(funcionario.id);
                listaFuncionarios.push(funcionario);
                isEditando = false;
            } else {
                listaFuncionarios.push(funcionario);
            }

            salvafuncionarioNoLocalStorage();
            renderizafuncionarios();
            limpaTudo();
            $("#Modal-Funcionario").modal('hide');
            return false;
        }
    }

    function validaInputs() {
        if ($("#sexo-funcionario").val() === "Sexo" ||
            $("#estado-funcionario").val() === "Escolha um estado..." ||
            $("#cidade-funcionario").val() === "Escolha uma cidade..." ||
            $("#profissao-funcionario").val() === "Profissão...") {
            alert("Sexo, Estado, Cidade ou Profissão inválidos !!!");
            return false;
        }
        return true;
    }


    function renderizafuncionarios() {
        /* Busca tabela com esse ID*/
        const tbody = $("#corpo-tabela-funcionarios");

        /* Zera conteudo da tabela*/
        tbody.html('');

        for (let i = 0; i < listaFuncionarios.length; i++) {
            const funcionario = listaFuncionarios[i];

            /* cria elemento do tipo tr - table row */
            let linha = $('<tr>');

            linha.attr("id", "linha-funcionarios");

            linha.on('click', function () {
                isEditando = true;
                $('#Modal-Funcionario').modal("show");
                controlaTolltips();
                bloqueiaEdicaoFuncionario();
                liberaExclusaoFuncionario();
                carregaCidadesEditar(funcionario.codEstado);
                editarFuncionario(funcionario.id);
            });


            linha.hover(function () {
                renderizaSelectEstados();
                carregaCidadesEditar(funcionario.codEstado);
            })

            /* cria elemento td - table data */
            let tdNome = $('<td>');
            let tdSexo = $('<td>');
            let tdCPF = $('<td>');
            let tdTelefone = $('<td>');
            let tdCidade = $('<td>');
            let tdProfissão = $('<td>');
            let tdSalario = $('<td>');

            /* seta os conteudo das td com o que tem qeu ficar ali dentro*/
            tdNome.html(funcionario.nome);
            tdSexo.html(funcionario.sexo);
            tdCPF.html(funcionario.cpf);
            tdTelefone.html(funcionario.telefone);
            tdCidade.html(funcionario.cidade + ' - ' + funcionario.estado);
            tdProfissão.html(funcionario.profissao);
            tdSalario.html(funcionario.salario);

            if (funcionario) {
                /* concatena os Td dentro do Tr*/
                linha.append(tdNome).append(tdSexo)
                    .append(tdCPF).append(tdTelefone)
                    .append(tdCidade).append(tdProfissão).append(tdSalario);
                /* pega o tr e joga dentro do corpo da tabela*/
                tbody.append(linha);
            }
        }
    }

    $('#Modal-Funcionario').on('show.bs.modal', function (event) {
        limpaTudo();
        iniciaSelects();
        $("#cidade-funcionario").prop('disabled', true);
        renderizaSelectEstados();
        renderizaSelectProfissoes();
    });


    function renderizaSelectEstados() {
        const corpoSelect = $("#estado-funcionario");
        $.ajax({
            'type': "GET",
            'url': "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
            'success': function (retorno) {
                listaEstados = retorno;

                for (let i = 0; i < listaEstados.length; i++) {
                    const estado = listaEstados[i];
                    let linha = $('<option>');
                    linha.val(estado.id);
                    linha.text(estado.nome);

                    corpoSelect.append(linha);
                }
            }
        });
    }
    var codEstado = 0;
    $("#estado-funcionario").on('change', function () {
        codEstado = 0;
        if ($("#estado-funcionario").val() != 'Escolha um estado...') {
            $("#cidade-funcionario").html('Escolha uma cidade...');
            listaCidades = [];
            codEstado = $("#estado-funcionario").val();
            $("#cidade-funcionario").prop('disabled', false);
            renderizaSelectCidades();
        }
    });


    function iniciaSelects() {
        if (!isEditando) {
            const corpoSelectCity = $("#cidade-funcionario");
            let firstLinhaCity = $('<option>');
            firstLinhaCity.html('Escolha uma cidade...');
            corpoSelectCity.html('');
            corpoSelectCity.append(firstLinhaCity);

            const corpoSelectEst = $("#estado-funcionario");
            let firstLinhaEst = $('<option>');
            firstLinhaEst.html('Escolha um estado...');
            corpoSelectEst.html('');
            corpoSelectEst.append(firstLinhaEst);
        }
    }

    function renderizaSelectCidades() {
        const corpoSelect = $("#cidade-funcionario");
        $.ajax({
            'type': "GET",
            'url': "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + codEstado + "/municipios",
            'success': function (retorno) {
                listaCidades = retorno;

                for (let i = 0; i < listaCidades.length; i++) {
                    const city = listaCidades[i];

                    let linha = $('<option>');

                    linha.html(city.nome);

                    corpoSelect.append(linha);
                }
            }
        });
    }

    function carregaCidadesEditar(codEst) {
        listaCidades = [];
        codEstado = codEst;
        renderizaSelectCidades();
    }

    function renderizaSelectProfissoes() {
        const corpoSelect = $("#profissao-funcionario");
        corpoSelect.html('');

        for (let i = 0; i < listaProfissoes.length; i++) {
            const profissao = listaProfissoes[i];

            let linha = $('<option>');
            linha.html(profissao.nome);
            corpoSelect.append(linha);

            if (!isEditando && i < 1) {
                linha.html('Profissão...');
                corpoSelect.append(linha);
            }
        }
    }

    function editarFuncionario(id) {
        let funcionario = findFuncionarioById(id);

        if (funcionario) {

            $('#id-funcionario').val(funcionario.id);
            $("#nome-funcionario").val(funcionario.nome);
            $("#sexo-funcionario").val(funcionario.sexo);
            $("#cpf-funcionario").val(funcionario.cpf);
            $("#telefone-funcionario").val(funcionario.telefone);
            $("#estado-funcionario").val(funcionario.codEstado);
            $("#cidade-funcionario").val(funcionario.cidade);
            $("#profissao-funcionario").val(funcionario.profissao);
            $("#salario-funcionario").val(funcionario.salario);

        } else {
            alert("Nao foi possivel encontrar o funcionario");
        }
    }

    /* .filter vai filtrar o array e retornar true quando a condicao for verdadeira, entao ele adiciona na let pessoa*/
    function findFuncionarioById(id) {
        let funcionarios = listaFuncionarios.filter(function (val) {
            return val.id == id;
        });

        if (funcionarios.length == 0) {
            return undefined;
        } else {
            return funcionarios[0];
        }
    }

    function controlaTolltips() {
        $("#nome-funcionario").tooltip(3);
        $("#sexo-funcionario").tooltip(3);
        $("#cpf-funcionario").tooltip(3);
        $("#telefone-funcionario").tooltip(3);
        $("#estado-funcionario").tooltip(3);
        $("#cidade-funcionario").tooltip(3);
        $("#profissao-funcionario").tooltip(3);
        $("#salario-funcionario").tooltip(3);
        $('#id-funcionario').tooltip(3);
    }

    function limpaTudo() {
        $("#nome-funcionario").val('');
        $("#sexo-funcionario").val('');
        $("#cpf-funcionario").val('');
        $("#telefone-funcionario").val('');
        $("#estado-funcionario").val('');
        $("#cidade-funcionario").val('');
        $("#profissao-funcionario").val('');
        $("#salario-funcionario").val('');
        $('#id-funcionario').val('');
    }
    function liberaEdicaoFuncionario() {
        $("#btn-limpar-funcionario").prop('disabled', false);
        $('#btn-editar-funcionario').prop('disabled', true);

        $("#nome-funcionario").prop('disabled', false);
        $("#sexo-funcionario").prop('disabled', false);
        $("#cpf-funcionario").prop('disabled', false);
        $("#telefone-funcionario").prop('disabled', false);
        $("#estado-funcionario").prop('disabled', false);
        $("#cidade-funcionario").prop('disabled', false);
        $("#profissao-funcionario").prop('disabled', false);
        $("#salario-funcionario").prop('disabled', false);

    }

    function bloqueiaEdicaoFuncionario() {
        $("#btn-limpar-funcionario").prop('disabled', true);
        $('#btn-editar-funcionario').prop('disabled', false);

        $("#nome-funcionario").prop('disabled', true);
        $("#sexo-funcionario").prop('disabled', true);
        $("#cpf-funcionario").prop('disabled', true);
        $("#telefone-funcionario").prop('disabled', true);
        $("#estado-funcionario").prop('disabled', true);
        $("#cidade-funcionario").prop('disabled', true);
        $("#profissao-funcionario").prop('disabled', true);
        $("#salario-funcionario").prop('disabled', true);
    }

    function novoBloqueiaExclusaoFuncionario() {
        limpaTudo();
        liberaEdicaoFuncionario();
        $('#btn-editar-funcionario').css("display", "none");
        $('#btn-excluir-funcionario').css("display", "none");
    }

    function liberaExclusaoFuncionario() {
        $('#btn-editar-funcionario').css("display", "inline");
        $('#btn-excluir-funcionario').css("display", "inline");
    }

    function excluifuncionario(id) {
        listaFuncionarios = listaFuncionarios.filter(function (val) {
            return val.id != id;
        });
    }

    function excluifuncionarioByButton() {
        let id = $("#id-funcionario").val();
        excluifuncionario(id);
        salvafuncionarioNoLocalStorage();
        renderizafuncionarios();
        $('#Modal-Funcionario').modal('hide');
    }

    function salvafuncionarioNoLocalStorage() {
        /* Convertendo Lista para JSON*/
        const listaJSON = JSON.stringify(listaFuncionarios);

        /* Coloca a lista no LocalStorage */
        localStorage.setItem("listaFuncionarios", listaJSON);
    }

    function pegafuncionarioDoLocalStorage() {
        /* Busca no Local Storage pela key lista*/
        const listaStorage = localStorage.getItem("listaFuncionarios");
        /* converte para lista denovo*/
        listaFuncionarios = JSON.parse(listaStorage) || [];
    }

    /* Executa assim que termina de carregar a pagina*/

    pegafuncionarioDoLocalStorage();
    renderizafuncionarios();

    // pega acao do botao Nova funcionario do Jumbotron
    $("#btn-novo-funcionario-home").on("click", function (evt) {
        novoBloqueiaExclusaoFuncionario();
    });
    // pega acao do botao Nova funcionario acima da tabela de funcionarios
    $("#btn-novo-funcionario").on("click", function (evt) {
        novoBloqueiaExclusaoFuncionario();
    });
    // pega acao do botao excluir funcionario dentro do modal de funcionario
    $("#btn-excluir-funcionario").on("click", function (evt) {
        excluifuncionarioByButton();
    });
    // pega acao do botao limpar funcionario dentro do modal de funcionario
    $("#btn-limpar-funcionario").on("click", function (evt) {
        limpaTudo();
    });
    // pega acao do botao editar funcionario dentro do modal de funcionario
    $("#btn-editar-funcionario").on("click", function (evt) {
        liberaEdicaoFuncionario();
    });
    // pega acao do botao salvar funcionario dentro do modal de funcionario
    $("#form-funcionarios").on("submit", function (evt) {
        salvarfuncionarios();
        // para stopeia a propagacao
        evt.stopPropagation();
        // previne a execucao padrao
        evt.preventDefault();
    });
})();

