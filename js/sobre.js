//                                              | sobre.js |

//consts que guardam os campos do simulador do preço
const simKm = document.getElementById("simKm");
const simPassageiros = document.getElementById("simPassageiros");
const simTotal = document.getElementById("simTotal");
const simPreco = document.getElementById("simPreco");

//faz a conta com a mesma fórmula das boleias
function simular() {
    const km = Math.max(0, Number(simKm.value));
    const passageiros = Number(simPassageiros.value);

    simTotal.textContent = formatarPreco(km * PRECO_POR_KM);
    simPreco.textContent = formatarPreco(precoPorPassageiro(km, passageiros));
}

simKm.addEventListener("input", simular);
simPassageiros.addEventListener("change", simular);
simular();
