//                                              | minhasViagens.js |

//referências às três listas
const listaReservadas = document.getElementById("reservadas");
const listaPublicadas = document.getElementById("publicadas");
const listaRealizadas = document.getElementById("realizadas");

//só quem fez login tem viagens
const conta = utilizadorAtual();

if (conta === null) {
    window.location.href = "Login.html";
} else {
    mostrarTudo();
}

//lê as boleias e desenha as três listas
function mostrarTudo() {
    const todas = lerBoleias();
    const agora = new Date();

    const minhasComoPassageiro = todas.filter(b => b.passageiros.includes(conta.email));
    const minhasComoCondutor = todas.filter(b => b.condutor === conta.email);

    //viagens reservadas
    const reservadas = minhasComoPassageiro.filter(b => momentoDaBoleia(b) > agora).sort(porData);

    //viagens publicadas por mim
    const publicadas = minhasComoCondutor.filter(b => momentoDaBoleia(b) > agora).sort(porData);

    //realizadas: já passaram e não foram canceladas (as mais recentes primeiro)
    const realizadas = [...minhasComoPassageiro, ...minhasComoCondutor]
        .filter(b => momentoDaBoleia(b) <= agora && !b.cancelada)
        .sort(porData)
        .reverse();

    desenhar(listaReservadas, reservadas, linhaReservada, "Ainda não reservaste nenhuma boleia.");
    desenhar(listaPublicadas, publicadas, linhaPublicada, "Ainda não publicaste nenhuma boleia.");
    desenhar(listaRealizadas, realizadas, linhaRealizada, "Ainda não fizeste nenhuma viagem.");
}

//desenha uma lista com a função de linha certa, ou a frase de vazio
function desenhar(elemento, lista, funcaoLinha, textoVazio) {
    if (lista.length === 0) {
        elemento.innerHTML = `<p class="text-body-secondary mb-0">${textoVazio}</p>`;
        return;
    }
    elemento.innerHTML = lista.map(funcaoLinha).join("");
}

//parte comum de todas as linhas: iniciais do condutor, trajeto, data e hora, e a segunda linha
function inicioLinha(b, segundaLinha) {
    const condutor = contaPorEmail(b.condutor);
    return `
        <span class="avatar" aria-hidden="true">${condutor.nome[0]}${condutor.apelido[0]}</span>
        <div class="flex-grow-1 min-w-0">
            <p class="fw-semibold mb-0">${b.de} → ${b.para} <span class="fw-normal text-body-secondary">· ${formatarData(b.data)} às ${b.hora}</span></p>
            <p class="small text-body-secondary mb-0">${segundaLinha}</p>
        </div>`;
}

//linha de uma boleia que reservei
function linhaReservada(b) {
    const condutor = contaPorEmail(b.condutor);

    //cancelada pelo condutor: sem botão, com a mensagem do reembolso
    if (b.cancelada) {
        return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, `${condutor.nome} · ${b.pontoEncontro}`)}
            <span class="badge rounded-pill bg-danger-subtle text-danger-emphasis border border-danger-subtle text-wrap">Cancelada pelo condutor · reembolso total</span>
        </div>`;
    }

    return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, `${condutor.nome} · ${b.pontoEncontro}`)}
            <div class="text-end">
                <p class="fw-semibold mb-1 text-nowrap">${b.gratuita ? "Gratuita" : "até " + formatarPreco(precoMaximo(b))}</p>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="cancelarReserva('${b.id}')">Cancelar</button>
            </div>
        </div>`;
}

//linha de uma boleia que publiquei
function linhaPublicada(b) {
    const ocupados = `${b.passageiros.length} de ${b.lugares} lugares reservados`;

    if (b.cancelada) {
        return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, `${ocupados} · ${b.pontoEncontro}`)}
            <span class="badge rounded-pill bg-danger-subtle text-danger-emphasis border border-danger-subtle">Cancelada</span>
        </div>`;
    }

    //preço por passageiro com os passageiros que já há (com 0, mostra o máximo)
    const preco = b.gratuita
        ? "Gratuita"
        : formatarPreco(precoPorPassageiro(kmDaBoleia(b), Math.max(b.passageiros.length, 1)));

    return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, `${ocupados} · ${b.pontoEncontro}`)}
            <div class="text-end">
                <p class="fw-semibold mb-1 text-nowrap">${preco}</p>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="cancelarBoleia('${b.id}')">Cancelar</button>
            </div>
        </div>`;
}

//linha de uma viagem que já aconteceu
function linhaRealizada(b) {
    const fuiCondutor = b.condutor === conta.email;
    const condutor = contaPorEmail(b.condutor);

    //o que cada passageiro pagou: o preço final com os passageiros que foram
    const pago = b.gratuita ? "Gratuita" : formatarPreco(precoPorPassageiro(kmDaBoleia(b), b.passageiros.length));

    const segunda = fuiCondutor
        ? `Foste o condutor · ${b.passageiros.length} passageiros · ${pago} cada`
        : `Condutor: ${condutor.nome} · pagaste ${pago}`;

    return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, segunda)}
        </div>`;
}

//botão "Cancelar" de uma reserva
function cancelarReserva(id) {
    const boleia = lerBoleias().find(b => b.id === id);
    pedirCancelamentoReserva(boleia, conta.email, mostrarTudo);
}

//botão "Cancelar" de uma boleia publicada
function cancelarBoleia(id) {
    const boleia = lerBoleias().find(b => b.id === id);
    pedirCancelamentoBoleia(boleia, mostrarTudo);
}
