export function readStoredValue<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T
): T {
  if (typeof window === "undefined") {
    return initialValue
  }

  try {
    const raw = localStorage.getItem(key)

    if (!raw) {
      return initialValue
    }

    const parsed: unknown = JSON.parse(raw)

    if (isValid && !isValid(parsed)) {
      return initialValue
    }

    return parsed as T
  } catch (error) {
    console.error(
      `Failed to read localStorage key "${key}":`,
      error
    )

    return initialValue
  }
}

export function writeStoredValue<T>(
  key: string,
  value: T
): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    )
  } catch (error) {
    console.error(
      `Failed to write localStorage key "${key}":`,
      error
    )
  }
}

export function removeStoredValue(
  key: string
): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(
      `Failed to remove localStorage key "${key}":`,
      error
    )
  }
}
