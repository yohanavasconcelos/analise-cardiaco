// Seletores de elementos: Usando IDs para maior especificidade
let cardContainer = document.querySelector("#card-container");
let campoBusca = document.querySelector("header input");
let conteudoCentral = document.querySelector('.conteudo-central'); // Novo: Container que gerencia o layout
let coracao = document.getElementById('coracao-pulsante'); // Novo: Elemento do coração

let dados = []; // Armazenará os dados do JSON

// Função principal de busca e transição de layout
async function iniciarBusca() {

    // 1. Carregamento dos dados
    // Se os dados ainda não foram carregados, busca do JSON.
    if (dados.length === 0) {
        try {
            // CORREÇÃO: Usando 'doencas.json'
            let resposta = await fetch("doencas.json");
            dados = await resposta.json();
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            cardContainer.innerHTML = `<p class="erro-busca">Falha ao carregar a base de dados. Verifique se o arquivo 'doencas.json' existe.</p>`;
            return; // Interrompe a execução se houver erro
        }
    }

    // 2. Transição de Layout (Mover Coração e Mostrar Cards)
    // Aplica as classes que movem o coração para a direita e preparam o grid
    conteudoCentral.classList.add('conteudo-pesquisa');
    coracao.classList.remove('coracao-inicio');
    coracao.classList.add('coracao-pesquisa');
    cardContainer.classList.add('mostra-cards');

    // 3. Lógica de Filtragem
    const termoBusca = campoBusca.value.toLowerCase().trim();

    const dadosFiltrados = dados.filter(dado =>
        // Busca pelo nome
        dado.nome.toLowerCase().includes(termoBusca) ||
        // Busca pela descrição
        dado.descricao.toLowerCase().includes(termoBusca) ||
        // NOVO: Busca dentro do array de tags
        dado.tags.some(tag => tag.toLowerCase().includes(termoBusca))
    );

    // 4. Renderização
    renderizarCards(dadosFiltrados, termoBusca);
}

// Função para criar e exibir os cards
function renderizarCards(dados, termoBusca) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes

    // Se não houver resultados
    if (dados.length === 0) {
        cardContainer.innerHTML = `<p class="nenhum-resultado">Nenhum resultado encontrado para **${termoBusca}**. Tente pesquisar por uma tag ou nome diferente.</p>`;
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");

        // Gera o HTML das tags
        const tagsHtml = dado.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');


        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <p><strong>Primeira Descrição:</strong> ${dado.ano}</p>
            <p>${dado.descricao}</p>
            <p class="tags-lista">${tagsHtml}</p>
            <a href="${dado.link}" target="_blank">Saiba mais</a>
        `;
        cardContainer.appendChild(article);
    }
    
}