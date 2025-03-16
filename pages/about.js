import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">About ResumeEdit</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Creating professional resumes has never been easier.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-medium text-gray-900">Our Mission</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Helping job seekers create professional resumes</p>
              </div>
              
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <p className="text-base text-gray-700 mb-4">
                  At ResumeEdit, we believe that everyone should have access to tools that help them create professional, 
                  well-designed resumes that stand out to potential employers. Our platform offers a simple, 
                  intuitive way to edit your resume and download it in multiple formats.
                </p>
                <p className="text-base text-gray-700 mb-4">
                  Our templates are designed with both aesthetics and applicant tracking systems (ATS) in mind, 
                  ensuring that your resume not only looks great but also passes through digital screening systems.
                </p>
                <p className="text-base text-gray-700">
                  Whether you're a recent graduate, changing careers, or a seasoned professional, 
                  ResumeEdit provides the tools you need to showcase your skills and experience effectively.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-medium text-gray-900">Key Features</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">What makes ResumeEdit special</p>
              </div>
              
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Easy Editing</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      Our rich text editor makes it simple to format your resume exactly how you want it.
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Multiple Templates</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      Choose from a variety of professional templates to find the perfect look for your resume.
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Export Options</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      Download your resume in PDF or Word format to suit different application requirements.
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">ATS Friendly</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      All our templates are designed to work well with applicant tracking systems.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="bg-blue-50 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Ready to create your resume?</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Start editing now and download your professional resume in minutes.</p>
                </div>
                <div className="mt-5">
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Editor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 