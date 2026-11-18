//                                              | login.js |

//consts que guardam o campo da palavra-passe e ao botão do olho
const campoPwd = document.getElementById("pwd");
const botaoOlho = document.getElementById("mostrarPwd");
const icone = document.getElementById("iconeOlho");

//consts que guardam o formulário, a check de guardar a sessão e a div do erro
const formLogin = document.getElementById("formLogin");
const lembrar = document.getElementById("lembrar");
const erroLogin = document.getElementById("erroLogin");


//mostra ou esconde a palavra-passe e troca o ícone do olho
function mostrarPwd() {
    if (campoPwd.type === "password") {
        //estava escondida: mostra
        campoPwd.type = "text";
        icone.classList.replace("bi-eye", "bi-eye-slash");
        botaoOlho.setAttribute("aria-label", "Esconder palavra-passe");
    } else {
        //estava visível: esconde
        campoPwd.type = "password";
        icone.classList.replace("bi-eye-slash", "bi-eye");
        botaoOlho.setAttribute("aria-label", "Mostrar palavra-passe");
    }
}

//verifica o email e a palavra-passe e, se estiverem certos, inicia a sessão
function login(e) {
    //impede que a submissão do formulário recarregue a página
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("pwd").value;

    //vê como é a password em hash
    const hashPwd = CryptoJS.SHA256(password).toString();

    //procura uma conta com este email E este hash
    const utilizador = utilizadores.find(u => u.email === email && u.hashPwd === hashPwd);

    //mostra o erro
    if (utilizador === undefined) {
        erroLogin.textContent = "Email ou palavra-passe incorretos.";
        erroLogin.classList.remove("d-none");
        return;
    }

    //com "manter sessão" fica no localStorage senão no sessionStorage
    if (lembrar.checked) {
        localStorage.setItem(CHAVE_SESSAO, utilizador.email);
    } else {
        sessionStorage.setItem(CHAVE_SESSAO, utilizador.email);
    }

    //vai para a página inicial
    window.location.href = "../index.html";
}

//quando carregarem no olho, alterna
botaoOlho.addEventListener("click", mostrarPwd);

//quando o formulário for submetido, tenta fazer login
formLogin.addEventListener("submit", login);
