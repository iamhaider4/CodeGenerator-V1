import React, { useState } from 'react';
import axios from 'axios';
import CodeViewer from './components/CodeViewer';
import WebView from './components/WebView';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [html, setHtml] = useState('<html><body><h1>Preview will appear here</h1></body></html>');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const isReactCode = (code) => /import React/.test(code) || /ReactDOM/.test(code);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/generate', { prompt, language: 'html' });
      const { code: generatedCode, suggestions: generatedSuggestions, error: apiError, message: apiMessage } = response.data;
      if (apiError) {
        setError(apiMessage || 'Error generating code');
      } else {
        setCode(generatedCode);
        setSuggestions(generatedSuggestions);
        setHtml(isReactCode(generatedCode) ? '' : generatedCode);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate code');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTestContent = () => {
    const testHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Page</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { color: #61dafb; }
        </style>
      </head>
      <body>
        <h1>Test HTML Content</h1>
        <p>This is a test of the code viewer and web preview components.</p>
      </body>
      </html>
    `;
    setCode(testHTML);
    setHtml(testHTML);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const ext = isReactCode(code) ? 'jsx' : 'html';
    const filename = `generated.${ext}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Code Generator</h1>
        
        <div className="input-section">
          <form onSubmit={handleSubmit}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
            />
            <div className="button-group">
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Code'}
              </button>
              <button 
                type="button" 
                onClick={loadTestContent}
                className="test-button"
              >
                Load Test Content
              </button>
            </div>
          </form>
          {error && <div className="error">{error}</div>}
        </div>
        
        <div className="code-section">
          <h2>Generated Code</h2>
          {code ? (
            <CodeViewer code={code} language="html" />
          ) : (
            <div className="placeholder">Generated code will appear here</div>
          )}
          {suggestions.length > 0 && (
            <div className="suggestions">
              <h3>Suggestions</h3>
              <ul>
                {suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={downloadCode} className="download-btn">Download Code</button>
        </div>
        
        <div className="preview-section">
          <h2>Live Preview</h2>
          <WebView html={code || html} />
        </div>
      </header>
    </div>
  );
}

export default App;
