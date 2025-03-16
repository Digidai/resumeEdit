// 集中管理所有模板的样式和配置
export const templates = [
  {
    id: 'modern',
    name: 'Modern',
    class: 'template-modern',
    description: 'Clean and minimal design with a focus on readability.',
    features: [
      'Clean, minimal design',
      'Optimized whitespace',
      'Modern typography',
      'Section separators'
    ],
    fontFamily: 'Inter, sans-serif',
    colors: {
      primary: '#3b82f6',
      secondary: '#f3f4f6',
      heading: '#1f2937',
      text: '#4b5563'
    }
  },
  {
    id: 'classic',
    name: 'Classic',
    class: 'template-classic',
    description: 'A traditional resume format that works well for established professionals.',
    features: [
      'Traditional format',
      'Formal structure',
      'Serif typography',
      'Conservative spacing'
    ],
    fontFamily: 'Georgia, serif',
    colors: {
      primary: '#7F1D1D',
      secondary: '#FEF3C7',
      heading: '#1E293B',
      text: '#334155'
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    class: 'template-professional',
    description: 'Elegant and structured layout for a professional appearance.',
    features: [
      'Professional layout',
      'Balanced visual hierarchy',
      'Clear section division',
      'Prominent contact details'
    ],
    fontFamily: 'Arial, sans-serif',
    colors: {
      primary: '#047857',
      secondary: '#ECFDF5',
      heading: '#064E3B',
      text: '#1F2937'
    }
  }
];

export const getTemplateById = (id) => {
  return templates.find(template => template.id === id) || templates[0];
};

export const getCssVariables = (templateId) => {
  const template = getTemplateById(templateId);
  return {
    '--primary-color': template.colors.primary,
    '--secondary-color': template.colors.secondary,
    '--heading-color': template.colors.heading,
    '--text-color': template.colors.text,
    '--font-family': template.fontFamily
  };
};

export default templates; 