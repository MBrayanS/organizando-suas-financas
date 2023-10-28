function ControleDeTransacoes( controleDeDados ) {
    const CHAVE_DO_LOCALSTORAGE = 'listaDeTransacoes'

    let listaDeTransacoes = carregarDadosLocal() || []
    let totalDeDespesa = 0
    let totalDeReceita = 0
    let saldo = 0

    atualizarSaldo()
    
    const pegarListaDeTransacoes = () => listaDeTransacoes
    const pegarTransacaoPorId = idDaTransacao => listaDeTransacoes.find(({ id }) => id === idDaTransacao)
    const pegarTotalDeDespesa = () => totalDeDespesa
    const pegarTotalDeReceita = () => totalDeReceita
    const pegarSaldo = () => saldo

    function carregarDadosLocal() {
        return controleDeDados.pegarDados(CHAVE_DO_LOCALSTORAGE)
    }

    function salvarDados(){
        controleDeDados.salvarDados(CHAVE_DO_LOCALSTORAGE  , listaDeTransacoes)
    }

    function adicionarNovaTransacao( dados ) {
        const transacaoValida = validarTransacao( dados )
        
        if( transacaoValida ) {
            const novaTransacao = {
                id: gerarId(),
                ...dados
            }

            listaDeTransacoes.push(novaTransacao)
    
            atualizarSaldo()
            salvarDados()
        }
    }

    function validarTransacao( dados ) {
        const { valor, descricao, tipo } = dados

        const valorValido = typeof valor == 'number'
        const descricaoValida = typeof descricao == 'string'
        const tipoValido = tipo == 'receita' || tipo == 'despesa'

        const dadosValidos = valorValido && descricaoValida && tipoValido

        if( dadosValidos ) return true
        else console.error('Dados invalidos!'); console.table({valorValido, descricaoValida, tipoValido})
    }

    function editarTransacao( transacaoEditada ) {

        listaDeTransacoes = listaDeTransacoes.map(
            transacao => transacao.id === transacaoEditada.id ? transacaoEditada : transacao
        )

        atualizarSaldo()
        salvarDados()
    }

    function atualizarSaldo() {
        totalDeReceita = 0
        totalDeDespesa = 0
    
        listaDeTransacoes.forEach( ({ valor, tipo }) => {
            if(tipo == 'despesa') totalDeDespesa += valor
            else totalDeReceita += valor
        })

        saldo = totalDeReceita - totalDeDespesa
    }
    
    function removerTransacaoPorId( idASerRemovido ){
        listaDeTransacoes = listaDeTransacoes.filter( ({ id }) => id !== idASerRemovido)
    
        atualizarSaldo()
        salvarDados()
    }
    
    function gerarId() {
        const novoId = gerarNumeroAleatorio(0,20) + listaDeTransacoes.length
        const idJaExiste = !!pegarTransacaoPorId(novoId)
    
        return idJaExiste ? gerarId() : novoId
    }
    
    function gerarNumeroAleatorio( max, min ) {
        return Math.floor(Math.random() * (max - min)) + min
    }
    
    return {
        pegarListaDeTransacoes,
        pegarTotalDeDespesa,
        pegarTotalDeReceita,
        pegarSaldo,
        adicionarNovaTransacao,
        editarTransacao,
        removerTransacaoPorId,
        pegarTransacaoPorId
    }
}

export default ControleDeTransacoes