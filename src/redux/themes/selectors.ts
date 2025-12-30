import { getTheme, type ThemeType } from '../../../shared/const';

export const selectThemeType = (state: any): ThemeType => {
  return state.themesReducer.theme as ThemeType;
};

export const selectTheme = (state: any) => {
  const themeType = selectThemeType(state);
  return getTheme(themeType);
};
