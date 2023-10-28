import { ConstrutorDeCards, pegarData, tratarValor } from "./ConstrutorDeCards.js"

const valorSaldoDOM = document.getElementById('valorSaldo')
const valorReceitaDOM = document.getElementById('valorReceita')
const valorDespesaDOM = document.getElementById('valorDespesa')
const historicoDeTransacoesDOM = document.getElementById('historicoDeTransacoes')
const fundoDoModalDOM = document.querySelector('.fundo') 
const formularioDeTransacaoDOM = document.querySelector('form')
const botaoQueAbreOModalParaAdicionarTransacaolDOM = document.getElementById('abrirModal')
const botaoQueFechaOModalDOM = document.getElementById('fecharModal')
const botaoQueAdicionaUmNovaTransacaoDOM = document.getElementById('botaoDeAdicionarTransacao')
const botaoQueEditaATransacaoDOM = document.getElementById('botaoDeEditarTransacao')

function renderizarHTML( controleDeTransacoes ) {
    const funcoesInternasDosCards = {
        abrirOFormularioParaEditarTransacao,
        confirmarApagarTransacao,
        atualizarDataJsDoFormulario
    }

    const construtorDeCards = ConstrutorDeCards( funcoesInternasDosCards )

    atualizarDOM()
    
    function atualizarDOM() {
        atualizarHeader()
        carregarCardsDeTransacoes()
    }
    
    function atualizarHeader() {
        const totalReceita = controleDeTransacoes.pegarTotalDeReceita()
        const totalDespesa = controleDeTransacoes.pegarTotalDeDespesa()
        const saldo = prepararSaldo()
        
        valorSaldoDOM.textContent = tratarValor(saldo)
        valorReceitaDOM.textContent = tratarValor(totalReceita)
        valorDespesaDOM.textContent = tratarValor(totalDespesa)
    }

    function prepararSaldo() {
        const valorDoSaldo = controleDeTransacoes.pegarSaldo()
        
        atribuirClassAoSaldo(valorDoSaldo)

        return Math.abs(valorDoSaldo)
    }

    function atribuirClassAoSaldo( valorDoSaldo ) {
        let classDoSaldo = ''
        
        if( valorDoSaldo < 0 ) classDoSaldo = 'saldo--negativo'
        if( valorDoSaldo > 0 ) classDoSaldo = 'saldo--positivo'
        
        valorSaldoDOM.className = classDoSaldo
    }
    
    function carregarCardsDeTransacoes() {
        const fragmentosDOM = document.createDocumentFragment()
        const listaDeTransacoes = controleDeTransacoes.pegarListaDeTransacoes()
        
        listaDeTransacoes.forEach( dadosDaTransacao => {
            const novoCard = construtorDeCards.criarNovoCardDeTransacao(dadosDaTransacao)
            
            fragmentosDOM.append(novoCard)
        })
        
        historicoDeTransacoesDOM.innerHTML = ''
        historicoDeTransacoesDOM.append(fragmentosDOM)
    }
    
    function mostrarOuOcultarModal() { fundoDoModalDOM.classList.toggle('fundo--visivel') }
    
    botaoQueAbreOModalParaAdicionarTransacaolDOM.addEventListener('click', abrirOFormularioParaAdicinarTransacao)

    function abrirOFormularioParaAdicinarTransacao() {
        mostrarOuOcultarModal()
        
        botaoQueAdicionaUmNovaTransacaoDOM.classList.add('modal__submit--visivel')
        botaoQueAdicionaUmNovaTransacaoDOM.focus()
    }
    
    function abrirOFormularioParaEditarTransacao() {
        botaoQueEditaATransacaoDOM.classList.add('modal__submit--visivel')
        botaoQueEditaATransacaoDOM.focus()
        
        mostrarOuOcultarModal()
        carregarDadosDaTransacao()
    }
    
    function carregarDadosDaTransacao() {
        const idDaTransacao = formularioDeTransacaoDOM['data-id-da-transacao']
        const transacao = controleDeTransacoes.pegarTransacaoPorId(idDaTransacao)
        
        inserirDadosNoFormulario(transacao)
    }
    
    function inserirDadosNoFormulario(transacao) {
        const [ valorDOM, descricaoDOM, tipoReceitaDOM, tipoDespesaDOM ] = formularioDeTransacaoDOM.querySelectorAll('input')

        valorDOM.value = transacao.valor
        descricaoDOM.value = transacao.descricao
        tipoReceitaDOM.checked = transacao.tipo == 'receita'
        tipoDespesaDOM.checked = transacao.tipo == 'despesa'
    }

    const funcoesDeEnvioAceitas = {
        botaoDeAdicionarTransacao: () => adicionarNovaTransacao(),
        botaoDeEditarTransacao: () => editarTransacao()
    }
    
    formularioDeTransacaoDOM.addEventListener('submit', eventoDeEnvioDoFormulario)
    
    function eventoDeEnvioDoFormulario( evento ){
        const botaoDeEnvio = formularioDeTransacaoDOM.querySelector('button.modal__submit--visivel').id
        const funcaoDeEnvio = funcoesDeEnvioAceitas[botaoDeEnvio]
        
        if(funcaoDeEnvio) funcaoDeEnvio()
        
        encerrarFormulario()
        evento.preventDefault()
    }

    function extrairDadosDoFormulario() {
        const [ valorDOM, descricaoDOM, tipoReceitaDOM ] = formularioDeTransacaoDOM.querySelectorAll('input')
        const aTransacaoEDoTipoReceita = tipoReceitaDOM.checked
    
        const dados = {
            valor: Number(valorDOM.value),
            descricao: descricaoDOM.value,
            tipo: aTransacaoEDoTipoReceita ? 'receita' : 'despesa',
            ...pegarData()
        }
    
        return dados
    }
    
    botaoQueFechaOModalDOM.addEventListener('click', encerrarFormulario)
    
    function encerrarFormulario() {
        formularioDeTransacaoDOM.reset()
        
        limparClassDosBotoesDoFormulario()
        mostrarOuOcultarModal()
    }

    function limparClassDosBotoesDoFormulario() {
        formularioDeTransacaoDOM.querySelectorAll('button')
            .forEach( btn => btn.classList.remove('modal__submit--visivel') )
    }
    
    function adicionarNovaTransacao() {
        const dadosDoFormulario = extrairDadosDoFormulario()
        
        controleDeTransacoes.adicionarNovaTransacao(dadosDoFormulario)
        atualizarDOM()
    }
    
    function editarTransacao() {
        const transacaoEditada = extrairDadosDoFormulario()
        transacaoEditada.id = formularioDeTransacaoDOM['data-id-da-transacao']
        
        controleDeTransacoes.editarTransacao(transacaoEditada)
        atualizarDOM()
    }
    
    function confirmarApagarTransacao( idDaTransacao ) {
        const confirmado = confirm('Você relmente deseja apagar esta transação?\n\n Isto não podera ser desfeito!')
            
        if(confirmado) apagarTransacao(idDaTransacao) 
    }
    
    function apagarTransacao( idDaTransacao) {
        controleDeTransacoes.removerTransacaoPorId(idDaTransacao)
        atualizarDOM()
    }

    function atualizarDataJsDoFormulario( idDaTransacao ) { formularioDeTransacaoDOM['data-id-da-transacao'] = idDaTransacao }
}

export default renderizarHTML