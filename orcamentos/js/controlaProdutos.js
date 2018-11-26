function zerarInputs() {
	$('#form-servicos input').val('');
	$('#form-produtos input').val('');
}

function atualizaValores() {
	$('#total-produtos-fn').html(PRODUTOS.valorProdutos());
	$('#total-servicos-fn').html(SERVICOS.valorServicos());
	$('#total-geral-fn').html(PRODUTOS.valorProdutos() + SERVICOS.valorServicos());
}

$('#limpa-tudo').on('click', function () {
	location.reload();
})

$('#btn-enviar-orcamento').on('click', function () {

	var orcamento = new Object();
	orcamento.cliente = $('#nome-cliente').val();
	orcamento.cpf = $('#cpf-cliente').val();
	orcamento.totalProdutos = PRODUTOS.valorProdutos();
	orcamento.totalServicos = SERVICOS.valorServicos();
	orcamento.totalGeral = PRODUTOS.valorProdutos() + SERVICOS.valorServicos();
	orcamento.produtos = PRODUTOS.listaprodutos;
	orcamento.servicos = SERVICOS.listaServicos;

	/*alert(JSON.stringify(orcamento)); */
	$.ajax({
		type: "POST",
		url: "http://172.18.24.130:3000/orcamento",
		contentType: "application/json",
		dataType: "json",
		success: function (msg) {
			if (msg) {
				alert("Mandouuu !!!");
				location.reload(true);
			} else {
				alert("Cannot Mandouuu !!!");
			}
		},
		process: false,
		data: JSON.stringify(orcamento)
	});
});

var PRODUTOS = (function () {
	zerarInputs();
	$("#valor-total-produto").val('');

	var listaprodutos = [];

	var isEditando = false;

	var valorTotalcarrinho = 0;

	var valorTotalProduto = 1;

	$("#valor-unitario-produto").on('input', function () {
		valorTotalProduto = calculaTotalProduto();
		$("#valor-total-produto").val(valorTotalProduto);
	});

	function salvarProdutos() {
		var produto = {};

		produto.nome = $("#nome-produto").val();
		produto.quantidade = parseFloat($("#quantidade-produto").val());
		produto.valorUnitario = parseFloat($("#valor-unitario-produto").val());
		produto.valorTotal = valorTotalProduto;
		let idproduto = $('#id-produto').val();

		/* Caso nao tenha o id criar novo*/
		if (idproduto == undefined || idproduto == '') {
			produto.id = new Date().getTime();
		} else { /* se tem esta editando*/
			produto.id = parseInt(idproduto);
		}

		if (isEditando) {
			excluiproduto(produto.id);
			listaprodutos.push(produto);
			isEditando = false;
		} else {
			listaprodutos.push(produto);
		}


		renderizaprodutos();
		zerarInputs();
		atualizaValores();
		$('#btn-excluir').addClass('d-none');
		$('#btn-salvar').html('Adicionar');

		return false;

	}
	function calculaTotalProd() {
		valorTotalcarrinho = 0;
		if (!$(listaprodutos).is(':empty')) {
			for (let i = 0; i < listaprodutos.length; i++) {
				const produto = listaprodutos[i];
				valorTotalcarrinho += parseFloat(produto.valorTotal);
			}
			return valorTotalcarrinho;
		} else {
			return valorTotalcarrinho;
		}

	}

	function calculaTotalProduto() {
		var valorTotal3 = 0;
		if ($("#quantidade-produto") && $("#valor-unitario-produto")) {
			const qntProd = parseFloat($("#quantidade-produto").val());
			const vlProd = parseFloat($("#valor-unitario-produto").val());
			valorTotal3 = qntProd * vlProd;
			return valorTotal3;
		}
	}


	function renderizaprodutos() {
		/* Busca tabela com esse ID*/
		const tbody = $("#corpo-tabela-produtos");

		/* Zera conteudo da tabela*/
		tbody.html('');

		for (let i = 0; i < listaprodutos.length; i++) {
			const produto = listaprodutos[i];

			/* cria elemento do tipo tr - table row */
			let linha = $('<tr>');

			linha.attr("id", "linha-produtos");

			$(linha).on('click', function () {
				$('#btn-excluir').removeClass('d-none');
				isEditando = true;
				editarproduto(produto.id);
				$('#btn-salvar').html('Salvar');
			});

			/* cria elemento td - table data */
			let tdnome = $('<td>');
			let tdquantidade = $('<td>');
			let tdvalorUnitario = $('<td>');
			let tdvalorTotal = $('<td>');

			/* seta os conteudo das td com o que tem que ficar ali dentro*/
			tdnome.html(produto.nome);
			tdquantidade.html(produto.quantidade);
			tdvalorUnitario.html(produto.valorUnitario);
			tdvalorTotal.html(produto.valorTotal);

			if (produto.nome && produto.quantidade && produto.valorUnitario && produto.valorTotal) {
				/* concatena os Td dentro do Tr*/
				linha.append(tdnome);
				linha.append(tdquantidade);
				linha.append(tdvalorUnitario);
				linha.append(tdvalorTotal);

				/* pega o tr e joga dentro do corpo da tabela*/
				tbody.append(linha);

			}

		}
		$('#total-produtos').text(calculaTotalProd());
	}

	function editarproduto(id) {
		let produto = findprodutoById(id);

		if (produto) {
			$("#id-produto").val(produto.id);
			$("#nome-produto").val(produto.nome);
			$("#quantidade-produto").val(produto.quantidade);
			$("#valor-unitario-produto").val(produto.valorUnitario);
			$("#valor-total-produto").val(produto.valorTotal);
		} else {
			alert("Nao foi possivel encontrar o produto");
		}
	}

	/* .filter vai filtrar o array e retornar true quando a condicao for verdadeira, entao ele adiciona na let pessoa*/
	function findprodutoById(id) {
		let produtos = listaprodutos.filter(function (value) {
			return value.id == id;
		});

		if (produtos.length == 0) {
			return undefined;
		} else {
			return produtos[0];
		}

	}

	function excluiproduto(id) {
		listaprodutos = listaprodutos.filter(function (value) {
			return value.id != id;
		});
	}

	function excluiprodutoByButton() {
		let id = $("#id-produto").val();
		excluiproduto(id);

		renderizaprodutos();
		$('#btn-excluir').addClass('d-none');
	}



	renderizaprodutos();
	// pega acao do botao salvar produto dentro do modal de produto
	$("#form-produtos").on("submit", function (evt) {
		salvarProdutos();
		// para stopeia a propagacao
		evt.stopPropagation();
		// previne a execucao padrao
		evt.preventDefault();
	});

	$('#btn-excluir').on('click', function () {
		excluiprodutoByButton();
	});

	return {
		valorProdutos: calculaTotalProd,
		listaprodutos: listaprodutos
	}
})();

