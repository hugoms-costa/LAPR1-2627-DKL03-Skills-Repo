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

//nome da chave onde fica o email de quem fez login (o "post-it" da sessão)
const CHAVE_SESSAO = "utilizador";

//lê as boleias guardadas no localStorage
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

//dá overwrite da lista toda das boleias no localStorage
function guardarTodas(lista) {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
}
