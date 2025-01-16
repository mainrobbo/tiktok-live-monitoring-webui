'use client'
const PREFIX = 'ZERATIKTOK:'

function getObjectKeys<T>(
  obj: T,
  callback?: (key: keyof T, value: T[keyof T]) => void,
): (keyof T)[] | void {
  const keys = Object.keys(obj as object) as Array<keyof T>
  if (!callback) return keys.map(k => k)
  keys.forEach((key: keyof T) => {
    callback(key, obj[key])
  })
}
export default function useLocalStorage() {
  const getAll = () => {
    const storage = window.localStorage
    const filtered: { [key: string]: string } = {}
    const keys = getObjectKeys(storage) as Array<keyof Storage>
    for (const key of keys) {
      if (key.toString().startsWith(PREFIX)) filtered[key] = storage[key]
    }
    return filtered
  }
  const set = (key: string, value: string) =>
    localStorage.setItem(`${PREFIX}${key}`, value)
  const get = (key: string) => localStorage.getItem(`${PREFIX}${key}`)
  return { getAll, set, get }
}
