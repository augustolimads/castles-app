import * as Market from "@/modules/market/ui"

function Mercado() {
  return (
    <div>
      <Market.Header />
      <div className="flex justify-between">
        <span>categorias</span>
        <span>filtros</span>
        <span>ordenação</span>
        <span>visualização: galeria, tabela</span>
      </div>

      <Market.Grid />
    </div>
  )
}

export default Mercado