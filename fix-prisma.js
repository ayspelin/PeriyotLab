const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  // skip prisma.ts
  if (file.endsWith('prisma.ts')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Pattern 1:
  // import { PrismaClient } from '@prisma/client';
  // import { PrismaPg } from '@prisma/adapter-pg';
  // 
  // const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  // const prisma = new PrismaClient({ adapter });
  
  const prismaImportRegex = /import\s+\{\s*PrismaClient\s*\}\s+from\s+['"]@prisma\/client['"];?\s*/g;
  const adapterImportRegex = /import\s+\{\s*PrismaPg\s*\}\s+from\s+['"]@prisma\/adapter-pg['"];?\s*/g;
  const initRegex1 = /const\s+adapter\s*=\s*new\s+PrismaPg\(\{\s*connectionString:\s*process\.env\.DATABASE_URL!?\s*\}\);\s*/g;
  const initRegex2 = /const\s+prisma\s*=\s*new\s+PrismaClient\(\{\s*adapter\s*\}\);\s*/g;
  
  if (content.match(prismaImportRegex)) {
    content = content.replace(prismaImportRegex, '');
    content = content.replace(adapterImportRegex, '');
    content = content.replace(initRegex1, '');
    content = content.replace(initRegex2, '');
    
    // add import prisma from '@/lib/prisma'; after the last import or at the top
    const newImport = `import prisma from "@/lib/prisma";\n`;
    
    // find first import
    const firstImportMatch = content.match(/import\s+.*from\s+['"].*['"];?/);
    if (firstImportMatch) {
      content = content.replace(firstImportMatch[0], firstImportMatch[0] + '\n' + newImport);
    } else {
      content = newImport + '\n' + content;
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
