const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content');
const outputFile = path.join(__dirname, '../src/data/articles.json');

async function generateArticlesList() {
  try {
    // Ensure the output directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read all files in the content directory
    const files = fs.readdirSync(contentDir);
    
    // Filter for markdown files (excluding index.md and other non-article files)
    const markdownFiles = files.filter(file => 
      file.endsWith('.md') && 
      file !== 'index.md' && 
      !file.startsWith('.')
    );

    // Write the articles list to JSON
    fs.writeFileSync(outputFile, JSON.stringify(markdownFiles, null, 2));
    
    console.log(`Generated articles list with ${markdownFiles.length} articles:`);
    markdownFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
    
  } catch (error) {
    console.error('Failed to generate articles list:', error);
    process.exit(1);
  }
}

generateArticlesList();