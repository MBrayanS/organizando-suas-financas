import ControleDeTransacoes from "./ControleDeTransacoes.js"
import ControleDeDados from "./ControleDeDados.js"
import renderizarHTML from "./renderizarHTML.js"

const controleDeDados = ControleDeDados()
const controleDeTransacoes = ControleDeTransacoes(controleDeDados)

renderizarHTML(controleDeTransacoes)