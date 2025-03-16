import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ResumeEditor from '../components/ResumeEditor';
import TemplateSelector from '../components/TemplateSelector';
import DownloadOptions from '../components/DownloadOptions';
import { getTemplateById, templates, getCssVariables } from '../components/TemplateStyles';

const defaultResumeContent = `
<h1>John Doe</h1>
<p>Front-end Developer | john.doe@email.com | (123) 456-7890</p>
<h2>SUMMARY</h2>
<p>Experienced front-end developer with expertise in React, JavaScript, and modern web technologies.</p>
<h2>EXPERIENCE</h2>
<h3>Senior Front-end Developer | ABC Company | 2018 - Present</h3>
<ul>
  <li>Developed responsive web applications using React and TypeScript</li>
  <li>Implemented state management with Redux and Context API</li>
  <li>Collaborated with UI/UX designers to create intuitive user interfaces</li>
</ul>
<h3>Front-end Developer | XYZ Inc | 2015 - 2018</h3>
<ul>
  <li>Built interactive web applications using JavaScript and jQuery</li>
  <li>Optimized website performance and accessibility</li>
  <li>Participated in agile development processes</li>
</ul>
<h2>EDUCATION</h2>
<p>Bachelor of Science in Computer Science | University of Technology | 2015</p>
<h2>SKILLS</h2>
<p>JavaScript, React, TypeScript, HTML, CSS, Redux, Git, Node.js, Webpack</p>
`;

// 本地存储键名
const STORAGE_KEYS = {
  RESUME_CONTENT: 'resumeEdit_content',
  SELECTED_TEMPLATE: 'resumeEdit_template',
  FILE_NAME: 'resumeEdit_fileName'
};

export default function Home() {
  const router = useRouter();
  const [resumeContent, setResumeContent] = useState(defaultResumeContent);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [fileName, setFileName] = useState('my-resume');
  const [isLoading, setIsLoading] = useState(true);
  const [showTip, setShowTip] = useState(true);

  // 从本地存储加载数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedContent = localStorage.getItem(STORAGE_KEYS.RESUME_CONTENT);
      const savedTemplate = localStorage.getItem(STORAGE_KEYS.SELECTED_TEMPLATE);
      const savedFileName = localStorage.getItem(STORAGE_KEYS.FILE_NAME);
      
      if (savedContent) setResumeContent(savedContent);
      if (savedTemplate) setSelectedTemplate(savedTemplate);
      if (savedFileName) setFileName(savedFileName);
      
      setIsLoading(false);
    }
  }, []);

  // 保存到本地存储
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.RESUME_CONTENT, resumeContent);
      localStorage.setItem(STORAGE_KEYS.SELECTED_TEMPLATE, selectedTemplate);
      localStorage.setItem(STORAGE_KEYS.FILE_NAME, fileName);
    }
  }, [resumeContent, selectedTemplate, fileName, isLoading]);

  // 从URL参数获取模板
  useEffect(() => {
    if (router.isReady) {
      const { template } = router.query;
      if (template && ['modern', 'classic', 'professional'].includes(template)) {
        setSelectedTemplate(template);
      }
    }
  }, [router.isReady, router.query]);

  const handleContentChange = (content) => {
    setResumeContent(content);
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    // 更新URL，不刷新页面
    router.push(`/?template=${templateId}`, undefined, { shallow: true });
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleResetResume = () => {
    if (window.confirm('Are you sure you want to reset your resume to the default template? This action cannot be undone.')) {
      setResumeContent(defaultResumeContent);
    }
  };

  // 处理打印简历功能
  const handlePrintResume = () => {
    // 获取当前选中的模板样式
    const template = getTemplateById(selectedTemplate);
    const cssVars = getCssVariables(selectedTemplate);
    
    // 创建一个新窗口用于打印
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    // 构建包含完整样式和内容的HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${fileName || 'My Resume'}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Merriweather:wght@300;400;700&family=Poppins:wght@300;400;500;600&family=Lato:wght@300;400;700&display=swap');
          
          @page {
            size: A4;
            margin: 0.5cm;
          }
          
          body {
            font-family: ${cssVars['--font-family']};
            color: ${cssVars['--text-color']};
            background-color: white;
            line-height: 1.5;
            margin: 0;
            padding: 0;
          }
          
          .resume-container {
            max-width: 21cm;
            margin: 0 auto;
            padding: 1.5cm;
            background-color: white;
          }
          
          h1 {
            color: ${cssVars['--primary-color']};
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 8px;
            font-weight: 700;
          }
          
          h2 {
            color: ${cssVars['--primary-color']};
            font-size: 18px;
            margin-top: 16px;
            margin-bottom: 8px;
            font-weight: 600;
            ${template.id === 'elegant' ? 'border-bottom: 1px solid ' + cssVars['--primary-color'] + ';' : ''}
            ${template.id === 'professional' ? 'text-transform: uppercase;' : ''}
          }
          
          h3 {
            font-size: 16px;
            margin-top: 12px;
            margin-bottom: 6px;
            font-weight: 500;
            color: ${cssVars['--secondary-color'] || cssVars['--primary-color']};
          }
          
          p {
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          ul, ol {
            margin-top: 6px;
            margin-bottom: 12px;
            padding-left: 24px;
          }
          
          li {
            margin-bottom: 4px;
            font-size: 14px;
          }
          
          /* 特定模板样式调整 */
          ${template.id === 'minimal' ? `
            h1, h2, h3 {
              font-weight: 400;
            }
          ` : ''}
          
          ${template.id === 'modern' ? `
            h2 {
              padding-bottom: 6px;
              border-bottom: 2px solid ${cssVars['--primary-color']};
            }
          ` : ''}
          
          ${template.id === 'creative' ? `
            h1 {
              font-size: 28px;
              color: ${cssVars['--primary-color']};
            }
            h2 {
              background-color: ${cssVars['--primary-color']}20;
              padding: 4px 8px;
              border-radius: 4px;
            }
          ` : ''}
        </style>
      </head>
      <body>
        <div class="resume-container">
          ${resumeContent}
        </div>
        <script>
          // 自动打印并关闭窗口
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 250);
          };
        </script>
      </body>
      </html>
    `;
    
    // 写入内容到新窗口
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // 获取当前模板信息
  const currentTemplate = getTemplateById(selectedTemplate);
  const templateVars = getCssVariables(selectedTemplate);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Editor</h1>
              <p className="text-sm text-gray-600">Create, customize, and download your professional resume</p>
            </div>
            
            {showTip && (
              <div className="mt-4 md:mt-0 bg-blue-50 text-blue-800 p-2.5 rounded-lg border border-blue-200 flex items-start fade-in">
                <svg className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-xs font-medium">Your changes are automatically saved to your browser.</p>
                  <button 
                    onClick={() => setShowTip(false)} 
                    className="text-xs text-blue-700 underline mt-0.5"
                  >
                    Got it
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left side - Template selection and tools */}
            <div className="lg:col-span-1 space-y-5">
              {/* 模板选择 */}
              <div className="card p-4 bg-white">
                <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Template
                </h2>
                <TemplateSelector 
                  selectedTemplate={selectedTemplate} 
                  onSelectTemplate={handleTemplateChange} 
                />
              </div>
              
              {/* 下载选项 */}
              <div className="card p-4 bg-white">
                <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </h2>
                <div className="mb-4">
                  <label htmlFor="fileName" className="form-label flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">文件名</span>
                    <span className="text-xs text-gray-400">自动添加 .pdf/.docx 后缀</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fileName"
                      value={fileName}
                      onChange={handleFileNameChange}
                      className="form-input pl-7 text-sm"
                      placeholder="your-professional-resume"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">为您的简历文件命名，下载时将使用此名称</p>
                </div>
                
                <DownloadOptions 
                  resumeContent={resumeContent} 
                  fileName={fileName}
                  templateId={selectedTemplate}
                />
              </div>

              {/* 操作按钮统一为卡片组 */}
              <div className="card p-4 bg-white">
                <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="h-4 w-4 text-blue-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  Actions
                </h2>
                
                <div className="space-y-3">
                  <button
                    onClick={handleResetResume}
                    className="btn btn-outline w-full flex items-center justify-center text-sm text-gray-700 hover:text-red-600 group py-1.5"
                  >
                    <svg className="h-4 w-4 mr-1.5 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Reset to Default
                  </button>
                  
                  <a
                    href="/templates"
                    className="btn btn-outline w-full flex items-center justify-center text-sm text-gray-700 hover:text-green-600 group py-1.5"
                  >
                    <svg className="h-4 w-4 mr-1.5 text-gray-500 group-hover:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Browse Templates
                  </a>
                  
                  <button
                    onClick={handlePrintResume}
                    className="btn btn-outline w-full flex items-center justify-center text-sm text-gray-700 hover:text-purple-600 group py-1.5"
                  >
                    <svg className="h-4 w-4 mr-1.5 text-gray-500 group-hover:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Resume
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right side - Editor and preview */}
            <div className="lg:col-span-3">
              <div className="card p-5 bg-white">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 flex items-center">
                      <svg className="h-4 w-4 text-blue-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Resume Editor
                    </h2>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span className="font-medium mr-1">Template:</span>
                    <span 
                      className="text-gray-900 flex items-center" 
                      style={{ fontFamily: currentTemplate.fontFamily }}
                    >
                      <span 
                        className="inline-block w-2 h-2 rounded-full mr-1"
                        style={{ backgroundColor: currentTemplate.colors.primary }}
                      ></span>
                      {currentTemplate.name}
                    </span>
                  </div>
                </div>
                
                <div 
                  className={`${currentTemplate.class}`} 
                  style={{
                    ...templateVars,
                    fontFamily: templateVars['--font-family']
                  }}
                >
                  <ResumeEditor 
                    content={resumeContent} 
                    onChange={handleContentChange}
                    templateId={selectedTemplate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 