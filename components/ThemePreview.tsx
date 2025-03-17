import React from 'react';
import { useTheme } from '../styles/ThemeContext';

export const ThemePreview: React.FC = () => {
  const { theme, isDark, themeVariant, setThemeVariant } = useTheme();

  return (
    <div className="theme-preview">
      <div className="preview-header">
        <h3>Theme Preview</h3>
        <span className="theme-mode">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
      </div>

      <div className="preview-variants">
        <h4>Theme Variants</h4>
        <div className="variant-buttons">
          <button
            className={`variant-button ${themeVariant === 'default' ? 'active' : ''}`}
            onClick={() => setThemeVariant('default')}
          >
            Default
          </button>
          <button
            className={`variant-button ${themeVariant === 'highContrast' ? 'active' : ''}`}
            onClick={() => setThemeVariant('highContrast')}
          >
            High Contrast
          </button>
          <button
            className={`variant-button ${themeVariant === 'darkHighContrast' ? 'active' : ''}`}
            onClick={() => setThemeVariant('darkHighContrast')}
          >
            Dark High Contrast
          </button>
          <button
            className={`variant-button ${themeVariant === 'custom' ? 'active' : ''}`}
            onClick={() => setThemeVariant('custom')}
          >
            Custom
          </button>
        </div>
      </div>
      
      <div className="preview-colors">
        <h4>Colors</h4>
        <div className="color-grid">
          <div className="color-item">
            <div className="color-swatch" style={{ backgroundColor: theme.colors.primary }} />
            <span>Primary</span>
          </div>
          <div className="color-item">
            <div className="color-swatch" style={{ backgroundColor: theme.colors.secondary }} />
            <span>Secondary</span>
          </div>
          <div className="color-item">
            <div className="color-swatch" style={{ backgroundColor: theme.colors.accent }} />
            <span>Accent</span>
          </div>
          <div className="color-item">
            <div className="color-swatch" style={{ backgroundColor: theme.colors.background }} />
            <span>Background</span>
          </div>
          <div className="color-item">
            <div className="color-swatch" style={{ backgroundColor: theme.colors.surface }} />
            <span>Surface</span>
          </div>
        </div>
      </div>

      <div className="preview-typography">
        <h4>Typography</h4>
        <div className="typography-item">
          <span className="font-sans">Sans Font</span>
          <span className="font-serif">Serif Font</span>
          <span className="font-mono">Monospace Font</span>
        </div>
        <div className="typography-item">
          <span style={{ fontSize: theme.typography.fontSize.xs }}>Extra Small</span>
          <span style={{ fontSize: theme.typography.fontSize.sm }}>Small</span>
          <span style={{ fontSize: theme.typography.fontSize.base }}>Base</span>
          <span style={{ fontSize: theme.typography.fontSize.lg }}>Large</span>
          <span style={{ fontSize: theme.typography.fontSize.xl }}>Extra Large</span>
        </div>
      </div>

      <div className="preview-components">
        <h4>Components</h4>
        <button>Button</button>
        <input type="text" placeholder="Input field" />
        <div className="card">
          <h5>Card Component</h5>
          <p>This is a preview of the card component with some sample content.</p>
        </div>
      </div>
    </div>
  );
}; 