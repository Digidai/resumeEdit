import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../styles/theme';
import { themePresets } from '../styles/themePresets';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="color-picker">
      <label>{label}</label>
      <div className="color-input-group">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) => {
  return (
    <div className="number-input">
      <label>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="select">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const ThemePreview: React.FC<{ theme: Theme }> = ({ theme }) => {
  return (
    <div className="theme-preview">
      <div className="preview-header">
        <h4>主题预览</h4>
        <span className="theme-mode">实时预览</span>
      </div>
      
      <div className="preview-variants">
        <div className="variant-buttons">
          <button className="variant-button active">默认</button>
          <button className="variant-button">悬停</button>
          <button className="variant-button">禁用</button>
        </div>
      </div>

      <div className="preview-colors">
        <h5>颜色预览</h5>
        <div className="color-grid">
          {Object.entries(theme.colors).map(([key, value]) => (
            <div key={key} className="color-item">
              <div
                className="color-swatch"
                style={{ backgroundColor: value }}
              />
              <span>{key}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="preview-typography">
        <h5>排版预览</h5>
        <div className="typography-item">
          <h1>标题 1</h1>
          <h2>标题 2</h2>
          <h3>标题 3</h3>
          <p>正文文本</p>
          <p className="text-secondary">次要文本</p>
        </div>
      </div>

      <div className="preview-components">
        <h5>组件预览</h5>
        <button>按钮</button>
        <input type="text" placeholder="输入框" />
        <div className="card">
          <h4>卡片标题</h4>
          <p>这是一个卡片组件示例</p>
        </div>
      </div>
    </div>
  );
};

export const ThemeEditor: React.FC = () => {
  const { theme, updateTheme, applyPreset, currentPreset } = useTheme();
  const [customTheme, setCustomTheme] = useState<Partial<Theme>>(theme);

  const handleColorChange = (key: keyof Theme['colors'], value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      } as Theme['colors'],
    }));
  };

  const handleSpacingChange = (key: keyof Theme['spacing'], value: number) => {
    setCustomTheme((prev) => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [key]: `${value}px`,
      } as Theme['spacing'],
    }));
  };

  const handleFontSizeChange = (key: keyof Theme['typography']['fontSize'], value: number) => {
    setCustomTheme((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        fontSize: {
          ...prev.typography?.fontSize,
          [key]: `${value}px`,
        } as Theme['typography']['fontSize'],
      } as Theme['typography'],
    }));
  };

  const handleFontFamilyChange = (key: keyof Theme['typography']['fontFamily'], value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        fontFamily: {
          ...prev.typography?.fontFamily,
          [key]: value,
        } as Theme['typography']['fontFamily'],
      } as Theme['typography'],
    }));
  };

  const handlePresetChange = (presetName: string) => {
    applyPreset(presetName);
    setCustomTheme(themePresets[presetName]);
  };

  const handleSave = () => {
    updateTheme(customTheme as Theme);
  };

  const handleReset = () => {
    setCustomTheme(theme);
  };

  return (
    <div className="theme-editor">
      <h3>主题编辑器</h3>
      
      <div className="editor-section">
        <h4>预设主题</h4>
        <div className="preset-buttons">
          {Object.keys(themePresets).map((presetName) => (
            <button
              key={presetName}
              className={`preset-button ${currentPreset === presetName ? 'active' : ''}`}
              onClick={() => handlePresetChange(presetName)}
            >
              {presetName}
            </button>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <h4>颜色</h4>
        <div className="color-grid">
          {Object.entries(theme.colors).map(([key, value]) => (
            <ColorPicker
              key={key}
              label={key}
              value={value}
              onChange={(newValue) => handleColorChange(key as keyof Theme['colors'], newValue)}
            />
          ))}
        </div>
      </div>

      <div className="editor-section">
        <h4>间距</h4>
        <div className="spacing-grid">
          {Object.entries(theme.spacing).map(([key, value]) => (
            <NumberInput
              key={key}
              label={key}
              value={parseInt(value)}
              onChange={(newValue) => handleSpacingChange(key as keyof Theme['spacing'], newValue)}
              min={0}
              max={100}
              step={1}
            />
          ))}
        </div>
      </div>

      <div className="editor-section">
        <h4>字体大小</h4>
        <div className="font-size-grid">
          {Object.entries(theme.typography.fontSize).map(([key, value]) => (
            <NumberInput
              key={key}
              label={key}
              value={parseInt(value)}
              onChange={(newValue) => handleFontSizeChange(key as keyof Theme['typography']['fontSize'], newValue)}
              min={8}
              max={72}
              step={1}
            />
          ))}
        </div>
      </div>

      <div className="editor-section">
        <h4>字体</h4>
        <div className="font-family-grid">
          {Object.entries(theme.typography.fontFamily).map(([key, value]) => (
            <Select
              key={key}
              label={key}
              value={value}
              options={['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana']}
              onChange={(newValue) => handleFontFamilyChange(key as keyof Theme['typography']['fontFamily'], newValue)}
            />
          ))}
        </div>
      </div>

      <div className="editor-actions">
        <button onClick={handleSave}>保存更改</button>
        <button onClick={handleReset}>重置</button>
      </div>

      <ThemePreview theme={customTheme as Theme} />
    </div>
  );
}; 