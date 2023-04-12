export default function formatCurrency(amount) {
  return `R$ ${amount.toFixed(2).replace('.',',')}`
}
