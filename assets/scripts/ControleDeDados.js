export function ControleDeDados() {
    const haDados = key => key in localStorage
    const pegarDados = key => JSON.parse(localStorage.getItem(key))
    
    function salvarDados( key, dados ) { localStorage.setItem(key, JSON.stringify(dados)) }

    return {
        haDados,
        salvarDados,
        pegarDados,
    }
}