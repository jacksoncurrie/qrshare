export type Theme = 'light' | 'dark'

const themeStorageKey = 'qr-share-theme'
const darkModeQuery = '(prefers-color-scheme: dark)'

function getSystemTheme(): Theme {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia(darkModeQuery).matches
  ) {
    return 'dark'
  }

  return 'light'
}

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return getSystemTheme()
}

export function hasStoredThemePreference(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey)
  return storedTheme === 'light' || storedTheme === 'dark'
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#101010' : '#f5f4ef')
}

export function persistTheme(theme: Theme) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(themeStorageKey, theme)
}

export function watchSystemTheme(
  onThemeChange: (theme: Theme) => void,
): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const mediaQuery = window.matchMedia(darkModeQuery)
  const handleChange = (event: MediaQueryListEvent) => {
    onThemeChange(event.matches ? 'dark' : 'light')
  }

  mediaQuery.addEventListener('change', handleChange)

  return () => {
    mediaQuery.removeEventListener('change', handleChange)
  }
}
