export const theme = {
  colors: {
    background: '#F8F3E9',
    text: '#17202A',
    teal: '#0F7B78',
    saffron: '#F29C3D',
    card: '#FFFDF8',
    muted: '#727871',
    border: '#E8E0D0',
    danger: '#B23A3A',
    success: '#2E7D5B',
    white: '#FFFFFF',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  radii: { sm: 8, md: 16, lg: 24, pill: 999 },
  typography: {
    body: { fontSize: 16, lineHeight: 24 },
    title: { fontSize: 22, lineHeight: 30, fontWeight: '700' as const },
    caption: { fontSize: 12, lineHeight: 18 },
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};
