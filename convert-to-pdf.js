const fs = require('fs');
const path = require('path');

// Create a simple HTML version that can be printed to PDF
const markdown = fs.readFileSync('CODE_DOCUMENTATION.md', 'utf8');

// Simple markdown to HTML converter
function markdownToHtml(md) {
  let html = md
    // Headers
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    // Code blocks
    .replace(/```(\w+)?([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Lists
    .replace(/^\* (.*?)$/gm, '<li>$1</li>')
    // Paragraphs
    .split('\n\n')
    .map(para => para.trim() ? 
      (para.includes('<') ? para : `<p>${para}</p>`) 
      : ''
    )
    .join('')
    // Code styling
    .replace(/`(.*?)`/g, '<code>$1</code>');

  return html;
}

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat App V1.2 - Code Documentation</title>
  <style>
    * { margin: 0; padding: 0; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 { font-size: 2.5em; margin: 30px 0 20px 0; color: #1a73e8; border-bottom: 3px solid #1a73e8; padding-bottom: 10px; }
    h2 { font-size: 2em; margin: 25px 0 15px 0; color: #1e40af; }
    h3 { font-size: 1.3em; margin: 20px 0 10px 0; color: #3b82f6; }
    p { margin: 10px 0; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; color: #d32f2f; }
    pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0; line-height: 1.4; }
    pre code { background: none; padding: 0; color: inherit; }
    li { margin-left: 30px; margin: 5px 0 5px 30px; }
    a { color: #1a73e8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    strong { color: #1a73e8; font-weight: 600; }
    em { font-style: italic; }
    hr { border: none; border-top: 2px solid #ddd; margin: 40px 0; }
    .header-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 8px; text-align: center; margin-bottom: 40px; }
    .header-section h1 { color: white; border: none; margin: 0; font-size: 3em; }
    .header-section p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 1.1em; }
    .toc { background: #f9f9f9; padding: 20px; border-left: 4px solid #1a73e8; margin: 20px 0; }
    .toc ul { list-style: none; }
    .toc li { margin: 5px 0; padding-left: 20px; }
    .toc li:before { content: "→ "; color: #1a73e8; font-weight: bold; }
    .section-break { page-break-after: always; margin: 50px 0; }
    @media print { body { padding: 0; } .section-break { page-break-after: always; } }
  </style>
</head>
<body>
  <div class="header-section">
    <h1>Chat App V1.2</h1>
    <p>Complete Code Documentation</p>
    <p style="font-size: 0.9em; margin-top: 10px;">Generated on March 10, 2026</p>
  </div>
  
  ${markdownToHtml(markdown)}
  
  <hr style="margin-top: 50px;">
  <p style="text-align: center; color: #999; font-size: 0.9em; margin-top: 30px;">
    Chat App V1.2 © 2026 - Full Stack Chat Application
  </p>
</body>
</html>
`;

fs.writeFileSync('Chat_App_V1.2_Documentation.html', htmlContent);
console.log('✅ HTML documentation created: Chat_App_V1.2_Documentation.html');
console.log('📄 Open this file in a browser and use Print → Save as PDF');
