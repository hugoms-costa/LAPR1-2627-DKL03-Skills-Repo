//                                              | index.js |

//consts que guardam quem está logged in e a lista da pág
const conta = utilizadorAtual();
const proximas = document.getElementById("proximas");

//as 3 próximas boleias em que ainda dá para reservar (sem as minhas)
const lista = lerBoleias()
    .filter(b => !b.cancelada)
    .filter(b => reservasAbertas(b))
    .filter(b => lugaresLivres(b) > 0)
    .filter(b => conta === null || b.condutor !== conta.email)
    .sort(porData)
    .slice(0, 3);

if (lista.length === 0) {
    proximas.outerHTML = `<p class="text-body-secondary">Não há boleias marcadas.</p>`;
} else {
    //cada linha leva para a pág das boleias, que é onde se reserva
    proximas.innerHTML = lista.map(b => `
        <a href="html/Boleias.html" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-3 px-0 py-3">
            <div class="min-w-0">
                <p class="fw-semibold mb-0">${b.de} → ${b.para}</p>
                <p class="small text-body-secondary mb-0">${formatarData(b.data)} · ${b.hora} · ${contaPorEmail(b.condutor).nome}</p>
            </div>
            <span class="text-nowrap">${b.gratuita ? "Gratuita" : "até " + formatarPreco(precoMaximo(b))}</span>
        </a>`).join("");
}
