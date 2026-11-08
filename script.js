//                                              | BOLEIAS.html |

//criação de um array estático de boleias
const boleias = [
    { condutor: "Tiago", iniciais: "TS", origem: "Gaia",       hora: "08:00", lugares: 3, preco: 2.5 },
    { condutor: "Ana",   iniciais: "AM", origem: "Maia",       hora: "08:30", lugares: 1, preco: 2.0 },
    { condutor: "Rui",   iniciais: "RC", origem: "Gondomar",   hora: "09:00", lugares: 0, preco: 1.5 },
    { condutor: "Inês",  iniciais: "IF", origem: "Matosinhos", hora: "08:15", lugares: 2, preco: 2.0 },
    { condutor: "José",   iniciais: "JL", origem: "Braga",   hora: "07:30", lugares: 3, preco: 4.5 }
];

//const que guarda a div onde se vão colocar os cards
const cards = document.getElementById("resultados");

//const que guarda a div da pesquisa
const pesquisa = document.getElementById("pesquisa");

//const que vê que boleias é que estão disponíveis
const disponiveis = boleias.filter(b => b.lugares > 0);

//função para mostrar um card para cada elemento da lista
function mostrar(lista) {
    if (lista.length === 0){
        cards.innerHTML = "<p><b>Não há boleias disponíveis</b></p>";
        return;
    }

    cards.innerHTML = lista.map(b => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${b.condutor}</h5>
                <p class="card-text">${b.origem} → ISEP · ${b.hora}</p>
                <p class="card-text">${b.lugares === 1 ? b.lugares + " lugar" : b.lugares + " lugares"} · ${b.preco.toFixed(2)}€</p>
            </div>
        </div>
    `).join(""); //inicialmente não coloquei isto, pedi ajuda ao claude pq entre os cards apareciam ",". O .join("") junta os cards numa string só
    }

//função para filtrar os cards de acordo com a pesquisa
function pesquisar() {
    const pesquisaLow = pesquisa.value.toLowerCase();
    const resultado = disponiveis.filter(b => b.origem.toLowerCase().includes(pesquisaLow));
    mostrar(resultado);
}

//usa a função no nosso array das boleias disponíveis
mostrar(disponiveis);

//quando o "input"(Barra de pesquisa) é alterado, ativa a função pesquisar e filtra
pesquisa.addEventListener("input", pesquisar)