import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';
import { getTemplateById, getCssVariables } from './TemplateStyles';

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="editor-loading">Loading editor...</div>,
});
import 'react-quill/dist/quill.snow.css';

// 添加自定义的内容模板
const contentTemplates = {
  header: `<h1>Your Name</h1>
<p>Position | email@example.com | (123) 456-7890</p>`,
  summary: `<h2>SUMMARY</h2>
<p>Experienced professional with expertise in [your field] and a proven track record of [your key achievements].</p>`,
  experience: `<h2>EXPERIENCE</h2>
<h3>Job Title | Company Name | Start Date - End Date</h3>
<ul>
  <li>Accomplishment or responsibility</li>
  <li>Accomplishment or responsibility</li>
  <li>Accomplishment or responsibility</li>
</ul>`,
  education: `<h2>EDUCATION</h2>
<p>Degree Name | Institution | Graduation Year</p>`,
  skills: `<h2>SKILLS</h2>
<p>Skill 1, Skill 2, Skill 3, Skill 4, Skill 5, Skill 6</p>`,
};

// 自定义插入结构函数
function insertStructure() {}

// 扩展工具栏，包含更多格式选项和自定义按钮
const modules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['clean'],
      ['structure']  // 自定义按钮，用于插入结构化模板
    ],
    handlers: {
      'structure': function() {} // 将在组件中定义
    }
  },
  // 添加历史记录模块和键盘处理
  history: {
    delay: 1000,
    maxStack: 500,
    userOnly: true
  },
  keyboard: {
    bindings: {
      'custom-undo': {
        key: 'Z',
        shortKey: true,
        handler: function(range, context) {
          this.quill.history.undo();
        }
      },
      'custom-redo': {
        key: 'Z',
        shortKey: true,
        shiftKey: true,
        handler: function(range, context) {
          this.quill.history.redo();
        }
      }
    }
  }
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'align',
  'link',
];

// 模板菜单按钮组件 - 使用 memo 优化性能
const TemplateButton = memo(({ icon, label, onClick }) => (
  <button 
    className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left flex items-center"
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
));

const ResumeEditor = ({ content, onChange, templateId = 'modern' }) => {
  // State to handle the editor content
  const [editorContent, setEditorContent] = useState('');
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const quillRef = useRef(null);
  const structureButtonRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [quillInstance, setQuillInstance] = useState(null);
  
  const template = getTemplateById(templateId);
  const cssVars = getCssVariables(templateId);
  
  // 确保仅在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (content) {
      setEditorContent(content);
    }
  }, [content]);
  
  // 使用 useCallback 优化事件处理函数
  const handleStructureButtonClick = useCallback((e) => {
    if (!e || !e.target) return;
    
    const button = e.target.closest('.ql-structure');
    if (!button) return;
    
    const buttonRect = button.getBoundingClientRect();
    setMenuPosition({
      top: buttonRect.bottom + window.scrollY + 5,
      left: buttonRect.left + window.scrollX
    });
    setShowTemplateMenu(prev => !prev);
  }, []);
  
  // 处理插入模板内容，使用 useCallback 优化
  const insertTemplate = useCallback((templateKey) => {
    if (!isClient || !quillInstance) return;
    
    const template = contentTemplates[templateKey];
    
    try {
      // 获取当前选择范围
      const range = quillInstance.getSelection(true);
      
      // 如果没有选择范围，则在文档末尾插入
      const insertIndex = range ? range.index : quillInstance.getLength();
      
      // 在光标位置插入模板内容
      quillInstance.clipboard.dangerouslyPasteHTML(insertIndex, template);
      
      // 更新内容状态
      const newContent = quillInstance.root.innerHTML;
      setEditorContent(newContent);
      if (onChange) {
        onChange(newContent);
      }
    } catch (error) {
      console.error("插入模板内容失败:", error);
    }
    
    // 隐藏菜单
    setShowTemplateMenu(false);
  }, [isClient, quillInstance, onChange]);

  const handleChange = useCallback((value) => {
    setEditorContent(value);
    if (onChange) {
      onChange(value);
    }
  }, [onChange]);
  
  // 初始化结构按钮和自定义处理逻辑
  useEffect(() => {
    if (!isClient || !quillRef.current) return;
    
    // 访问底层的 Quill 实例 - 在 ReactQuill 中是通过 editor 属性
    // 而不是 getEditor() 方法
    if (!quillRef.current.editor) return;
    
    // 获取编辑器实例并保存
    const editor = quillRef.current.editor;
    setQuillInstance(editor);
    
    // 等待确保工具栏渲染完成
    const timeoutId = setTimeout(() => {
      // 找到自定义按钮并添加事件监听
      const structureButton = document.querySelector('.ql-structure');
      if (structureButton) {
        structureButtonRef.current = structureButton;
        
        // 自定义图标和提示
        structureButton.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.5" fill="none">
            <path d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        `;
        structureButton.title = "Insert resume section";
        
        // 清除之前的事件监听，避免重复绑定
        structureButton.removeEventListener('click', handleStructureButtonClick);
        structureButton.addEventListener('click', handleStructureButtonClick);
      }
    }, 100);
    
    return () => {
      // 清除定时器和事件监听
      clearTimeout(timeoutId);
      if (structureButtonRef.current) {
        structureButtonRef.current.removeEventListener('click', handleStructureButtonClick);
      }
    };
  }, [isClient, handleStructureButtonClick]);

  // 关闭菜单（当点击外部区域时）
  useEffect(() => {
    if (!isClient || !showTemplateMenu) return;
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('.template-menu') && 
          !event.target.closest('.ql-structure')) {
        setShowTemplateMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isClient, showTemplateMenu]);

  // 渲染模板菜单项时使用记忆化组件
  const renderTemplateButton = (key, icon, label) => (
    <TemplateButton 
      key={key}
      icon={icon}
      label={label}
      onClick={() => insertTemplate(key)}
    />
  );

  // 如果不是客户端，返回一个占位符
  if (!isClient) {
    return (
      <div 
        className={`resume-editor ${template.class}`} 
        style={{
          ...cssVars,
          fontFamily: cssVars['--font-family'],
          minHeight: '300px'
        }}
      >
        <div className="editor-placeholder">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`resume-editor ${template.class} relative`} 
      style={{
        ...cssVars,
        fontFamily: cssVars['--font-family']
      }}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        formats={formats}
        value={editorContent}
        onChange={handleChange}
        placeholder="开始编辑您的简历，或点击结构按钮添加预设内容..."
      />
      
      {/* 模板菜单 */}
      {showTemplateMenu && (
        <div 
          className="template-menu absolute bg-white rounded-md shadow-lg z-20 border border-gray-200"
          style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
        >
          <div className="py-1">
            <div className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50">
              插入简历模块
            </div>
            {renderTemplateButton('header', 
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>, 
              '个人信息 / 标题'
            )}
            {renderTemplateButton('summary', 
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>, 
              '个人概述'
            )}
            {renderTemplateButton('experience', 
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>, 
              '工作经验'
            )}
            {renderTemplateButton('education', 
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>, 
              '教育背景'
            )}
            {renderTemplateButton('skills', 
              <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>, 
              '技能列表'
            )}
          </div>
        </div>
      )}
      
      {/* 增强提示信息 */}
      <div className="text-xs text-gray-500 mt-3 space-y-1">
        <div className="flex items-center">
          <svg className="w-3.5 h-3.5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>使用提示：</span>
        </div>
        <ul className="list-disc pl-5 space-y-0.5">
          <li>选择文本后可使用工具栏进行格式化</li>
          <li>点击
            <span className="mx-1 px-1 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-700 inline-flex items-center">
              <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>结构</span>
            </span>
            按钮可快速插入标题、经验、技能等简历部分
          </li>
          <li>使用 Ctrl+Z 撤销，Ctrl+Shift+Z 重做</li>
          <li>内容会自动保存在您的浏览器中</li>
        </ul>
      </div>
    </div>
  );
};

// 使用 memo 优化组件，避免不必要的重渲染
export default memo(ResumeEditor); 