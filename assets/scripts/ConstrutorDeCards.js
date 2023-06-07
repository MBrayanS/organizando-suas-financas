export function ConstrutorDeCards( funcoesInternasDosCards ) {
    const {
        abrirOFormularioParaEditarTransacao,
        confirmarApagarTransacao,
        atualizarDataJsDoFormulario,
    } = funcoesInternasDosCards
    
    function criarNovoCardDeTransacao({ id, descricao, data, hora, tipo, valor }) {
        const card = document.createElement('div')
        const cardDescricao = criarElementoDOMCardDescricao(descricao, data, hora)
        const cardValor = criarElementoDOMCardValor(valor, tipo)
        const cardConteudoEscondido = criarElementoDOMCardConteudoEscondido(id)
        
        card.classList.add('card')
        card.append(cardDescricao, cardValor, cardConteudoEscondido)
        
        return card
    }
    
    function criarElementoDOMCardDescricao( descricao, data, hora ) {
        const cardDescricao = document.createElement('div')
        const p = document.createElement('p')
        const span = document.createElement('span')
        
        p.textContent = descricao
        span.textContent = `${hora} - ${data}`
        cardDescricao.classList.add('descricao')
        cardDescricao.append(p, span)
        
        return cardDescricao
    }
    
    function criarElementoDOMCardValor( valor, tipo ) {
        const cardValor = document.createElement('div')
        const h2 = document.createElement('h2')
        
        h2.textContent = tratarValor(valor)
        
        cardValor.classList.add('card__valor')
        cardValor.classList.add(`valor--${tipo}`)
        cardValor.appendChild(h2)
        
        return cardValor
    }
    
    function criarElementoDOMCardConteudoEscondido( id ) {
        const cardConteudoEscondido = document.createElement('div')
        const cardEditar = criarElementoDOMCardEditar(id)
        const cardApagar = criarElementoDOMCardApagar(id)
        
        cardConteudoEscondido.classList.add('conteudo-escondido')
        cardConteudoEscondido.append(cardEditar, cardApagar)
        
        return cardConteudoEscondido
    }
    
    function criarElementoDOMCardEditar( idDaTransacao ) {
        const cardEditar = document.createElement('div')
        const editarImg = document.createElement('img')
        
        editarImg.src = "../assets/img/lapis.png"
        editarImg.alt = 'Lapis'
        
        cardEditar.classList.add('editar')
        cardEditar.appendChild(editarImg)
        cardEditar.addEventListener('click', () => {
            atualizarDataJsDoFormulario( idDaTransacao )
            abrirOFormularioParaEditarTransacao()
        })
        
        return cardEditar
    }
    
    function criarElementoDOMCardApagar( idDaTransacao ) {
        const cardApagar = document.createElement('div')
        const btn = document.createElement('button')
        
        cardApagar.classList.add('apagar')
        cardApagar.append(btn)
        cardApagar.addEventListener('click', () => {
            confirmarApagarTransacao(idDaTransacao)
        })
        
        return cardApagar
    }
    
    return {
        criarNovoCardDeTransacao
    }
}

export function tratarValor( valor ) { return `$ ${valor.toFixed(2)}` }

export function pegarData() {
    const date = new Date()

    return {
        data: date.toLocaleDateString(),
        hora: date.toLocaleTimeString().slice(0,5)
    }
}