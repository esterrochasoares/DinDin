import "../css/summary.css";
import formatCurrency from "../utils/currency";

function Summary({ totalIn, totalOut }) {
  return (
    <div class="summary">
      <div class="label title">Resumo</div>
      <div class="label subtitle row">
        <div>Entradas</div>
        <div style={{color: '#645FFB'}}>{formatCurrency(totalIn)}</div>
      </div>
      <div class="label subtitle row">
        <div>Saídas</div>
        <div style={{color: '#FA8C10'}}>{formatCurrency(totalOut)}</div>
      </div>
      <hr style={{ backgroundColor: "#FAFAFA", width: "100%" }} />
      <div class="label title row">
        <div>Saldo</div>
        <div style={{color: '#3A9FF1'}}>{formatCurrency(totalIn - totalOut)}</div>
      </div>
    </div>
  );
}

export default Summary;
