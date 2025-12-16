export function setLocalStorage(key: string, value: unknown) {
    localStorage.setItem(key, value as string)
  }

  export function getLocalStorage(key: string) {
    return localStorage.getItem(key)
  }
  export function removeLocalStorage(key: string) {
    localStorage.removeItem(key)
  }
