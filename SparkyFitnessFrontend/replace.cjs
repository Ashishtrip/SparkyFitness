const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === 'dist' || f === 'build' || f === 'public' && dir.includes('public')) return;
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const dir = '/Users/ashishdeotripathi/projects/sparkyfitness/SparkyFitness/SparkyFitnessFrontend';

walk(dir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.html') || filePath.endsWith('.json')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    // Replace 'SparkyFitness' with 'Sparky' but try to avoid breaking paths or GitHub URLs
    // Exclude: SparkyFitnessServer, SparkyFitnessGarmin, SparkyFitnessFrontend, SparkyFitnessMobile
    // Exclude: github.com/CodeWithCJ/SparkyFitness
    // Exclude: /app/SparkyFitnessServer
    // We can just replace all SparkyFitness and Sparky Fitness with Sparky, and then fix the specific excluded ones back.
    
    // Replace "Sparky Fitness"
    content = content.replace(/Sparky Fitness/g, 'Sparky');
    
    // Replace SparkyFitness -> Sparky, but not SparkyFitnessServer, SparkyFitnessGarmin, SparkyFitnessFrontend, SparkyFitnessMobile
    content = content.replace(/SparkyFitness(?!Server|Garmin|Frontend|Mobile)/g, 'Sparky');
    
    // Fix github URLs that got mangled (e.g. github.com/CodeWithCJ/Sparky/...)
    content = content.replace(/github\.com\/CodeWithCJ\/Sparky(?!\w)/g, 'github.com/CodeWithCJ/SparkyFitness');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
