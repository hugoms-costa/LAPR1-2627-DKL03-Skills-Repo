//                                              | boleias.js |

//criação de um array estático de boleias
const boleias = [
    { id: "1", condutor: "Tiago", iniciais: "TS", origem: "Gaia",       hora: "08:00", lugares: 3, preco: 2.5, agendada: false},
    { id: "2", condutor: "Ana",   iniciais: "AM", origem: "Maia",       hora: "08:30", lugares: 1, preco: 2.0, agendada: false },
    { id: "3", condutor: "Rui",   iniciais: "RC", origem: "Gondomar",   hora: "09:00", lugares: 0, preco: 1.5, agendada: false },
    { id: "4", condutor: "Inês",  iniciais: "IF", origem: "Matosinhos", hora: "08:15", lugares: 2, preco: 2.0, agendada: false },
    { id: "5", condutor: "José",   iniciais: "JL", origem: "Braga",   hora: "07:30", lugares: 3, preco: 4.5, agendada: false }
];

//ao abrir, guarda as boleias de exemplo no localStorage
if (localStorage.getItem(CHAVE) === null) guardarTodas(boleias);

//mostra todas as boleias, lidas do localStorage
const todas = lerBoleias();

//const que guarda a div onde se vão colocar os cards
const cards = document.getElementById("resultados");

//const que guarda a div da pesquisa
const pesquisa = document.getElementById("pesquisa");

//const que vê que boleias é que estão disponíveis
const disponiveis = todas.filter(b => b.lugares > 0 || b.agendada);

//função para mostrar um card para cada elemento da lista
function mostrar(lista) {
    if (lista.length === 0){
        cards.innerHTML = "<p><b>Não há boleias disponíveis</b></p>";
        return;
    }

    cards.innerHTML = lista.map(b => `
        <div class="card mb-3 ${b.agendada ? "border-success" : ""}">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title">${b.condutor}</h5>
                    <p class="card-text">${b.origem} → ISEP · ${b.hora}</p>
                    <p class="card-text">${b.lugares === 1 ? b.lugares + " lugar" : b.lugares + " lugares"} · ${b.preco === 0.00 ? "Gratuito" : b.preco.toFixed(2) + "€"}</p>
                </div>
                <div>
                    <button type="button" onclick="reservar('${b.id}')" class="btn btn-${!b.agendada ? "secondary" : "danger"}">${!b.agendada ? "Agendar" : "Cancelar"}</button>
                </div>
            </div>
        </div>
    `).join(""); //inicialmente não coloquei isto, pedi ajuda ao claude pq entre os cards apareciam ",". O .join("") junta os cards numa string só
    }

function reservar(id){
    const boleia = todas.find(b => b.id == id)
    if (boleia.agendada) {
        //já estava agendada, devolve o lugar
        boleia.agendada = false;
        boleia.lugares++;
    } 
    else {
        //não estava agendada e ocupa um lugar
        boleia.agendada = true;
        boleia.lugares--;
    }
    guardarTodas(todas);
    pesquisar();
}

//função para filtrar os cards de acordo com a pesquisa
function pesquisar() {
    const pesquisaLow = pesquisa.value.toLowerCase();
    const resultado = disponiveis.filter(b => b.origem.toLowerCase().includes(pesquisaLow));
    mostrar(resultado);
}

//usa a função no nosso array das boleias disponíveis
mostrar(disponiveis);

//Coloca as boleias todas quando a página é aberta pela primera vez
pesquisar();

//quando o "input" (barra de pesquisa) é alterado, ativa a função pesquisar e filtra
pesquisa.addEventListener("input", pesquisar);

//Quando o "submit" (cards) é pressionado chama a função que reserva a boleia
cards.addEventListener("submit", reservar);