var contCat = (function () {
	var listaCategorias = [];
	var isEditando = false;

	function salvarCategorias() {
		var categoria = {};
		categoria.nome = $("#nome-categoria").val();
		let idCategoria = $('#id-categoria').val();

		/* Caso nao tenha o id criar novo*/
		if (idCategoria == undefined || idCategoria == '') {
			categoria.id = new Date().getTime();
		} else { /* se tem esta editando*/
			categoria.id = parseInt(idCategoria);
		}

		if (isEditando) {
			excluiCategoria(categoria.id);
			listaCategorias.push(categoria);
			isEditando = false;
		} else {
			listaCategorias.push(categoria);
		}

		salvaCategoriaNoLocalStorage();
		renderizaCategorias();
		$("#Modal-Categoria").modal('hide');
		return false;
	}

	function renderizaCategorias() {
		/* Busca tabela com esse ID*/
		const tbody = $("#corpo-tabela-categorias");
		/* Zera conteudo da tabela*/
		tbody.html('');

		for (let i = 0; i < listaCategorias.length; i++) {
			const categoria = listaCategorias[i];

			/* cria elemento do tipo tr - table row */
			let linha = $('<tr>');

			linha.attr("id", "linha-categorias");

			linha.on('click', function () {
				$('#Modal-Categoria').modal('show');
				isEditando = true;
				bloqueiaEdicaoCategoria();
				liberaExclusaoCategoria();
				editarCategoria(categoria.id);
			});

			/* cria elemento td - table data */
			let tdNome = $('<td>');

			/* seta os conteudo das td com o que tem qeu ficar ali dentro*/
			tdNome.text(categoria.nome);

			if (categoria.nome != null) {
				/* concatena os Td dentro do Tr*/
				linha.append(tdNome);

				/* pega o tr e joga dentro do corpo da tabela*/
				tbody.append(linha);
			}
		}
	}

	function editarCategoria(id) {
		let categoria = findCategoriaById(id);
		if (categoria) {
			$("#nome-categoria").val(categoria.nome);
			$("#id-categoria").val(categoria.id);
		} else {
			alert("Nao foi possivel encontrar a categoria");
		}
	}

	/* .filter vai filtrar o array e retornar true quando a condicao for verdadeira, entao ele adiciona na let pessoa*/
	function findCategoriaById(id) {
		let categorias = listaCategorias.filter(function (value) {
			return value.id == id;
		});

		if (categorias.length == 0) {
			return undefined;
		} else {
			return categorias[0];
		}
	}

	function liberaEdicaoCategoria() {
		$('#btn-limpar-categoria').prop('disabled', false);
		$('#nome-categoria').prop('disabled', false);
	}

	function bloqueiaEdicaoCategoria() {
		$('#btn-limpar-categoria').prop('disabled', true);
		$('#nome-categoria').prop('disabled', true);
	}

	function novoBloqueiaExclusaoCategoria() {
		zeraInputCategoria();
		liberaEdicaoCategoria();
		$("#btn-editar-categoria").css("display", "none");
		$("#btn-excluir-categoria").css("display", "none");
	}

	function liberaExclusaoCategoria() {
		$("#btn-editar-categoria").css("display", "none");
		$("#btn-excluir-categoria").css("display", "none");
	}

	function zeraInputCategoria() {
		$("#nome-categoria").val('');
		if (!isEditando) {
			$("#id-categoria").val('');
		}
	}

	function podeExcluir(id) {
		let categoriaAExcluir = findCategoriaById(id);
		for (var i = listaTarefas.length - 1; i >= 0; i--) {
			if (categoriaAExcluir.nome = listaTarefas[i].categoria) {
				alert("Impossível excluir categoria enquanto houver tarefas nela !!!");
				return false;
			}
		}
		return true;
	}

	function excluiCategoria(id) {
		listaCategorias = listaCategorias.filter(function (value) {
			return value.id != id;
		});
	}

	function excluiCategoriaByButton() {
		let id = $("#id-categoria").val();
		if (podeExcluir(id)) {
			excluiCategoria(id);
			salvaCategoriaNoLocalStorage();
			renderizaCategorias();
			$('#Modal-Categoria').modal('hide');
		}
	}

	function salvaCategoriaNoLocalStorage() {
		/* Convertendo Lista para JSON*/
		const listaJSON = JSON.stringify(listaCategorias);
		/* Coloca a lista no LocalStorage */
		localStorage.setItem("listaCategorias", listaJSON);
	}

	function pegaCategoriaNoLocalStorage() {
		/* Busca no Local Storage pela key lista*/
		const listaStorage = localStorage.getItem("listaCategorias");
		/* converte para lista denovo*/
		listaCategorias = JSON.parse(listaStorage) || [];
	}

	/* Executa assim que termina de carregar a pagina*/

	pegaCategoriaNoLocalStorage();
	renderizaCategorias();
	// pega acao do botao Nova Categoria do Jumbotron
	$("#btn-nova-categoria-home").on("click", function (evt) {
		novoBloqueiaExclusaoCategoria();
	});
	// pega acao do botao Nova Categoria acima da tabela de categorias
	$("#btn-nova-categoria").on("click", function (evt) {
		novoBloqueiaExclusaoCategoria();
	});
	// pega acao do botao excluir categoria dentro do modal de categoria
	$("#btn-excluir-categoria").on("click", function (evt) {
		excluiCategoriaByButton();
	});
	// pega acao do botao limpar categoria dentro do modal de categoria
	$("#btn-limpar-categoria").on("click", function (evt) {
		zeraInputCategoria();
	});
	// pega acao do botao editar categoria dentro do modal de categoria
	$("#btn-editar-categoria").on("click", function (evt) {
		liberaEdicaoCategoria();
	});
	$("#form-categorias").on("submit", function (evt) {
		salvarCategorias();
		// para stopeia a propagacao
		evt.stopPropagation();
		// previne a execucao padrao
		evt.preventDefault();
	});

	return {
		renCat: listaCategorias
	};
})();
