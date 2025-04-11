import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeViewer.css';

export default function CodeViewer({ code, language = 'html' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Clean and format the code
  const formatCode = (rawCode) => {
    if (!rawCode) return '';
    
    // Remove markdown code block markers if present
    let cleaned = rawCode;
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.split('\n').slice(1, -1).join('\n');
    }
    
    // Remove JSON wrapper if present
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.code) cleaned = parsed.code;
      else if (parsed.message) cleaned = parsed.message;
    } catch (e) {
      // Not JSON, continue with cleaned code
    }
    
    return cleaned;
  };

  const formattedCode = formatCode(code);
  
  return (
    <div className={`code-viewer ${isExpanded ? 'expanded' : ''}`}>
      <div className="view-toolbar">
        <div className="file-header">
          <span className="file-name">generated.{language}</span>
          <span className="language-badge">{language}</span>
        </div>
        <button 
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className="code-container">
        <SyntaxHighlighter 
          language={language} 
          style={atomDark}
          showLineNumbers={true}
          wrapLines={true}
          lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 8px 8px',
            background: '#011627',
            fontSize: '0.9rem'
          }}
        >
          {formattedCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
