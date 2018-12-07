/* Exercicio 1 */
$(".ok").addClass("sucesso");
$(".problema").addClass("erro");
/* Joao Victor BAESSO */

/* Exercicio 2 */
$("#div-filha span").removeClass("erro");
/* Joao Victor BAESSO */

/* Exercicio 3 */
$('#create-me-btn').on('click', function () {
	var ultimoValor = $("#create-me div:last-child").text();
	let newDiv = $('<div>');
	let max = $('#create-me-btn').data('max');

	if (parseInt(ultimoValor) < max) {
		let newValor = 1 + parseInt(ultimoValor);
		$(newDiv).text(newValor + ' - Elemento número ' + newValor);
		$('#create-me').append(newDiv);
	} else {
		$(newDiv).text('Quantidade Máxima Atingida');
		$('#create-me').append(newDiv);
		$('#create-me div:last-child').addClass("vermelho");
		$('#create-me-btn').prop('disabled', true);
	}
});
/* Joao Victor BAESSO */

/* Exercicio 4 */
$('#copy-me-btn').on('click', function () {
	$('#destino').html($('#origem').html());
})
/* Joao Victor BAESSO */

/* Exercicio 5 */
var totalLinhas = $('#tabela-totais tbody tr').length;

for (let index = 1; index <= totalLinhas; index++) {
	var qnt = 0;
	var uni = 0;
	qnt = parseFloat($("#tabela-totais tbody tr:nth-child(" + index + ") td:nth-child(2)").html());
	uni = parseFloat($("#tabela-totais tbody tr:nth-child(" + index + ") td:nth-child(3)").html());

	/* Celula que recebe o valor total */
	$('#tabela-totais tbody tr:nth-child(' + index + ') td:nth-child(4)').html(qnt * uni);
}
/* Joao Victor BAESSO */

/* Exercicio 6 */
var totalLinhas = $('#tabela-totais-2 tbody tr').length;
var valorTotalGeral = 0;
for (let index = 1; index <= totalLinhas; index++) {
	var qnt = 0;
	var uni = 0;
	qnt = parseFloat($("#tabela-totais-2 tbody tr:nth-child(" + index + ") td:nth-child(2)").html());
	uni = parseFloat($("#tabela-totais-2 tbody tr:nth-child(" + index + ") td:nth-child(3)").html());

	/* Celula que recebe o valor total */
	$('#tabela-totais-2 tbody tr:nth-child(' + index + ') td:nth-child(4)').html(qnt * uni);

	var valorTotalProd = parseFloat($('#tabela-totais-2 tbody tr:nth-child(' + index + ') td:nth-child(4)').html());
	valorTotalGeral += valorTotalProd;

	$('#tabela-totais-2 tfoot #total-geral').html(valorTotalGeral.toFixed(2));
}
/* Joao Victor BAESSO */


