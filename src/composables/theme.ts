import cookies from 'js-cookie';

interface ThemeStruct {
  value: Theme,
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

const DARK_THEME_QUERY = '(prefers-color-scheme: dark)'
const LIGHT_THEME_QUERY = '(prefers-color-scheme: light)'

export const THEME_STORAGE_KEY = 'theme'
const themes = [Theme.Light, Theme.Dark]

export const createTheme = (initTheme: Theme) => {
  const theme:ThemeStruct = {
    value: initTheme === Theme.Dark ? Theme.Dark : Theme.Light
  }
  const set = (newTheme: Theme) => {
    if (themes.includes(newTheme) && newTheme !== theme.value) {
      theme.value = newTheme
      cookies.set(THEME_STORAGE_KEY, newTheme)
      // storage.set(THEME_STORAGE_KEY, newTheme)
    }
  }
  const toggle = () => set(theme.value === Theme.Dark ? Theme.Light : Theme.Dark)
  const bindClientSystem = () => {
    window
      .matchMedia(DARK_THEME_QUERY)
      .addEventListener('change', ({ matches }) => matches && set(Theme.Dark))
    window
      .matchMedia(LIGHT_THEME_QUERY)
      .addEventListener('change', ({ matches }) => matches && set(Theme.Light))
  }

  const themeState = {
    theme: theme,
    set,
    toggle,
    bindClientSystem
  }

  return themeState
}