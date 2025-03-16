import { useState } from 'react';
import templates from './TemplateStyles';

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  // 添加状态跟踪悬停的模板
  const [hoverTemplate, setHoverTemplate] = useState(null);
  
  return (
    <div className="template-selector">
      <div className="grid grid-cols-1 gap-4 mb-2">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border ${
              selectedTemplate === template.id 
                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-30' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
            onClick={() => onSelectTemplate(template.id)}
            onMouseEnter={() => setHoverTemplate(template.id)}
            onMouseLeave={() => setHoverTemplate(null)}
          >
            <div className="flex items-center p-3">
              {/* 模板颜色展示 */}
              <div className="mr-3 flex-shrink-0">
                <div 
                  className="h-14 w-10 rounded shadow-sm overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`
                  }}
                >
                  <div className="h-full w-full flex flex-col justify-between p-1">
                    <div className="w-full h-1.5 bg-white bg-opacity-40 rounded-sm"></div>
                    <div className="w-2/3 h-1.5 bg-white bg-opacity-30 rounded-sm"></div>
                    <div className="w-full h-1 bg-white bg-opacity-20 rounded-sm"></div>
                    <div className="w-3/4 h-1 bg-white bg-opacity-20 rounded-sm"></div>
                    <div className="w-1/2 h-1 bg-white bg-opacity-20 rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              {/* 模板信息 */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 
                    className="font-medium text-gray-900"
                    style={{ fontFamily: template.fontFamily }}
                  >
                    {template.name}
                  </h3>
                  {selectedTemplate === template.id && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                
                {/* 字体和颜色示例 */}
                <div className="flex items-center mt-2 space-x-1">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.primary }}></span>
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.heading }}></span>
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.secondary }}></span>
                  <span className="text-xs text-gray-500 ml-1" style={{ fontFamily: template.fontFamily }}>
                    {template.fontFamily.split(',')[0].replace(/['"]+/g, '')}
                  </span>
                </div>
              </div>
              
              {/* 右侧操作按钮 */}
              <div className="ml-2">
                <button 
                  onClick={() => onSelectTemplate(template.id)}
                  className={`p-1.5 rounded-full transition-colors ${
                    selectedTemplate === template.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500'
                  }`}
                >
                  {selectedTemplate === template.id ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-3">
        <a href="/templates" className="text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          Browse all template options
        </a>
      </div>
    </div>
  );
};

export default TemplateSelector; 