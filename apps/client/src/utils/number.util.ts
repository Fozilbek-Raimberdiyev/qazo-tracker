export function formatNumber(num: string | number): string {
  const regex = /\B(?=(\d{3})+(?!\d))/g
  num = num.toString().replace(regex, ' ')
  return num
}
