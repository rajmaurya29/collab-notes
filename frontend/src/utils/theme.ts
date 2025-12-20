/**
 * Theme Utility Functions
 * Handles theme switching and data-theme attribute management
 */

export type ThemeMode = 'light' | 'dark';

/**
 * Apply theme to the document root element
 * @param theme - The theme mode to apply ('light' or 'dark')
 */
export const applyTheme = (theme: ThemeMode): void => {
  document.documentElement.setAttribute('data-theme', theme);
};

/**
 * Get the current theme from the document root element
 * @returns The current theme mode
 */
export const getCurrentTheme = (): ThemeMode => {
  const theme = document.documentElement.getAttribute('data-theme');
  return (theme === 'dark' ? 'dark' : 'light') as ThemeMode;
};

/**
 * Toggle between light and dark themes
 * @returns The new theme mode after toggling
 */
export const toggleTheme = (): ThemeMode => {
  const currentTheme = getCurrentTheme();
  const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
  return newTheme;
};
