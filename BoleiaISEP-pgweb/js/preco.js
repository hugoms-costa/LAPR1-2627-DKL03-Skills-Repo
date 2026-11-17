/* Simulador do preço de uma boleia (secção "Funcionamento").
   Fórmula do relatório: preço por passageiro = (d · v) / (n + 1)
   d = distância em km, v = valor por km, n = número de passageiros. */
(function () {
  var VALOR_KM = 0.4; // €/km (valor de referência)

  var distancia = document.getElementById("sim-distancia");
  var passageiros = document.getElementById("sim-passageiros");
  var total = document.getElementById("sim-total");
  var preco = document.getElementById("sim-preco");
  if (!distancia || !passageiros || !total || !preco) return;

  function euros(valor) {
    return valor.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
  }

  function atualizar() {
    var d = Math.max(0, parseFloat(distancia.value) || 0);
    var n = parseInt(passageiros.value, 10);
    var custo = d * VALOR_KM;
    total.textContent = euros(custo);
    preco.textContent = euros(custo / (n + 1));
  }

  distancia.addEventListener("input", atualizar);
  passageiros.addEventListener("change", atualizar);
  atualizar();
})();
