//                                              | script.js |

//nome da chave usada no localStorage
const CHAVE = "boleias";

//lê as boleias publicadas
function lerBoleias() {
    const texto = localStorage.getItem(CHAVE);

    //se ainda não há nada guardado, devolve uma lista vazia
    if (texto === null) {
        return [];
    }

    //converte o texto JSON de volta para array
    return JSON.parse(texto);
}

//acrescenta uma boleia às publicadas
function guardarBoleia(boleia) {
    const guardadas = lerBoleias(); 
    guardadas.push(boleia); //adiciona a boleia nova
    localStorage.setItem(CHAVE, JSON.stringify(guardadas)); //guarda no localStorage em JSON
}