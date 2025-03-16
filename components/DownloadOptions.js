import React, { useState, useCallback, memo } from 'react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { getTemplateById, getCssVariables } from './TemplateStyles';

// 下载按钮组件 - 使用 memo 优化性能
const DownloadButton = memo(({ icon, label, onClick, isLoading, disabled }) => (
  <button
    onClick={onClick}
    disabled={isLoading || disabled}
    className={`w-full py-2 px-4 rounded mb-2 flex items-center justify-center transition-all ${
      disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 
      isLoading ? 'bg-blue-400 text-white cursor-wait' : 
      'bg-blue-500 hover:bg-blue-600 text-white'
    }`}
  >
    {isLoading ? (
      <>
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        处理中...
      </>
    ) : (
      <>
        {icon}
        <span className="ml-2">{label}</span>
      </>
    )}
  </button>
));

const DownloadOptions = ({ resumeContent, fileName = 'my-resume', templateId = 'modern' }) => {
  const [downloadState, setDownloadState] = useState({
    pdf: { loading: false, error: null },
    word: { loading: false, error: null }
  });
  
  const template = getTemplateById(templateId);
  const cssVars = getCssVariables(templateId);
  
  // 根据简历内容生成DOM元素树，用于解析和格式化
  const parseContent = useCallback(() => {
    if (!resumeContent) return null;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resumeContent;
    return tempDiv;
  }, [resumeContent]);
  
  // 处理PDF下载
  const handleDownloadPDF = useCallback(async () => {
    if (!resumeContent || downloadState.pdf.loading) return;
    
    try {
      setDownloadState(prev => ({
        ...prev,
        pdf: { loading: true, error: null }
      }));
      
      // 创建临时DOM解析内容
      const contentDiv = parseContent();
      if (!contentDiv) {
        throw new Error('无法解析简历内容');
      }
      
      // 创建PDF文档
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // 配置字体
      const fontMapping = {
        'Inter': 'helvetica',
        'Roboto': 'helvetica',
        'Poppins': 'helvetica',
        'Merriweather': 'times',
        'Lato': 'helvetica'
      };
      
      // 获取当前模板的字体和颜色
      const fontFamily = cssVars['--font-family'].split(',')[0].replace(/['"]+/g, '');
      const textColor = cssVars['--text-color'];
      const primaryColor = cssVars['--primary-color'];
      
      // 设置页面尺寸和边距
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // 初始位置
      let currentY = margin;
      
      // 处理内容中的每个元素
      Array.from(contentDiv.children).forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const text = element.innerText.trim();
        const fontSize = tagName === 'h1' ? 16 : 
                         tagName === 'h2' ? 13 : 
                         tagName === 'h3' ? 11 : 10;
        
        // 检查是否需要分页
        if (currentY > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        
        // 设置字体和颜色
        doc.setFont(fontMapping[fontFamily] || 'helvetica');
        
        if (tagName === 'h1' || tagName === 'h2') {
          doc.setTextColor(primaryColor);
          doc.setFontSize(fontSize);
          doc.setFont(fontMapping[fontFamily] || 'helvetica', tagName === 'h1' ? 'bold' : 'normal');
          
          doc.text(text, margin, currentY);
          currentY += 7;
          
          // 为h2添加下划线
          if (tagName === 'h2' && template.id === 'modern') {
            doc.setDrawColor(primaryColor);
            doc.setLineWidth(0.5);
            doc.line(margin, currentY - 3, margin + contentWidth / 2, currentY - 3);
            currentY += 2;
          }
        } 
        else if (tagName === 'h3') {
          doc.setTextColor(primaryColor);
          doc.setFontSize(fontSize);
          doc.setFont(fontMapping[fontFamily] || 'helvetica', 'italic');
          doc.text(text, margin, currentY);
          currentY += 5;
        }
        else if (tagName === 'p') {
          doc.setTextColor(textColor);
          doc.setFontSize(fontSize);
          doc.setFont(fontMapping[fontFamily] || 'helvetica', 'normal');
          
          // 处理长段落的自动换行
          const splitText = doc.splitTextToSize(text, contentWidth);
          doc.text(splitText, margin, currentY);
          currentY += (splitText.length * 5) + 3;
        }
        else if (tagName === 'ul' || tagName === 'ol') {
          doc.setTextColor(textColor);
          doc.setFontSize(fontSize);
          doc.setFont(fontMapping[fontFamily] || 'helvetica', 'normal');
          
          // 处理列表项
          Array.from(element.children).forEach((li, index) => {
            const bullet = tagName === 'ol' ? `${index + 1}.` : '•';
            const listText = `${bullet} ${li.innerText.trim()}`;
            const splitListText = doc.splitTextToSize(listText, contentWidth - 2);
            
            doc.text(splitListText, margin, currentY);
            currentY += (splitListText.length * 5) + 2;
          });
          
          currentY += 3;
        }
      });
      
      // 添加页脚
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated by ResumeEdit`, pageWidth - margin - 40, pageHeight - 5);
      
      // 保存文件
      doc.save(`${fileName || 'resume'}.pdf`);
      
      setDownloadState(prev => ({
        ...prev,
        pdf: { loading: false, error: null }
      }));
    } catch (error) {
      console.error('PDF下载失败:', error);
      setDownloadState(prev => ({
        ...prev,
        pdf: { loading: false, error: error.message || '下载失败，请重试' }
      }));
    }
  }, [resumeContent, fileName, templateId, cssVars, template, parseContent, downloadState.pdf.loading]);
  
  // 处理Word下载
  const handleDownloadWord = useCallback(async () => {
    if (!resumeContent || downloadState.word.loading) return;
    
    try {
      setDownloadState(prev => ({
        ...prev,
        word: { loading: true, error: null }
      }));
      
      // 创建临时DOM解析内容
      const contentDiv = parseContent();
      if (!contentDiv) {
        throw new Error('无法解析简历内容');
      }
      
      // 获取当前模板的字体和颜色
      const primaryColor = cssVars['--primary-color'].replace('#', '');
      
      // 创建段落数组
      const docxParagraphs = [];
      
      // 处理内容中的每个元素
      Array.from(contentDiv.children).forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const text = element.innerText.trim();
        
        if (tagName === 'h1') {
          docxParagraphs.push(
            new Paragraph({
              text: text,
              heading: HeadingLevel.HEADING_1,
              thematicBreak: false,
              spacing: { before: 240, after: 120 },
              alignment: AlignmentType.LEFT,
            })
          );
        } 
        else if (tagName === 'h2') {
          docxParagraphs.push(
            new Paragraph({
              text: text,
              heading: HeadingLevel.HEADING_2,
              thematicBreak: template.id === 'modern', // 添加下划线
              spacing: { before: 240, after: 120 },
              alignment: AlignmentType.LEFT,
              border: {
                bottom: { color: primaryColor, size: 1, style: 'single' },
              },
            })
          );
        }
        else if (tagName === 'h3') {
          docxParagraphs.push(
            new Paragraph({
              text: text,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 240, after: 120 },
              alignment: AlignmentType.LEFT,
            })
          );
        }
        else if (tagName === 'p') {
          docxParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  size: 24,
                }),
              ],
              spacing: { before: 120, after: 120 },
              alignment: AlignmentType.LEFT,
            })
          );
        }
        else if (tagName === 'ul' || tagName === 'ol') {
          // 处理列表项
          Array.from(element.children).forEach((li, index) => {
            const listText = li.innerText.trim();
            const bullet = tagName === 'ol' ? `${index + 1}.` : '•';
            
            docxParagraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${bullet} ${listText}`,
                    size: 24,
                  }),
                ],
                spacing: { before: 60, after: 60 },
                alignment: AlignmentType.LEFT,
                indent: { left: 360 },
              })
            );
          });
        }
      });
      
      // 创建文档
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docxParagraphs,
          },
        ],
      });
      
      // 生成Word文档
      const buffer = await Packer.toBuffer(doc);
      
      // 保存文件
      saveAs(new Blob([buffer]), `${fileName || 'resume'}.docx`);
      
      setDownloadState(prev => ({
        ...prev,
        word: { loading: false, error: null }
      }));
    } catch (error) {
      console.error('Word下载失败:', error);
      setDownloadState(prev => ({
        ...prev,
        word: { loading: false, error: error.message || '下载失败，请重试' }
      }));
    }
  }, [resumeContent, fileName, templateId, cssVars, template, parseContent, downloadState.word.loading]);
  
  // 判断下载按钮是否应该禁用
  const isDownloadDisabled = !resumeContent || resumeContent.trim() === '';
  
  return (
    <div className="download-options">
      <DownloadButton
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8" />
          </svg>
        }
        label="下载 PDF"
        onClick={handleDownloadPDF}
        isLoading={downloadState.pdf.loading}
        disabled={isDownloadDisabled}
      />
      
      {downloadState.pdf.error && (
        <div className="text-red-500 text-xs mb-2">{downloadState.pdf.error}</div>
      )}
      
      <DownloadButton
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8" />
          </svg>
        }
        label="下载 Word"
        onClick={handleDownloadWord}
        isLoading={downloadState.word.loading}
        disabled={isDownloadDisabled}
      />
      
      {downloadState.word.error && (
        <div className="text-red-500 text-xs">{downloadState.word.error}</div>
      )}
      
      <div className="text-xs text-gray-500 mt-3">
        <p>提示：PDF格式适合直接打印或在线申请，Word格式方便进一步编辑</p>
      </div>
    </div>
  );
};

// 使用 memo 优化组件，避免不必要的重渲染
export default memo(DownloadOptions); 