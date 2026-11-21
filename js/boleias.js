//                                              | boleias.js |

//quem está ligado (null se ninguém fez login: pode ver as boleias, mas não reservar)
const conta = utilizadorAtual();

//todas as boleias, lidas do localStorage
const todas = lerBoleias();

//const que guarda a div onde se vão colocar as boleias
const cards = document.getElementById("resultados");

//const que guarda a barra de pesquisa
const pesquisa = document.getElementById("pesquisa");

//const que guarda o parágrafo onde aparece quantas boleias há
const contagem = document.getElementById("contagem");

//true se quem está ligado reservou esta boleia
function souPassageiro(boleia) {
    return conta !== null && boleia.passageiros.includes(conta.email);
}

//boleias que aparecem: não canceladas, que não são minhas, e com lugares (ou reservadas por mim)
//ordenadas por data e hora
function visiveis() {
    return todas
        .filter(b => !b.cancelada)
        .filter(b => reservasAbertas(b))
        .filter(b => conta === null || b.condutor !== conta.email)
        .filter(b => lugaresLivres(b) > 0 || souPassageiro(b))
        .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}

//função para mostrar uma linha da lista para cada boleia
function mostrar(lista) {
    //quantas boleias há (singular ou plural)
    contagem.textContent = lista.length === 1 ? "1 boleia disponível" : `${lista.length} boleias disponíveis`;

    if (lista.length === 0){
        cards.innerHTML = `<p class="text-body-secondary mt-2">Não há boleias para essa zona.</p>`;
        return;
    }

    cards.innerHTML = lista.map(b => {
        const condutor = contaPorEmail(b.condutor);
        const reservada = souPassageiro(b);
        const livres = lugaresLivres(b);
        const estado = reservada ? "Reservada por ti" : (livres === 1 ? "1 lugar livre" : `${livres} lugares livres`);

        return `
        <div class="list-group-item d-flex align-items-center gap-3 py-3 ${reservada ? "list-group-item-success" : ""}">
            <span class="avatar" aria-hidden="true">${condutor.nome[0]}${condutor.apelido[0]}</span>
            <div class="flex-grow-1 min-w-0">
                <p class="fw-semibold mb-0">${b.de} → ${b.para} <span class="fw-normal text-body-secondary">- ${formatarData(b.data)} às ${b.hora}</span></p>
                <p class="small mb-0 ${reservada ? "text-success-emphasis" : "text-body-secondary"}">
                    ${condutor.nome} ${textoMedia(b.condutor)} - ${b.pontoEncontro} - ${estado}
                </p>
            </div>
            <div class="text-end">
                <p class="fw-semibold mb-1 text-nowrap">${b.gratuita ? "Gratuita" : "até " + formatarPreco(precoMaximo(b))}</p>
                <button type="button" onclick="reservar('${b.id}')" class="btn btn-sm ${reservada ? "btn-outline-danger" : "btn-boleia"}">${reservada ? "Cancelar" : "Reservar"}</button>
            </div>
        </div>`;
    }).join(""); //inicialmente não coloquei isto, pedi ajuda ao claude pq entre os cards apareciam ",". O .join("") junta os cards numa string só
}

//reserva um lugar na boleia, ou cancela a reserva se já for passageiro (sempre com confirmação)
function reservar(id){
    //para reservar é preciso ter feito login
    if (conta === null) {
        window.location.href = "Login.html";
        return;
    }

    const boleia = todas.find(b => b.id === id);
    if (boleia === undefined) {
        return;
    }

    //depois de confirmar, volta a ler as boleias guardadas e redesenha a lista
    const depois = () => {
        todas.splice(0, todas.length, ...lerBoleias());
        pesquisar();
    };

    if (souPassageiro(boleia)) {
        pedirCancelamentoReserva(boleia, conta.email, depois);
    }
    else if (lugaresLivres(boleia) > 0) {
        pedirReserva(boleia, conta.email, depois);
    }
}

//função para filtrar as boleias pela zona escrita na pesquisa (de ou para)
function pesquisar() {
    const termo = pesquisa.value.toLowerCase();
    const resultado = visiveis().filter(b => `${b.de} ${b.para}`.toLowerCase().includes(termo));
    mostrar(resultado);
}

//mostra as boleias quando a página abre (com a pesquisa vazia aparecem todas)
pesquisar();

//quando a barra de pesquisa é alterada, filtra
pesquisa.addEventListener("input", pesquisar);
