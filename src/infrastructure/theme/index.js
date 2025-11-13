import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { colors } from './colors';
import { spacing, layout } from './spacing';
import { borderRadius, shadows } from './sizes';
import { typography } from './fonts';

export const theme = {
  colors,
  spacing,
  layout,
  borderRadius,
  typography,
  shadows,
};

export const ThemeProvider = ({ children }) => {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

export default theme;
