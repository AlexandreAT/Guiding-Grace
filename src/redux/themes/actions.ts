import { type ThemeType } from '../../../shared/const';

export const TOGGLE_THEME = 'TOGGLE/THEME';

export const toggleTheme = (theme: ThemeType) => ({
  type: TOGGLE_THEME,
  theme,
});
