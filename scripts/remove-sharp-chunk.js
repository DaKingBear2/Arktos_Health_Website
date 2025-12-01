const fs = require('fs');
const path = require('path');

const chunksDir = path.join(__dirname, '..', 'dist', '_worker.js', 'chunks');

if (fs.existsSync(chunksDir)) {
  const files = fs.readdirSync(chunksDir);
  files.forEach(file => {
    if (file.includes('sharp')) {
      const filePath = path.join(chunksDir, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`Removed sharp chunk: ${file}`);
      } catch (err) {
        console.warn(`Could not remove ${file}:`, err.message);
      }
    }
  });
}
