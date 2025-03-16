import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { templates } from '../components/TemplateStyles';

export default function Templates() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Resume Templates</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our professionally designed templates to make your resume stand out. Each template is optimized for readability and ATS compatibility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div 
                  className="h-64 flex items-center justify-center" 
                  style={{ backgroundColor: template.colors.secondary }}
                >
                  <div className={`resume-preview ${template.class}`}>
                    <div className="w-48 h-64 border border-gray-300 bg-white shadow-sm p-4 transform scale-75 overflow-hidden">
                      <div 
                        className="h-8 mb-3" 
                        style={{ backgroundColor: template.colors.primary }}
                      ></div>
                      <div className="space-y-2">
                        <div 
                          className="h-2 rounded w-3/4" 
                          style={{ backgroundColor: template.colors.heading }}
                        ></div>
                        <div 
                          className="h-2 rounded w-1/2" 
                          style={{ backgroundColor: template.colors.text }}
                        ></div>
                        <div 
                          className="h-2 rounded w-5/6" 
                          style={{ backgroundColor: template.colors.text }}
                        ></div>
                        <div 
                          className="h-2 rounded w-2/3" 
                          style={{ backgroundColor: template.colors.text }}
                        ></div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <div 
                          className="h-2 rounded w-3/4" 
                          style={{ backgroundColor: template.colors.text }}
                        ></div>
                        <div 
                          className="h-2 rounded w-1/2" 
                          style={{ backgroundColor: template.colors.text }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h2>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Features:</h3>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    {template.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href={`/?template=${template.id}`} 
                    className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Use This Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 