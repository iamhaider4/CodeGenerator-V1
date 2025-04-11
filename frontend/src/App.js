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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/generate', {
        prompt,
        language: 'html'
      });
      
      // Handle both direct code and message.code formats
      const receivedCode = response.data.code || 
                          (response.data.message && response.data.message.code) || 
                          response.data;
      
      setCode(typeof receivedCode === 'string' ? receivedCode : JSON.stringify(receivedCode, null, 2));
      setHtml(typeof receivedCode === 'string' ? receivedCode : '');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate code');
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
