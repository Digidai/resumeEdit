import { Theme } from './theme';

export const generateThemeVariables = (theme: Theme): string => {
  const variables: string[] = [];

  // 颜色变量
  Object.entries(theme.colors).forEach(([key, value]) => {
    variables.push(`--color-${key}: ${value};`);
  });

  // 字体变量
  Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
    variables.push(`--font-${key}: ${value};`);
  });

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    variables.push(`--font-size-${key}: ${value};`);
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    variables.push(`--font-weight-${key}: ${value};`);
  });

  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    variables.push(`--line-height-${key}: ${value};`);
  });

  // 间距变量
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables.push(`--spacing-${key}: ${value};`);
  });

  // 断点变量
  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    variables.push(`--breakpoint-${key}: ${value};`);
  });

  // 圆角变量
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables.push(`--radius-${key}: ${value};`);
  });

  // 阴影变量
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables.push(`--shadow-${key}: ${value};`);
  });

  // 层级变量
  Object.entries(theme.zIndex).forEach(([key, value]) => {
    variables.push(`--z-${key}: ${value};`);
  });

  return variables.join('\n');
};

export const applyThemeToDocument = (theme: Theme): void => {
  const root = document.documentElement;
  const variables = generateThemeVariables(theme);
  
  // 清除现有的主题变量
  const existingStyle = document.getElementById('theme-variables');
  if (existingStyle) {
    existingStyle.remove();
  }

  // 创建新的样式元素
  const style = document.createElement('style');
  style.id = 'theme-variables';
  style.textContent = `:root {\n${variables}\n}`;
  document.head.appendChild(style);
};

export const getThemeValue = (path: string, theme: Theme): string => {
  const parts = path.split('.');
  let value: any = theme;

  for (const part of parts) {
    value = value[part];
    if (value === undefined) {
      throw new Error(`Theme value not found: ${path}`);
    }
  }

  return value;
}; 