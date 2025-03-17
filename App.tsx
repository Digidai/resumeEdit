import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeEditor } from './components/ThemeEditor';
import { ThemeToggle } from './components/ThemeToggle';
import './styles/base.css';

const App: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <ThemeProvider>
      <div className="app">
        <header className="app-header">
          <h1>主题编辑器</h1>
          <div className="header-actions">
            <button
              className="editor-toggle"
              onClick={() => setShowEditor(!showEditor)}
            >
              {showEditor ? '关闭编辑器' : '打开编辑器'}
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="app-main">
          {showEditor && <ThemeEditor />}
          {/* 其他应用内容 */}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App; 