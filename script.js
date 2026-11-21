//                                              | script.js |

//Lista dos utilizadores (pass = "nome123")
const utilizadores = [
    {email: "1261271@isep.ipp.pt", nome: "Hugo",    apelido: "Costa",   curso: "Engenharia Informática", hashPwd: "1c910cef708602ead93da4f79767a182da1d6618b695cd5a55c477abc9f8bcaa",  avaliacoes:  [5, 4, 3]},
    {email: "1260809@isep.ipp.pt", nome: "Diana",   apelido: "Sobral",  curso: "Engenharia Informática", hashPwd: "afc466a3368ecd5720833b670fa0d40e376d6c9dc6f61406e3ee496892f2f1e5",  avaliacoes:  [3, 4, 5]},
    {email: "1260673@isep.ipp.pt", nome: "Diogo",   apelido: "Costa",   curso: "Engenharia Informática", hashPwd: "18ceeee2a5a3c6a7e6aa885359ca0b976ef725c9292113cc1e7028e3ca84e552",  avaliacoes:  [2, 4, 4]},
    {email: "1261485@isep.ipp.pt", nome: "Gonçalo", apelido: "Cardoso", curso: "Engenharia Informática", hashPwd: "c19f9184ebde2cf381c1fa5f0d8f4fd71debedec7cacce04a7716b9a206c3be7",  avaliacoes:  [5, 5, 4]}
];


//nome da chave usada no localStorage para as boleias
const CHAVE = "boleias";

//nome da chave onde fica o email de quem fez login
const CHAVE_SESSAO = "utilizador";

//nome da chave onde fica guardado o tema escolhido
const CHAVE_TEMA = "tema";

//nomes das chaves das avaliações e das denúncias
const CHAVE_AVALIACOES = "avaliacoes";
const CHAVE_DENUNCIAS = "denuncias";

//                                              | dados fixos |

//preço por quilómetro
const PRECO_POR_KM = 0.40;

//coordenadas do ISEP (Rua Dr. António Bernardino de Almeida, Porto)
const ISEP = { lat: 41.1780, lon: -8.6081 };

//a distância de estrada é, em média, cerca de 1,3 vezes a distância em linha reta
const FATOR_ESTRADA = 1.3;

//pontos de encontro junto ao campus
const PONTOS_ENCONTRO = [
    "Entrada principal do ISEP",
    "Metro IPO",
    "Asprela",
    "Paragem de autocarro do ISEP"
];

//devolve a data de daqui a X dias
function dataDaquiA(dias) {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return paraTextoData(data);
}

//Date -> "AAAA-MM-DD" (na hora de cá, não em UTC)
function paraTextoData(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

//data e hora de daqui a X minutos (para a boleia de exemplo que está quase a sair)
function daquiAMinutos(minutos) {
    const d = new Date(Date.now() + minutos * 60 * 1000);
    return { data: paraTextoData(d), hora: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` };
}
const QUASE_A_SAIR = daquiAMinutos(25);

//boleias de exemplo (os km são os que seriam calculados na publicação)
const BOLEIAS_EXEMPLO = [
    { id: "1", condutor: "1260809@isep.ipp.pt", de: "Gaia",          para: "ISEP",          data: dataDaquiA(1), hora: "08:00", lugares: 3, km: 9, pontoEncontro: "Metro IPO",                        gratuita: false, passageiros: ["1261485@isep.ipp.pt"], pagos: [], cancelada: false },
    { id: "2", condutor: "1260673@isep.ipp.pt", de: "Maia",          para: "ISEP",          data: dataDaquiA(1), hora: "08:30", lugares: 2, km: 9, pontoEncontro: "Entrada principal do ISEP",        gratuita: false, passageiros: [], pagos: [],                      cancelada: false },
    { id: "3", condutor: "1261485@isep.ipp.pt", de: "ISEP",          para: "Gondomar",      data: dataDaquiA(2), hora: "18:00", lugares: 3, km: 10, pontoEncontro: "Asprela",                          gratuita: false, passageiros: ["1260809@isep.ipp.pt"], pagos: [], cancelada: false },
    { id: "4", condutor: "1260809@isep.ipp.pt", de: "Matosinhos",    para: "ISEP",          data: dataDaquiA(3), hora: "09:00", lugares: 1, km: 9, pontoEncontro: "Metro IPO",                        gratuita: true,  passageiros: [], pagos: [],                      cancelada: false },
    { id: "5", condutor: "1260673@isep.ipp.pt", de: "Braga",         para: "ISEP",          data: dataDaquiA(2), hora: "07:30", lugares: 4, km: 55, pontoEncontro: "Entrada principal do ISEP",        gratuita: false, passageiros: ["1261271@isep.ipp.pt"], pagos: [], cancelada: false },
    { id: "6", condutor: "1261271@isep.ipp.pt", de: "ISEP",          para: "Porto (Baixa)", data: dataDaquiA(4), hora: "17:30", lugares: 3, km: 4, pontoEncontro: "Metro IPO",                        gratuita: false, passageiros: ["1260673@isep.ipp.pt"], pagos: [], cancelada: false },
    { id: "7", condutor: "1261485@isep.ipp.pt", de: "Valongo",       para: "ISEP",          data: dataDaquiA(2), hora: "08:15", lugares: 3, km: 12, pontoEncontro: "Entrada principal do ISEP",        gratuita: false, passageiros: ["1261271@isep.ipp.pt"], pagos: [], cancelada: true },
    { id: "8", condutor: "1260809@isep.ipp.pt", de: "Gaia",          para: "ISEP",          data: dataDaquiA(-3), hora: "08:00", lugares: 3, km: 9, pontoEncontro: "Metro IPO",                       gratuita: false, passageiros: ["1261271@isep.ipp.pt"], pagos: ["1261271@isep.ipp.pt"], cancelada: false },
    { id: "9", condutor: "1261271@isep.ipp.pt", de: "ISEP",          para: "Matosinhos",    data: dataDaquiA(-2), hora: "18:00", lugares: 3, km: 9, pontoEncontro: "Asprela",                         gratuita: false, passageiros: ["1260809@isep.ipp.pt", "1261485@isep.ipp.pt"], pagos: ["1260809@isep.ipp.pt", "1261485@isep.ipp.pt"], cancelada: false },
    //exemplo do relatório: 10 km e 3 passageiros -> 1,00 € por passageiro
    { id: "10", condutor: "1261271@isep.ipp.pt", de: "ISEP",         para: "Rio Tinto",     data: dataDaquiA(3), hora: "18:30", lugares: 3, km: 10, pontoEncontro: "Entrada principal do ISEP",       gratuita: false, passageiros: ["1260809@isep.ipp.pt", "1260673@isep.ipp.pt", "1261485@isep.ipp.pt"], pagos: [], cancelada: false },
    //sai daqui a 25 min: o Hugo já pode pagar para confirmar
    { id: "11", condutor: "1260809@isep.ipp.pt", de: "Maia",         para: "ISEP",          data: QUASE_A_SAIR.data, hora: QUASE_A_SAIR.hora, lugares: 3, km: 9, pontoEncontro: "Metro IPO",              gratuita: false, passageiros: ["1261271@isep.ipp.pt"], pagos: [], cancelada: false }
];

//lê as boleias guardadas no localStorage
function lerBoleias() {
    const texto = localStorage.getItem(CHAVE);

    //se não há nada guarda as boleias de exemplo
    if (texto === null) {
        guardarTodas(BOLEIAS_EXEMPLO);
        return BOLEIAS_EXEMPLO;
    }

    //converte o texto JSON de volta para array
    const boleias = JSON.parse(texto);

    //boleias guardadas antes de haver pagamentos não têm a lista dos pagos
    boleias.forEach(b => b.pagos = b.pagos ?? []);

    return boleias;
}

//acrescenta uma boleia às publicadas
function guardarBoleia(boleia) {
    const guardadas = lerBoleias();
    guardadas.push(boleia); //adiciona a boleia nova
    localStorage.setItem(CHAVE, JSON.stringify(guardadas)); //guarda no localStorage em JSON
}

//dá overwrite da lista toda das boleias no localStorage
function guardarTodas(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
}


//devolve a conta de quem está ligado neste browser, ou null se ninguém fez login
function utilizadorAtual() {
    //lê o "post-it" da sessão: primeiro no localStorage, se não estiver lá, no sessionStorage
    const email = localStorage.getItem(CHAVE_SESSAO) ?? sessionStorage.getItem(CHAVE_SESSAO);

    //não há post-it em nenhuma das gavetas: ninguém fez login
    if (email === null) {
        return null;
    }

    //procura a conta com esse email (se já não existir na lista, devolve null em vez de undefined)
    return utilizadores.find(u => u.email === email) ?? null;
}

//mostra na navbar as iniciais de quem está ligado
function atualizarNavbar() {
    const link = document.querySelector(".navbar .login");
    const circulo = link.querySelector(".avatar");
    const conta = utilizadorAtual();

    //se não estiver ninguém logado não faz nada
    if (conta === null) {
        return;
    }

    //Caso contrário, mostra as iniciais e troca o redirect da página de login para a do perfil
    circulo.textContent = conta.nome[0] + conta.apelido[0];
    circulo.classList.remove("avatar-login");
    link.href = link.getAttribute("href").replace("Login.html", "Perfil.html");
    link.setAttribute("aria-label", `O meu perfil (${conta.nome} ${conta.apelido})`);
}

//corre em todas as páginas
atualizarNavbar();

//                                              | modo escuro |

//define o tema
function aplicarTema(tema) {
    document.documentElement.setAttribute("data-bs-theme", tema);

    const botao = document.getElementById("alternarTema");
    const icone = document.getElementById("iconeTema");

    //no modo escuro mostra o sol no claro mostra a lua
    if (tema === "dark") {
        icone.classList.replace("bi-moon", "bi-sun");
        botao.setAttribute("aria-label", "Mudar para modo claro");
    } else {
        icone.classList.replace("bi-sun", "bi-moon");
        botao.setAttribute("aria-label", "Mudar para modo escuro");
    }
}

//troca entre claro e escuro e guarda a escolha para as outras páginas
function alternarTema() {
    const atual = document.documentElement.getAttribute("data-bs-theme");
    const novo = atual === "dark" ? "light" : "dark";
    localStorage.setItem(CHAVE_TEMA, novo);
    aplicarTema(novo);
}

//ao abrir a página, põe o ícone certo para o tema que já está aplicado
aplicarTema(document.documentElement.getAttribute("data-bs-theme"));
document.getElementById("alternarTema").addEventListener("click", alternarTema);


//                                              | ajudas para as boleias |

//devolve a conta da lista de utilizadores com este email
function contaPorEmail(email) {
    return utilizadores.find(u => u.email === email);
}

//distância da boleia em km (fica guardada quando a boleia é publicada)
function kmDaBoleia(boleia) {
    return boleia.km;
}

//distância em linha reta entre dois pontos (lat, lon), em km (fórmula de Haversine)
function distanciaEmLinhaReta(lat1, lon1, lat2, lon2) {
    const raioTerra = 6371;
    const emRadianos = graus => graus * Math.PI / 180;
    const dLat = emRadianos(lat2 - lat1);
    const dLon = emRadianos(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(emRadianos(lat1)) * Math.cos(emRadianos(lat2)) * Math.sin(dLon / 2) ** 2;
    return raioTerra * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

//distância estimada por estrada até ao ISEP, arredondada a 1 casa decimal
function kmAteAoIsep(lat, lon) {
    const km = distanciaEmLinhaReta(lat, lon, ISEP.lat, ISEP.lon) * FATOR_ESTRADA;
    return Math.round(km * 10) / 10;
}

//fórmula para calcular o preço: (distância × 0,40 €) ÷ (nº de passageiros + 1)
function precoPorPassageiro(km, passageiros) {
    return (km * PRECO_POR_KM) / (passageiros + 1);
}

//preço máximo por passageiro
function precoMaximo(boleia) {
    if (boleia.gratuita) {
        return 0;
    }
    return precoPorPassageiro(kmDaBoleia(boleia), 1);
}

//calcula quantos lugares ainda estão livres
function lugaresLivres(boleia) {
    return boleia.lugares - boleia.passageiros.length;
}

//formata o valor, troca o . pela , e adiciona o cifrão €
function formatarPreco(valor) {
    return valor.toFixed(2).replace(".", ",") + " €";
}

//formata de AAAA-MM-DD para DD-MM
function formatarData(data) {
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}`;
}

//data e hora da boleia como Date para comparar com agora para ver se a boleia já caducou
function momentoDaBoleia(boleia) {
    return new Date(`${boleia.data}T${boleia.hora}`);
}

//quantas horas faltam para a viagem
function horasAteViagem(boleia) {
    return (momentoDaBoleia(boleia) - new Date()) / (1000 * 60 * 60);
}

//as reservas fecham 30 minutos antes da viagem
function reservasAbertas(boleia) {
    return horasAteViagem(boleia) > 0.5;
}

//ordena por data e hora
function porData(a, b) {
    return momentoDaBoleia(a) - momentoDaBoleia(b);
}

//preço final por passageiro: com os passageiros que reservaram
function precoFinal(boleia) {
    if (boleia.gratuita) {
        return 0;
    }
    return precoPorPassageiro(kmDaBoleia(boleia), boleia.passageiros.length);
}

//nos últimos 30 min antes da viagem o passageiro paga para confirmar
function emPeriodoDePagamento(boleia) {
    const horas = horasAteViagem(boleia);
    return horas <= 0.5 && horas > 0;
}

//true se este passageiro já pagou
function pagou(boleia, email) {
    return boleia.gratuita || boleia.pagos.includes(email);
}


//                                              | janela de confirmação |

//abre o modal do Bootstrap que está no HTML da página
function confirmar(titulo, textoHTML, textoBotao, aoConfirmar) {
    document.getElementById("modalTitulo").textContent = titulo;
    document.getElementById("modalTexto").innerHTML = textoHTML;

    const botao = document.getElementById("modalConfirmar");
    botao.textContent = textoBotao;

    const janela = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalConfirmacao"));

    //se o aoConfirmar devolver false (falta preencher algo) a janela fica aberta
    botao.onclick = () => {
        if (aoConfirmar() === false) {
            return;
        }
        janela.hide();
    };

    janela.show();
}

//mostra uma notificação pequena no fundo do ecrã (toast do Bootstrap), que desaparece sozinha
function mostrarAviso(texto) {
    document.getElementById("avisoTexto").textContent = texto;
    bootstrap.Toast.getOrCreateInstance(document.getElementById("aviso"), { delay: 4000 }).show();
}


//                                              | reservas e cancelamentos |

//pede confirmação e reserva um lugar
function pedirReserva(boleia, email, depois) {
    const texto = boleia.gratuita
        ? "<p class=\"mb-0\">Esta boleia é gratuita. Não há nada a pagar.</p>"
        : `<p>Vamos cativar <strong>${formatarPreco(precoMaximo(boleia))}</strong> (o preço máximo por passageiro).</p>
           <p class="mb-0 small text-body-secondary">As reservas fecham 30 minutos antes da viagem. A partir daí pagas o preço final em "As minhas viagens" para confirmar o lugar. O valor fica retido e só é transferido para o condutor depois da viagem.</p>`;

    confirmar("Reservar lugar", texto, "Reservar", () => {
        boleia.passageiros.push(email);
        guardarTodas(lerBoleiasAtualizadas(boleia));
        mostrarAviso("Lugar reservado.");
        depois();
    });
}

//pede confirmação e cancela a reserva de um passageiro
function pedirCancelamentoReserva(boleia, email, depois) {
    const comReembolso = horasAteViagem(boleia) >= 24;

    let texto;
    if (boleia.gratuita) {
        texto = "<p class=\"mb-0\">Esta boleia é gratuita, por isso não há valores a devolver.</p>";
    } else if (comReembolso) {
        texto = "<p class=\"mb-0\">Faltam mais de 24 horas para a viagem: vais receber o <strong>reembolso total</strong>.</p>";
    } else {
        texto = "<div class=\"alert alert-warning mb-0\">Faltam menos de 24 horas para a viagem. Se cancelares, <strong>não há reembolso</strong>.</div>";
    }

    confirmar("Cancelar reserva", texto, "Cancelar reserva", () => {
        boleia.passageiros = boleia.passageiros.filter(e => e !== email);
        boleia.pagos = boleia.pagos.filter(e => e !== email);
        guardarTodas(lerBoleiasAtualizadas(boleia));
        mostrarAviso(boleia.gratuita || comReembolso ? "Reserva cancelada. Reembolso total." : "Reserva cancelada, sem reembolso.");
        depois();
    });
}

//pede confirmação e o condutor cancela a boleia: os passageiros recebem tudo de volta
function pedirCancelamentoBoleia(boleia, depois) {
    const n = boleia.passageiros.length;
    const texto = n === 0
        ? "<p class=\"mb-0\">Ainda ninguém reservou esta boleia.</p>"
        : `<p class="mb-0">${n === 1 ? "O passageiro vai" : `Os ${n} passageiros vão`} receber o <strong>reembolso total</strong>.</p>`;

    confirmar("Cancelar boleia", texto, "Cancelar boleia", () => {
        boleia.cancelada = true;
        guardarTodas(lerBoleiasAtualizadas(boleia));
        mostrarAviso("Boleia cancelada. Os passageiros foram reembolsados.");
        depois();
    });
}

//pede confirmação e o passageiro paga o preço final (simulado)
function pedirPagamento(boleia, email, depois) {
    const n = boleia.passageiros.length;
    const texto = `<p>Preço final: <strong>${formatarPreco(precoFinal(boleia))}</strong> (${n === 1 ? "1 passageiro" : `${n} passageiros`}).</p>
        <p class="mb-0 small text-body-secondary">O resto do valor cativado é libertado. Este valor fica retido e só é transferido para o condutor depois da viagem.</p>`;

    confirmar("Pagar e confirmar", texto, "Pagar", () => {
        boleia.pagos.push(email);
        guardarTodas(lerBoleiasAtualizadas(boleia));
        mostrarAviso("Pagamento feito. Lugar confirmado.");
        depois();
    });
}

//lê as boleias guardadas e substitui a que foi alterada
function lerBoleiasAtualizadas(alterada) {
    return lerBoleias().map(b => b.id === alterada.id ? alterada : b);
}


//                                              | avaliações e denúncias |

//lê as avaliações feitas no site ({ boleia, de, para, nota })
function lerAvaliacoes() {
    return JSON.parse(localStorage.getItem(CHAVE_AVALIACOES) ?? "[]");
}

//guarda uma avaliação nova
function guardarAvaliacao(avaliacao) {
    const avaliacoes = lerAvaliacoes();
    avaliacoes.push(avaliacao);
    localStorage.setItem(CHAVE_AVALIACOES, JSON.stringify(avaliacoes));
}

//todas as notas de uma pessoa: as da lista de utilizadores mais as dadas no site
function avaliacoesDe(email) {
    const conta = contaPorEmail(email);
    const iniciais = conta === undefined ? [] : conta.avaliacoes;
    const novas = lerAvaliacoes().filter(a => a.para === email).map(a => a.nota);
    return [...iniciais, ...novas];
}

//média das notas de uma pessoa (null se ainda não tem)
function mediaDe(email) {
    const notas = avaliacoesDe(email);
    if (notas.length === 0) {
        return null;
    }
    return notas.reduce((soma, nota) => soma + nota, 0) / notas.length;
}

//"★ 4,3" para mostrar ao lado do nome (vazio se não tiver avaliações)
function textoMedia(email) {
    const media = mediaDe(email);
    return media === null ? "" : `★ ${media.toFixed(1).replace(".", ",")}`;
}

//true se esta pessoa já avaliou aquela pessoa nesta boleia
function jaAvaliou(boleiaId, de, para) {
    return lerAvaliacoes().some(a => a.boleia === boleiaId && a.de === de && a.para === para);
}

//guarda uma denúncia (simulado: só fica no localStorage)
function guardarDenuncia(denuncia) {
    const denuncias = JSON.parse(localStorage.getItem(CHAVE_DENUNCIAS) ?? "[]");
    denuncias.push(denuncia);
    localStorage.setItem(CHAVE_DENUNCIAS, JSON.stringify(denuncias));
}
