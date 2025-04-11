import React, { useState, useEffect } from 'react';
import './WebView.css';

export default function WebView({ html }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [processedHtml, setProcessedHtml] = useState('');
  
  useEffect(() => {
    const extractHtml = (rawHtml) => {
      if (!rawHtml) return '';
      
      // Handle markdown code block
      if (rawHtml.startsWith('```html') && rawHtml.endsWith('```')) {
        return rawHtml.split('\n').slice(1, -1).join('\n');
      }
      
      // Handle JSON response
      try {
        const parsed = JSON.parse(rawHtml);
        return parsed.code || parsed.message || parsed;
      } catch {
        return rawHtml;
      }
    };
    
    setProcessedHtml(extractHtml(html));
  }, [html]);

  return (
    <div className={`web-view ${isExpanded ? 'expanded' : ''}`}>
      <div className="view-toolbar">
        <div className="file-header">
          <span className="file-name">preview.html</span>
          <span className="language-badge">web</span>
        </div>
        <button 
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className="web-preview-container">
        {processedHtml ? (
          <iframe 
            title="web-preview"
            srcDoc={processedHtml}
            sandbox="allow-same-origin allow-scripts allow-forms"
            style={{
              width: '100%',
              height: isExpanded ? '600px' : '300px',
              border: 'none',
              borderRadius: '0 0 8px 8px',
              background: 'white'
            }}
          />
        ) : (
          <div className="no-preview">
            <p>No preview available</p>
            <small>Generated HTML will appear here</small>
          </div>
        )}
      </div>
    </div>
  );
}
