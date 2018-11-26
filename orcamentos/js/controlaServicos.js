// executa assim que a página terminar de carregar
var SERVICOS = (function () {

	var listaServicos = [];
	var valorTotal = 0;

	function salvar() {
		var servico = {};

		servico.descricao = $("#descricao").val();
		servico.valor = parseFloat($("#valor-servico").val());
		let id = $("#id-servico").val();

		// não tenho código = criar novo
		if (id == undefined || id == '') {
			servico.id = new Date().getTime();
			listaServicos.push(servico);
		} else { // se tenho id, estou editando
			let idNumber = parseInt(id);
			let servicoExistente = findServicoById(idNumber);
			if (servicoExistente) {
				servicoExistente.descricao = servico.descricao;
				servicoExistente.valor = servico.valor;
			}
		}
		renderiza();
		zerarInputs();
		atualizaValores();
		$('#btn-excluir-se').addClass('d-none');
		$('#btn-salvar-se').html('Adicionar');


		return false;
	}

	function calculaTotal() {
		valorTotal = 0;
		for (let i = 0; i < listaServicos.length; i++) {
			const servico = listaServicos[i];
			valorTotal += parseFloat(servico.valor);
		}
		return valorTotal;
	}

	function renderiza() {
		// busco o tbody com o id
		const tbody = $("#body-servicos");

		// zerando o conteúdo da tabela
		tbody.html('');

		for (let i = 0; i < listaServicos.length; i++) {
			// Busco a pessoa da lista
			const servico = listaServicos[i];

			// cria um elemento html do tipo tr
			// table row - linha da tabela
			let tr = $('<tr>');

			// cria um elemento html do tipo td
			// table data - dado da tabela
			// popular os td com o valor a ser mostrado

			let tdDescricao = $('<td>');
			let tdValor = $('<td>');

			tdDescricao.text(servico.descricao);
			tdValor.text(servico.valor)

			// associa o click a uma function
			tr.on('click', function () {
				editar(servico.id);
				$('#btn-excluir-se').removeClass('d-none');
				$('#btn-salvar-se').html('Salvar');
			});

			// adiciono os td dentro do tr
			// na order a ser exibida
			tr.append(tdDescricao);
			tr.append(tdValor);

			// adiciona o tr no tbody
			tbody.append(tr);
		}
		$('#total-servicos').text(calculaTotal());
	}

	function editar(id) {
		let servico = findServicoById(id);

		if (servico) {
			$("#descricao").val(servico.descricao);
			$("#valor-servico").val(servico.valor);
			$("#id-servico").val(servico.id);
		} else {
			alert('Não foi possível encontrar o serviço');
		}
	}


	function excluir(id) {
		listaServicos = listaServicos.filter(function (value) {
			return value.id != id;
		});
		renderiza();
	}

	function findServicoById(id) {
		let servicos = listaServicos.filter(function (value) {
			return value.id == id;
		});

		if (servicos.length == 0) {
			return undefined;
		} else {
			return servicos[0];
		}
	}

	function excluiServicoByButton() {
		let id = $("#id-produto").val();
		excluir(id);

		renderiza();
		$('#btn-excluir').addClass('d-none');
	}

	$('#btn-excluir').on('click', function () {
		excluiServicoByButton();
	});

	renderiza();

	$("#form-servicos").on("submit", function (evt) {
		salvar();
		// corta a linha de execucao
		evt.stopPropagation();

		// previne o comportamento padrão
		evt.preventDefault();
	});

	// busco todos os inputs
	$('input, select').each(function (index, element) {
		element.oninvalid = function () {
			const msg = $(this).data('custom-message');

			if (msg) {
				// remove mensagens de erro antigas
				this.setCustomValidity("");

				// executa novamente a validação
				if (!this.validity.valid) {
					// se inválido, coloca mensagem de erro customizada
					this.setCustomValidity(msg);
				}
			}
		}
	});
	return {
		valorServicos: calculaTotal,
		listaServicos: listaServicos
	}

})();
