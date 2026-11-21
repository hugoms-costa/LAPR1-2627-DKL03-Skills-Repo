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

    //realizadas: já passaram, não foram canceladas e (como passageiro) foram pagas
    const realizadas = [...minhasComoPassageiro.filter(b => pagou(b, conta.email)), ...minhasComoCondutor]
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
            <p class="fw-semibold mb-0">${b.de} → ${b.para} <span class="fw-normal text-body-secondary">- ${formatarData(b.data)} às ${b.hora}</span></p>
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
            ${inicioLinha(b, `${condutor.nome} - ${b.pontoEncontro}`)}
            <span class="badge rounded-pill bg-danger-subtle text-danger-emphasis border border-danger-subtle text-wrap">Cancelada pelo condutor - reembolso total</span>
        </div>`;
    }

    //já pagou: lugar confirmado, o valor fica retido até à viagem
    if (pagou(b, conta.email) && !b.gratuita) {
        return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, `${condutor.nome} - ${b.pontoEncontro}`)}
            <div class="text-end">
                <p class="fw-semibold mb-1 text-nowrap">${formatarPreco(precoFinal(b))}</p>
                <span class="badge rounded-pill bg-success-subtle text-success-emphasis border border-success-subtle text-wrap">Pago - retido até à viagem</span>
            </div>
        </div>`;
    }

    //últimos 30 min: tem de pagar o preço final para confirmar
    if (emPeriodoDePagamento(b) && !b.gratuita) {
        return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, `${condutor.nome} - ${b.pontoEncontro} - paga para confirmar o lugar`)}
            <div class="text-end">
                <p class="fw-semibold mb-1 text-nowrap">${formatarPreco(precoFinal(b))}</p>
                <button type="button" class="btn btn-sm btn-boleia" onclick="pagar('${b.id}')">Pagar</button>
            </div>
        </div>`;
    }

    return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, `${condutor.nome} - ${b.pontoEncontro}`)}
            <div class="text-end">
                <p class="fw-semibold mb-1 text-nowrap">${b.gratuita ? "Gratuita" : "até " + formatarPreco(precoMaximo(b))}</p>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="cancelarReserva('${b.id}')">Cancelar</button>
            </div>
        </div>`;
}

//linha de uma boleia que publiquei
function linhaPublicada(b) {
    const ocupados = `${b.passageiros.length} de ${b.lugares} lugares reservados` + (b.gratuita ? "" : ` - ${b.pagos.length} pagos`);

    if (b.cancelada) {
        return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, `${ocupados} - ${b.pontoEncontro}`)}
            <span class="badge rounded-pill bg-danger-subtle text-danger-emphasis border border-danger-subtle">Cancelada</span>
        </div>`;
    }

    //preço por passageiro com os passageiros que já há (com 0, mostra o máximo)
    const preco = b.gratuita
        ? "Gratuita"
        : formatarPreco(precoPorPassageiro(kmDaBoleia(b), Math.max(b.passageiros.length, 1)));

    return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, `${ocupados} - ${b.pontoEncontro}`)}
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
    const pago = b.gratuita ? "Gratuita" : formatarPreco(precoFinal(b));

    const segunda = fuiCondutor
        ? `Foste o condutor - ${b.passageiros.length} passageiros - ${pago} cada`
        : `Condutor: ${condutor.nome} - pagaste ${pago}`;

    //quem eu tenho de avaliar: o condutor, ou os passageiros se fui eu o condutor
    const porAvaliar = pessoasParaAvaliar(b).filter(email => !jaAvaliou(b.id, conta.email, email));

    const botaoAvaliar = porAvaliar.length > 0
        ? `<button type="button" class="btn btn-sm btn-boleia" onclick="avaliar('${b.id}')">Avaliar</button>`
        : `<span class="small text-body-secondary">Avaliado</span>`;

    return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3">
            ${inicioLinha(b, segunda)}
            <div class="text-end d-flex flex-column align-items-end gap-1">
                ${botaoAvaliar}
                <button type="button" class="btn btn-link btn-sm p-0 text-danger-emphasis" onclick="denunciar('${b.id}')">Denunciar</button>
            </div>
        </div>`;
}

//emails das pessoas com quem viajei nesta boleia
function pessoasParaAvaliar(b) {
    if (b.condutor === conta.email) {
        return b.passageiros.filter(email => pagou(b, email));
    }
    return [b.condutor];
}

//nome completo a partir do email
function nomeDe(email) {
    const c = contaPorEmail(email);
    return `${c.nome} ${c.apelido}`;
}

//botão "Pagar" de uma reserva nos últimos 30 min
function pagar(id) {
    const boleia = lerBoleias().find(b => b.id === id);
    pedirPagamento(boleia, conta.email, mostrarTudo);
}

//botão "Avaliar": uma linha de estrelas por cada pessoa que falta avaliar
function avaliar(id) {
    const boleia = lerBoleias().find(b => b.id === id);
    const porAvaliar = pessoasParaAvaliar(boleia).filter(email => !jaAvaliou(id, conta.email, email));

    const html = porAvaliar.map((email, i) => `
        <div class="mb-3">
            <p class="mb-1">${nomeDe(email)}</p>
            <div class="estrelas-input">
                ${[5, 4, 3, 2, 1].map(n => `
                    <input type="radio" name="nota${i}" id="nota${i}-${n}" value="${n}">
                    <label for="nota${i}-${n}" title="${n} estrelas">★</label>`).join("")}
            </div>
        </div>`).join("") + `<p class="small text-danger d-none mb-0" id="erroAvaliar">Dá uma nota a todos.</p>`;

    confirmar("Avaliar viagem", html, "Enviar avaliação", () => {
        //lê a nota escolhida para cada pessoa
        const notas = porAvaliar.map((email, i) => document.querySelector(`input[name="nota${i}"]:checked`));

        //se faltar alguma, não fecha a janela
        if (notas.some(n => n === null)) {
            document.getElementById("erroAvaliar").classList.remove("d-none");
            return false;
        }

        porAvaliar.forEach((email, i) => {
            guardarAvaliacao({ boleia: id, de: conta.email, para: email, nota: Number(notas[i].value) });
        });
        mostrarAviso("Avaliação enviada. Obrigado!");
        mostrarTudo();
    });
}

//botão "Denunciar": escolher a pessoa e o motivo
function denunciar(id) {
    const boleia = lerBoleias().find(b => b.id === id);
    const pessoas = boleia.condutor === conta.email ? boleia.passageiros : [boleia.condutor];

    const html = `
        <label for="denunciaPessoa" class="form-label">Quem queres denunciar?</label>
        <select id="denunciaPessoa" class="form-select mb-3">
            ${pessoas.map(email => `<option value="${email}">${nomeDe(email)}</option>`).join("")}
        </select>
        <label for="denunciaMotivo" class="form-label">Motivo</label>
        <select id="denunciaMotivo" class="form-select mb-3">
            <option value="">Escolhe</option>
            <option>Comportamento inadequado</option>
            <option>Condução perigosa</option>
            <option>Não apareceu</option>
            <option>Outro</option>
        </select>
        <label for="denunciaTexto" class="form-label">O que aconteceu? (opcional)</label>
        <textarea id="denunciaTexto" class="form-control" rows="3"></textarea>
        <p class="small text-danger d-none mt-2 mb-0" id="erroDenuncia">Escolhe o motivo.</p>`;

    confirmar("Denunciar utilizador", html, "Enviar denúncia", () => {
        const motivo = document.getElementById("denunciaMotivo").value;

        if (motivo === "") {
            document.getElementById("erroDenuncia").classList.remove("d-none");
            return false;
        }

        guardarDenuncia({
            boleia: id,
            de: conta.email,
            para: document.getElementById("denunciaPessoa").value,
            motivo: motivo,
            texto: document.getElementById("denunciaTexto").value.trim()
        });
        mostrarAviso("Denúncia enviada. A equipa vai analisar.");
    });
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
