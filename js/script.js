
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");
const tituloResultado = document.getElementById("tituloResultado");
const resumoResultado = document.getElementById("resumoResultado");
const perfisResultado = document.getElementById("perfisResultado");
const campoNascimento = document.getElementById("nascimento");
const botaoRefazer = document.getElementById("refazer");

// Array de objetos com os perfis disponíveis
const perfis = [
    {
        id: 1,
        nome: "Engenheiro de Sistemas",
        categoria: "Construção",
        descricao: "Você gosta de resolver problemas, construir ferramentas e encontrar soluções práticas.",
        imagem: "perfil-1.jpg"
    },
    {
        id: 2,
        nome: "Cientista Explorador",
        categoria: "Investigação",
        descricao: "Você é curioso, gosta de analisar informações e descobrir como as coisas funcionam.",
        imagem: "perfil-2.jpg"
    },
    {
        id: 3,
        nome: "Explorador de Campo",
        categoria: "Exploração",
        descricao: "Você gosta de descobrir lugares, experimentar alternativas e enfrentar desafios novos.",
        imagem: "perfil-3.jpg"
    },
    {
        id: 4,
        nome: "Estrategista da Missão",
        categoria: "Planejamento",
        descricao: "Você gosta de organizar informações, coordenar pessoas e planejar decisões.",
        imagem: "perfil-4.jpg"
    }
];

// Impede a seleção de datas futuras pelo calendário
const hoje = new Date();
const anoAtual = hoje.getFullYear();
const mesAtual = String(hoje.getMonth() + 1).padStart(2, "0");
const diaAtual = String(hoje.getDate()).padStart(2, "0");

campoNascimento.max = `${anoAtual}-${mesAtual}-${diaAtual}`;

// Calcula a idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
    const partes = dataNascimento.split("-");

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    let idade = anoAtual - ano;

    // Verifica se a pessoa já fez aniversário neste ano
    if (
        mes > hoje.getMonth() + 1 ||
        (mes === hoje.getMonth() + 1 && dia > hoje.getDate())
    ) {
        idade--;
    }

    return idade;
}

// Executa o programa quando o formulário é enviado
formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const dataNascimento = campoNascimento.value;

    // Validação dos dados
    if (nome === "" || dataNascimento === "") {
        alert("Preencha todos os campos.");
        return;
    }

    const dataInformada = new Date(
        Number(dataNascimento.split("-")[0]),
        Number(dataNascimento.split("-")[1]) - 1,
        Number(dataNascimento.split("-")[2])
    );

    const dataHoje = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
    );

    if (dataInformada > dataHoje) {
        campoNascimento.setCustomValidity(
            "A data de nascimento não pode ser futura."
        );
        campoNascimento.reportValidity();
        return;
    }

    campoNascimento.setCustomValidity("");

    const idade = calcularIdade(dataNascimento);

    // Cria uma pontuação inicial para cada perfil
    const pontuacoes = {};

    perfis.forEach(function(perfil) {
        pontuacoes[perfil.id] = 0;
    });

    // Lê as respostas e soma os pontos
    const respostas = new FormData(formulario);

    for (let i = 1; i <= 4; i++) {
        const resposta = Number(respostas.get(`pergunta${i}`));

        pontuacoes[resposta]++;
    }

    // Descobre a maior pontuação
    const maiorPontuacao = Math.max(
        ...Object.values(pontuacoes)
    );

    // Localiza todos os perfis que alcançaram a maior pontuação
    const vencedores = perfis.filter(function(perfil) {
        return pontuacoes[perfil.id] === maiorPontuacao;
    });

    // Prepara a tela de resultado
    if (vencedores.length === 1) {
        tituloResultado.textContent =
            `${nome}, seu perfil é:`;
    } else {
        tituloResultado.textContent =
            `${nome}, você tem um perfil múltiplo!`;
    }

    resumoResultado.textContent =
        `Você tem ${idade} anos e obteve ${maiorPontuacao} ponto(s) ` +
        `no(s) perfil(is) em destaque.`;

    // Limpa resultados anteriores
    perfisResultado.replaceChildren();

    
 // Cria um cartão para cada perfil vencedor
vencedores.forEach(function(perfil) {
    const cartao = document.createElement("article");
    cartao.classList.add("cartao-perfil");

    // Imagem do perfil
    const imagem = document.createElement("img");
    imagem.src = `img/${perfil.imagem}`;
    imagem.alt = perfil.nome;
    imagem.classList.add("imagem-perfil");

    const nomePerfil = document.createElement("h3");
    nomePerfil.textContent = perfil.nome;

    const categoria = document.createElement("p");
    categoria.classList.add("categoria");
    categoria.textContent = perfil.categoria;

    const descricao = document.createElement("p");
    descricao.textContent = perfil.descricao;

    const pontuacao = document.createElement("p");
    pontuacao.classList.add("pontuacao");
    pontuacao.textContent =
        `Pontuação: ${pontuacoes[perfil.id]} ponto(s)`;

    // Adiciona os elementos ao cartão na ordem desejada
    cartao.append(
        imagem,
        nomePerfil,
        categoria,
        descricao,
        pontuacao
    );

    perfisResultado.appendChild(cartao);
});


    // Exibe o resultado e oculta o formulário
    formulario.closest(".painel").hidden = true;
    resultado.hidden = false;

    resultado.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Permite fazer o teste novamente
botaoRefazer.addEventListener("click", function() {
    formulario.reset();

    resultado.hidden = true;
    formulario.closest(".painel").hidden = false;

    perfisResultado.replaceChildren();
    campoNascimento.setCustomValidity("");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Remove a mensagem de erro quando a data é alterada
campoNascimento.addEventListener("input", function() {
    campoNascimento.setCustomValidity("");
});
