//                                              | darBoleias.js |

//const que guarda o form
const form = document.getElementById("formBoleia");

//função que vai ler os campos e criar uma boleia nova
function publicar(evento){
    //não deixa fazer F5
    evento.preventDefault();
    
    //vai buscar os dados ao evento
    const nome = document.getElementById("nome").value;
    const apelido = document.getElementById("apelido").value;
    const origem = document.getElementById("origem").value;
    const hora = document.getElementById("hora").value;
    const lugares = Number(document.getElementById("lugares").value);
    const preco = Number(document.getElementById("preco").value);

    //cria um objeto novo novaBoleia    
    const novaBoleia = {
        condutor: `${nome} ${apelido}`,
        iniciais: nome[0].toUpperCase() + apelido[0].toUpperCase(),
        origem: origem,
        hora: hora,
        lugares: lugares,
        preco: preco
    };

    //chama a função de guardarBoleia do script.js
    guardarBoleia(novaBoleia);

    //redireciona para a página das boleias
    window.location.href = "Boleias.html";
}

form.addEventListener("submit", publicar);
