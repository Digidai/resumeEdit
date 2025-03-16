import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ResumeEdit - Create and Download Professional Resumes</title>
        <meta name="description" content="Edit your resume online, choose from different templates, and download in PDF or Word format" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 