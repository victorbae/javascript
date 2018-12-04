(function () {

	var listaTarefas = [];
	var listaCategorias = [];
	var isEditando = false;

	var nFinalizadas = 0;
	var nEmAndamento = 0;
	var nEmAnalise = 0;

	var pAlta = 0;
	var pMedia = 0;
	var pBaixa = 0;

	function salvarTarefas() {
		if (validaInputs()) {
			var tarefa = {};

			tarefa.titulo = $("#titulo-tarefa").val();
			tarefa.prioridade = $("#prioridade-tarefa").val();
			tarefa.situacao = $("#situacao-tarefa").val();
			tarefa.categoria = $("#categoria-tarefa").val();
			let idTarefa = $('#id-tarefa').val();

			/* Caso nao tenha o id criar novo*/
			if (idTarefa == undefined || idTarefa == '') {
				tarefa.id = new Date().getTime();
			} else { /* se tem esta editando*/
				tarefa.id = parseInt(idTarefa);
			}

			if (isEditando) {
				excluiTarefa(tarefa.id);
				listaTarefas.push(tarefa);
				isEditando = false;
			} else {
				listaTarefas.push(tarefa);
			}

			salvaTarefaNoLocalStorage();
			renderizaTarefas();
			$("#Modal-Tarefa").modal('hide');
			return false;
		}
	}

	function validaInputs() {
		if ($("#prioridade-tarefa").val() == "Escolha uma prioridade..." ||
			$("#situacao-tarefa").val() == "Escolha uma situação..." ||
			$("#categoria-tarefa").val() == "Escolha uma categoria...") {
			alert("Prioridade, Situação ou Categoria inválidas !!!");
			return false;
		}
		return true;
	}


	function renderizaTarefas() {
		/* Busca tabela com esse ID*/
		const tbody = $("#corpo-tabela-tarefas");

		/* Zera conteudo da tabela*/
		tbody.html = '';

		for (let i = 0; i < listaTarefas.length; i++) {
			const tarefa = listaTarefas[i];

			/* cria elemento do tipo tr - table row */
			let linha = $('<tr>');

			linha.attr("id", "linha-tarefas");

			linha.onclick = function () {
				$('#Modal-Tarefa').modal('show');
				isEditando = true;
				bloqueiaEdicaoTarefa();
				liberaExclusaoTarefa();
				editarTarefa(tarefa.id);
			};

			/* cria elemento td - table data */
			let tdTitulo = $('<td>');
			let tdPrioridade = $('<td>');
			let tdSituacao = $('<td>');
			let tdCategoria = $('<td>');

			/* seta os conteudo das td com o que tem qeu ficar ali dentro*/
			tdTitulo.html(tarefa.titulo);
			tdPrioridade.html(tarefa.prioridade);
			tdSituacao.html(tarefa.situacao);
			tdCategoria.html(tarefa.categoria);

			if (tarefa.titulo != null && tarefa.prioridade != null && tarefa.situacao && tarefa.categoria != null) {
				/* concatena os Td dentro do Tr*/
				linha.append(tdTitulo);
				linha.append(tdPrioridade);
				linha.append(tdSituacao);
				linha.append(tdCategoria);

				/* pega o tr e joga dentro do corpo da tabela*/
				tbody.append(linha);
			}

		}
		iniciaCampoComContadores()
	}
	function renderizaSelectCategorias() {
		listaCategorias = contCat.renCat;
		const corpoSelect = $("#categoria-tarefa");


		let firstLinha = $('<option>');
		firstLinha.html('Escolha uma categoria...');
		firstLinha.attr("selected", "selected");
		corpoSelect.html('');
		corpoSelect.append(firstLinha);


		for (let i = 0; i < listaCategorias.length; i++) {
			const categoria = listaCategorias[i];

			let linha = $('<option>');

			linha.html(categoria.nome);

			corpoSelect.append(linha);
		}
	}

	$('#Modal-Tarefa').on('show.bs.modal', function (event) {
		renderizaSelectCategorias()
	})

	function editarTarefa(id) {
		let tarefa = findTarefaById(id);

		if (tarefa) {
			$("#id-tarefa").val(tarefa.id);
			$("#titulo-tarefa").val(tarefa.titulo);
			$("#prioridade-tarefa").val(tarefa.prioridade);
			$("#situacao-tarefa").val(tarefa.situacao);
			$("#categoria-tarefa").val(tarefa.categoria);
		} else {
			alert("Nao foi possivel encontrar a tarefa");
		}
	}

	/* .filter vai filtrar o array e retornar true quando a condicao for verdadeira, entao ele adiciona na let pessoa*/
	function findTarefaById(id) {
		let tarefas = listaTarefas.filter(function (value) {
			return value.id == id;
		});

		if (tarefas.length == 0) {
			return undefined;
		} else {
			return tarefas[0];
		}

	}

	function liberaEdicaoTarefa() {
		$('#btn-limpar-tarefa').prop('disabled', false);
		$("#titulo-tarefa").prop('disabled', false);
		$("#prioridade-tarefa").prop('disabled', false);
		$("#situacao-tarefa").prop('disabled', false);
		$("#categoria-tarefa").prop('disabled', false);
	}

	function bloqueiaEdicaoTarefa() {
		$('#btn-limpar-tarefa').prop('disabled', true);
		$("#titulo-tarefa").prop('disabled', true);
		$("#prioridade-tarefa").prop('disabled', true);
		$("#situacao-tarefa").prop('disabled', true);
		$("#categoria-tarefa").prop('disabled', true);
	}

	function novoBloqueiaExclusaoTarefa() {
		zeraInputTarefa();
		liberaEdicaoTarefa();
		$('#btn-editar-tarefa').css("display", "none");
		$('#btn-excluir-tarefa').css("display", "none");
	}

	function liberaExclusaoTarefa() {
		$('#btn-editar-tarefa').css("display", "inline");
		$('#btn-excluir-tarefa').css("display", "inline");
	}

	function zeraInputTarefa() {
		$("#titulo-tarefa").val('');
		$("#prioridade-tarefa").val('Escolha uma prioridade...');
		$("#situacao-tarefa").val('Escolha uma situação...');
		$("#categoria-tarefa").val('Escolha uma categoria...');
		if (!isEditando) {
			$("#id-tarefa").val('');
		}
	}

	function excluiTarefa(id) {
		listaTarefas = listaTarefas.filter(function (value) {
			return value.id != id;
		});
	}

	function excluiTarefaByButton() {
		let id = $("#id-tarefa").val();
		excluiTarefa(id);
		salvaTarefaNoLocalStorage();
		renderizaTarefas();
		$('#Modal-Tarefa').modal('hide');
	}

	function salvaTarefaNoLocalStorage() {
		/* Convertendo Lista para JSON*/
		const listaJSON = JSON.stringify(listaTarefas);

		/* Coloca a lista no LocalStorage */
		localStorage.setItem("listaTarefas", listaJSON);
	}

	function pegaTarefaDoLocalStorage() {
		/* Busca no Local Storage pela key lista*/
		const listaStorage = localStorage.getItem("listaTarefas");
		/* converte para lista denovo*/
		listaTarefas = JSON.parse(listaStorage) || [];

	}


	function contadores() {
		$(listaTarefas).each(function () {
			if ($(this).situacao == "Finalizada") {
				nFinalizadas++;
			}
			if ($(this).situacao == "Em Andamento") {
				nEmAndamento++;
			}
			if ($(this).situacao == "Em Análise") {
				nEmAnalise++;
			}
			if ($(this).prioridade == "Alta") {
				pAlta++;
			}
			if ($(this).prioridade == "Média") {
				pMedia++;
			}
			if ($(this).prioridade == "Baixa") {
				pBaixa++;
			}
		});
	}

	function zeraContadores() {
		nFinalizadas = 0;
		nEmAndamento = 0;
		nEmAnalise = 0;
		pAlta = 0;
		pMedia = 0;
		pBaixa = 0;
	}

	function iniciaCampoComContadores() {
		zeraContadores();
		contadores();
		if (nFinalizadas) {
			$('#tarefas-finalizadas').html(nFinalizadas);
		} else {
			$('#tarefas-finalizadas').html('0');
		}
		if (nEmAndamento) {
			$('#tarefas-em-andamento').html(nEmAndamento);
		} else {
			$('#tarefas-em-andamento').html('0');
		}
		if (nEmAnalise) {
			$('#tarefas-em-analise').html(nEmAnalise);
		} else {
			$('#tarefas-em-analise').html('0');
		}
		if (pAlta) {
			$('#tarefas-alta').html(pAlta);
		} else {
			$('#tarefas-alta').html('0');
		}
		if (pMedia) {
			$('#tarefas-media').html(pMedia);
		} else {
			$('#tarefas-media').html('0');
		}
		if (pBaixa) {
			$('#tarefas-baixa').html(pBaixa);
		} else {
			$('#tarefas-baixa').html('0');
		}
	}

	/* Executa assim que termina de carregar a pagina*/

	pegaTarefaDoLocalStorage();
	renderizaTarefas();

	// pega acao do botao Nova Tarefa do Jumbotron
	$("#btn-nova-tarefa-home").on("click", function (evt) {
		novoBloqueiaExclusaoTarefa();
	});
	// pega acao do botao Nova Tarefa acima da tabela de tarefas
	$("#btn-nova-tarefa").on("click", function (evt) {
		novoBloqueiaExclusaoTarefa();
	});
	// pega acao do botao excluir tarefa dentro do modal de tarefa
	$("#btn-excluir-tarefa").on("click", function (evt) {
		excluiTarefaByButton();
	});
	// pega acao do botao limpar tarefa dentro do modal de tarefa
	$("#btn-limpar-tarefa").on("click", function (evt) {
		zeraInputTarefa();
	});
	// pega acao do botao editar tarefa dentro do modal de tarefa
	$("#btn-editar-tarefa").on("click", function (evt) {
		liberaEdicaoTarefa();
	});
	// pega acao do botao salvar tarefa dentro do modal de tarefa
	$("#form-tarefas").on("submit", function (evt) {
		salvarTarefas();
		// para stopeia a propagacao
		evt.stopPropagation();
		// previne a execucao padrao
		evt.preventDefault();
	});
})();

