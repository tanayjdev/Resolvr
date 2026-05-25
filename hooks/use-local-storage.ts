"use client"

import {
  useCallback,
  useEffect,
  useState,
} from "react"

import {
  readStoredValue,
  writeStoredValue,
} from "@/lib/storage/local-storage"

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] =
    useState<T>(initialValue)

  const [hasHydrated, setHasHydrated] =
    useState(false)

  useEffect(() => {
    setStoredValue(
      readStoredValue(key, initialValue)
    )
    setHasHydrated(true)
  }, [key])

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value)

      if (hasHydrated) {
        writeStoredValue(key, value)
      }
    },
    [hasHydrated, key]
  )

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    writeStoredValue(key, storedValue)
  }, [hasHydrated, key, storedValue])

  return [storedValue, setValue]
}
