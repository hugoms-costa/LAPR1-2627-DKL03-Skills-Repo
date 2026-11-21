//                                              | darBoleia.js |

//referências ao formulário e aos campos
const form = document.getElementById("formBoleia");
const campoSentido = document.getElementById("sentido");
const campoLocalidade = document.getElementById("localidade");
const rotuloLocalidade = document.getElementById("rotuloLocalidade");
const listaSugestoes = document.getElementById("sugestoes");
const estadoLocalidade = document.getElementById("estadoLocalidade");
const textoDistancia = document.getElementById("distancia");
const campoData = document.getElementById("data");
const campoHora = document.getElementById("hora");
const campoLugares = document.getElementById("lugares");
const campoPonto = document.getElementById("pontoEncontro");
const switchGratuita = document.getElementById("gratuita");
const textoPreco = document.getElementById("precoMaximo");
const erroBoleia = document.getElementById("erroBoleia");

//localidade escolhida nas sugestões: { localidade, km } (null enquanto não se escolher nenhuma)
let escolhida = null;

//temporizador da pesquisa (para só pesquisar quando se pára de escrever)
let temporizador = null;

//só quem fez login pode dar boleia (o condutor é quem está ligado)
const conta = utilizadorAtual();

if (conta === null) {
    window.location.href = "Login.html";
} else {
    prepararFormulario();
}

//relógio para escolher a hora (biblioteca flatpickr)
function prepararFormulario() {
    preencherLista(campoPonto, PONTOS_ENCONTRO);

    flatpickr(campoHora, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        minuteIncrement: 15,
        minTime: "06:00",
        maxTime: "23:00",
        defaultHour: 8,
        disableMobile: true
    });

    //calendário para escolher a data (flatpickr), em português e sempre dia/mês/ano
    flatpickr(campoData, {
        locale: "pt",           //meses e dias da semana em português
        dateFormat: "Y-m-d",    //o valor guardado continua "2026-11-20"
        altInput: true,         //mas o que se vê é outro campo...
        altFormat: "d/m/Y",     //...com "20/11/2026", seja qual for a língua do browser
        minDate: "today",       //não deixa escolher datas que já passaram
        disableMobile: true
    });

    //o preço muda sempre que muda o trajeto ou a opção gratuita
    campoSentido.addEventListener("change", atualizarRotulo);
    campoLocalidade.addEventListener("input", aoEscreverLocalidade);
    switchGratuita.addEventListener("change", atualizarPreco);
    form.addEventListener("submit", publicar);
}

//põe numa <select> uma opção "Escolhe" e uma opção por cada texto da lista
function preencherLista(select, lista) {
    select.innerHTML = `<option value="">Escolhe</option>` +
        lista.map(texto => `<option value="${texto}">${texto}</option>`).join("");
}

//muda o texto do campo conforme o sentido da viagem
function atualizarRotulo() {
    rotuloLocalidade.textContent = campoSentido.value === "ida" ? "De onde partes?" : "Para onde vais?";
}

//cada vez que se escreve: a escolha anterior deixa de valer e a pesquisa espera 600 ms
//(o Nominatim pede no máximo 1 pedido por segundo, por isso não pesquisamos a cada letra)
function aoEscreverLocalidade() {
    escolhida = null;
    atualizarPreco();
    clearTimeout(temporizador);

    const texto = campoLocalidade.value.trim();
    if (texto.length < 3) {
        esconderSugestoes();
        return;
    }
    temporizador = setTimeout(() => procurarLocalidade(texto), 600);
}

//pergunta ao Nominatim que moradas correspondem ao texto
async function procurarLocalidade(texto) {
    estadoLocalidade.textContent = "A procurar...";

    const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=pt&accept-language=pt"
        + "&viewbox=-9.0,41.7,-8.0,40.8"     //dá prioridade à zona do Porto
        + "&q=" + encodeURIComponent(texto);

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error("resposta " + resposta.status);
        }
        const resultados = await resposta.json();
        mostrarSugestoes(resultados);
    } catch (erro) {
        esconderSugestoes();
        estadoLocalidade.textContent = "Não foi possível procurar a localidade. Verifica a internet e tenta outra vez.";
    }
}

//desenha as sugestões por baixo do campo
function mostrarSugestoes(resultados) {
    if (resultados.length === 0) {
        esconderSugestoes();
        estadoLocalidade.textContent = "Não encontrámos nada. Tenta escrever de outra forma.";
        return;
    }

    estadoLocalidade.textContent = "Escolhe uma das sugestões.";
    listaSugestoes.innerHTML = "";

    for (const r of resultados) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "list-group-item list-group-item-action small";
        botao.textContent = r.display_name.split(", ").slice(0, 4).join(", ");   //morada curta
        botao.addEventListener("click", () => escolherSugestao(r));
        listaSugestoes.appendChild(botao);
    }
    listaSugestoes.classList.remove("d-none");
}

//esconde e limpa a lista de sugestões
function esconderSugestoes() {
    listaSugestoes.classList.add("d-none");
    listaSugestoes.innerHTML = "";
}

//nome da localidade de um resultado
function nomeDaLocalidade(r) {
    const a = r.address ?? {};
    return a.city ?? a.town ?? a.village ?? a.municipality ?? a.suburb ?? a.county ?? r.name;
}

//quando se carrega numa sugestão guarda a localidade e calcula a distância até ao ISEP
function escolherSugestao(r) {
    escolhida = {
        localidade: nomeDaLocalidade(r),
        km: kmAteAoIsep(Number(r.lat), Number(r.lon))
    };
    campoLocalidade.value = r.display_name.split(", ").slice(0, 2).join(", ");
    esconderSugestoes();
    estadoLocalidade.textContent = `Na boleia aparece: ${escolhida.localidade}`;
    atualizarPreco();
}

//mostra o preço máximo por passageiro
function atualizarPreco() {
    textoDistancia.textContent = escolhida === null ? "" : `(cerca de ${String(escolhida.km).replace(".", ",")} km)`;

    if (switchGratuita.checked) {
        textoPreco.textContent = "Gratuita";
        return;
    }
    if (escolhida === null) {
        textoPreco.textContent = "—";
        return;
    }
    textoPreco.textContent = formatarPreco(precoPorPassageiro(escolhida.km, 1));
}

//mostra uma mensagem de erro por cima do botão
function mostrarErro(mensagem) {
    erroBoleia.textContent = mensagem;
    erroBoleia.classList.remove("d-none");
}

//lê o formulário, valida, cria a boleia e guarda-a
function publicar(evento) {
    //impede que a submissão do formulário recarregue a página
    evento.preventDefault();

    if (escolhida === null) {
        mostrarErro("Escolhe a localidade numa das sugestões da lista.");
        return;
    }

    //o relógio deixa o campo só de leitura
    if (campoHora.value === "") {
        mostrarErro("Escolhe a hora da viagem.");
        return;
    }

    //o calendário também tira o "required" ao campo: verificamos nós
    if (campoData.value === "") {
        mostrarErro("Escolhe a data da viagem.");
        return;
    }

    //a data e a hora têm de ser no futuro
    if (new Date(`${campoData.value}T${campoHora.value}`) <= new Date()) {
        mostrarErro("Escolhe uma data e hora que ainda não tenham passado.");
        return;
    }

    const novaBoleia = {
        id: crypto.randomUUID(),
        condutor: conta.email,
        de: campoSentido.value === "ida" ? escolhida.localidade : "ISEP",
        para: campoSentido.value === "ida" ? "ISEP" : escolhida.localidade,
        km: escolhida.km,
        data: campoData.value,
        hora: campoHora.value,
        lugares: Number(campoLugares.value),
        pontoEncontro: campoPonto.value,
        gratuita: switchGratuita.checked,
        passageiros: [],
        cancelada: false
    };

    //guarda no localStorage
    guardarBoleia(novaBoleia);
    window.location.href = "Boleias.html";
}
