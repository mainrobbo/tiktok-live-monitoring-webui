type ItemWithKey<T> = {
  [key: string]: any
} & T

export function removeDuplicates<T>(
  array: ItemWithKey<T>[],
  key: keyof T,
): ItemWithKey<T>[] {
  const seen = new Set()
  return array.filter(item => {
    const keyValue = item[key]
    if (seen.has(keyValue)) {
      return false
    } else {
      seen.add(keyValue)
      return true
    }
  })
}
