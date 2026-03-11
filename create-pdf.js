const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

async function createPDF() {
  try {
    const markdown = fs.readFileSync('CODE_DOCUMENTATION.md', 'utf8');
    const pdfDoc = await PDFDocument.create();
    
    // Add title page
    let page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    
    page.drawText('Chat App V1.2', {
      x: 50,
      y: height - 100,
      size: 36,
      color: rgb(26/255, 115/255, 232/255),
    });
    
    page.drawText('Complete Code Documentation', {
      x: 50,
      y: height - 150,
      size: 18,
      color: rgb(30/255, 64/255, 175/255),
    });
    
    page.drawText('Generated: March 10, 2026', {
      x: 50,
      y: height - 180,
      size: 12,
      color: rgb(100/255, 100/255, 100/255),
    });
    
    // Add content pages from markdown
    const lines = markdown.split('\n');
    let pageNum = 1;
    let y = height - 50;
    const lineHeight = 12;
    const maxCharsPerLine = 90;
    
    for (const line of lines.slice(0, 500)) { // Limit content for demo
      if (y < 50) {
        page = pdfDoc.addPage([612, 792]);
        y = height - 50;
        pageNum++;
      }
      
      if (!line.trim()) {
        y -= lineHeight / 2;
        continue;
      }
      
      let fontSize = 10;
      let color = rgb(0, 0, 0);
      let text = line;
      
      if (line.startsWith('# ')) {
        fontSize = 18;
        color = rgb(26/255, 115/255, 232/255);
        text = line.substring(2);
        y -= 6;
      } else if (line.startsWith('## ')) {
        fontSize = 14;
        color = rgb(30/255, 64/255, 175/255);
        text = line.substring(3);
        y -= 4;
      } else if (line.startsWith('### ')) {
        fontSize = 12;
        color = rgb(59/255, 130/255, 246/255);
        text = line.substring(4);
        y -= 3;
      } else if (line.startsWith('```')) {
        fontSize = 8;
        color = rgb(139/255, 0, 0);
        text = '[Code Block]';
      }
      
      // Truncate long lines
      text = text.substring(0, maxCharsPerLine);
      
      page.drawText(text, {
        x: 50,
        y: y,
        size: fontSize,
        color: color,
      });
      
      y -= lineHeight;
    }
    
    // Save PDF
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('Chat_App_V1.2_Documentation.pdf', pdfBytes);
    console.log('✅ PDF created successfully!');
    console.log('📄 File: Chat_App_V1.2_Documentation.pdf');
    console.log('📊 Size: ' + (pdfBytes.length / 1024).toFixed(2) + ' KB');
    console.log('📄 File: Chat_App_V1.2_Documentation.html (Alternative version)');
    console.log('📝 File: CODE_DOCUMENTATION.md (Markdown source)');
  } catch (err) {
    console.error('Error creating PDF:', err.message);
    process.exit(1);
  }
}

createPDF();
