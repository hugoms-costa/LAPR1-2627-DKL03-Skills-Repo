//                                              | darBoleias.js |

//const que guarda o form
const form = document.getElementById("formBoleia");

const switchGratuita = document.getElementById("gratuita");
const campoPreco = document.getElementById("preco")

//função que vai ler os campos e criar uma boleia nova
function publicar(evento){
    //não deixa fazer F5
    evento.preventDefault();
    
    //vai buscar os dados ao evento
    const id = crypto.randomUUID(); //Gera um UUID aleatório (sugerido pelo claude)
    const nome = document.getElementById("nome").value;
    const apelido = document.getElementById("apelido").value;
    const origem = document.getElementById("origem").value;
    const hora = document.getElementById("hora").value;
    const lugares = Number(document.getElementById("lugares").value);
    const preco = switchGratuita.checked ? 0 : Number(campoPreco.value);
    
    //cria um objeto novo novaBoleia
    const novaBoleia = {
        id: id,
        condutor: `${nome} ${apelido}`,
        iniciais: nome[0].toUpperCase() + apelido[0].toUpperCase(),
        origem: origem,
        hora: hora,
        lugares: lugares,
        preco: preco,
        agendada: false
    };

    //chama a função de guardarBoleia do script.js
    guardarBoleia(novaBoleia);

    //redireciona para a página das boleias
    window.location.href = "Boleias.html";
}

function tornarGratuito(){
    campoPreco.disabled = switchGratuita.checked;
    if (switchGratuita.checked) {
        campoPreco.value = "";
    }
}

form.addEventListener("submit", publicar);
switchGratuita.addEventListener("change", tornarGratuito);
