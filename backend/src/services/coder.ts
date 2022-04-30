const base = Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

export function encode(text: string): number {
  let result = 0
  for (let i = 0; i < text.length; i++) {
    const index = base.indexOf(text[i])
    result += index * Math.pow(base.length, text.length - i - 1)
  }
  return result
}

export function decode(id: number): string {
  let result = ''
  let rest = id
  while (rest > 0) {
    const index = rest % base.length
    result = base[index] + result
    rest = Math.floor(rest / base.length)
  }
  return result
}
