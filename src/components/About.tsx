import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import './About.css';

// Set up PDF.js worker - using local copy
pdfjs.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';

const About: React.FC = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setLoading(false);
  }

  return (
    <section className="page">
      <div className="pdf-container">
        <div className="pdf-header">
          <h2>Resume</h2>
          <div className="pdf-controls">
            {numPages > 1 && (
              <div className="page-controls">
                <button 
                  onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                  disabled={pageNumber <= 1}
                  className="page-btn"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {pageNumber} of {numPages}
                </span>
                <button 
                  onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                  disabled={pageNumber >= numPages}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
            )}
            <a 
              href="content/resume.pdf" 
              download="Ani_Balasubramaniam_Resume.pdf"
              className="download-btn"
              title="Download PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125">
                <path d="M81.98,80.182H18.02c-1.97,0-3.568,1.597-3.568,3.568c0,1.97,1.597,3.568,3.568,3.568h63.96c1.97,0,3.568-1.597,3.568-3.568  C85.548,81.779,83.951,80.182,81.98,80.182z"/>
                <path d="M47.477,67.758C47.477,67.758,47.477,67.758,47.477,67.758L47.477,67.758c0.166,0.166,0.349,0.314,0.544,0.445  c0.089,0.06,0.186,0.101,0.279,0.151c0.111,0.061,0.217,0.128,0.335,0.176c0.008,0.003,0.015,0.009,0.022,0.012  c0.112,0.045,0.23,0.069,0.345,0.102c0.1,0.029,0.195,0.068,0.298,0.088c0.461,0.092,0.937,0.092,1.398,0  c0.103-0.021,0.198-0.059,0.298-0.088c0.123-0.036,0.248-0.065,0.368-0.114c0.118-0.049,0.224-0.116,0.335-0.176  c0.093-0.051,0.19-0.092,0.279-0.151c0.196-0.131,0.378-0.279,0.544-0.445l13.749-13.749c1.393-1.393,1.393-3.652,0-5.046  c-1.393-1.393-3.652-1.393-5.046,0l-7.659,7.659V16.25c0-1.971-1.597-3.568-3.568-3.568s-3.568,1.597-3.568,3.568v40.372  l-7.659-7.659c-1.393-1.393-3.652-1.393-5.046,0c-1.393,1.393-1.393,3.652,0,5.046L47.477,67.758z"/>
              </svg>
            </a>
          </div>
        </div>
        
        {loading && (
          <div className="pdf-loading">
            Loading resume...
          </div>
        )}
        
        <div className="pdf-viewer">
          <Document
            file="/content/resume.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            renderMode='canvas'
            loading=""
          >
            <Page 
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={true}
              onRenderAnnotationLayerSuccess={() => {
                console.log('Annotation layer rendered successfully');
              }}
              onGetAnnotationsSuccess={(annotations: any[]) => {
                console.log('Annotations retrieved:', annotations);
                console.log('Number of annotations:', annotations?.length || 0);
                console.log('Annotation types:', annotations?.map((a: any) => a.annotationType));
              }}
              onGetAnnotationsError={(error: Error) => {
                console.error('Get annotations error:', error);
              }}
              className="pdf-page"
              scale={6.0}
            />
          </Document>
        </div>
      </div>
    </section>
  );
};

export default About;