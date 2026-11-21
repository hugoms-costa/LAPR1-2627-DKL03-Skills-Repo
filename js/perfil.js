//                                              | perfil.js |

//conta de quem está ligado
const conta = utilizadorAtual();

//se não tiver ninguém logged in, redireciona para a pág de logins
if (conta === null) {
    window.location.href = "Login.html";
} else {
    mostrarPerfil(conta);
    document.getElementById("terminarSessao").addEventListener("click", terminarSessao);
}

//escreve os dados da conta nos sítios certos da página
function mostrarPerfil(conta) {

    document.getElementById("perfilIniciais").textContent = conta.nome[0] + conta.apelido[0];
    document.getElementById("perfilNome").textContent = `${conta.nome} ${conta.apelido}`;
    document.getElementById("perfilCurso").textContent = conta.curso;

    document.getElementById("dadoNome").textContent = `${conta.nome} ${conta.apelido}`;
    document.getElementById("dadoCurso").textContent = conta.curso;
    document.getElementById("dadoEmail").textContent = conta.email;

    mostrarAvaliacoes(conta.avaliacoes);
}

//mostra a média das avaliações, as estrelas e quantas avaliações há
function mostrarAvaliacoes(avaliacoes) {
    const valor = document.getElementById("mediaValor");
    const escala = document.getElementById("mediaEscala");
    const estrelas = document.getElementById("mediaEstrelas");
    const total = document.getElementById("mediaTotal");

    //sem avaliações não há média
    if (avaliacoes.length === 0) {
        valor.textContent = "Ainda sem avaliações";
        escala.textContent = "";
        estrelas.textContent = "";
        total.textContent = "Vais ser avaliado depois da tua primeira viagem.";
        return;
    }

    //calcula a média das avaliações
    let soma = 0;
    for (let i = 0; i < avaliacoes.length; i++) {
        soma += avaliacoes[i];
    }
    const media = soma / avaliacoes.length;

    //média com uma casa decimal e vírgula
    valor.textContent = media.toFixed(1).replace(".", ",");

    //a média em estrelas cheias, o resto até 5 em vazias
    const cheias = Math.round(media);
    estrelas.textContent = "★".repeat(cheias) + "☆".repeat(5 - cheias);

    //quantas avaliações
    total.textContent = avaliacoes.length === 1
        ? "Com base em 1 avaliação de outros utilizadores."
        : `Com base em ${avaliacoes.length} avaliações de outros utilizadores.`;
}

//apaga o user do localStorage ou do sessionStorage
function terminarSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
    sessionStorage.removeItem(CHAVE_SESSAO);
    window.location.href = "../index.html";
}
