#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 假设脚本在 node_modules/es-fetch-api/bin/add-skill.js
// skills 目录在 node_modules/es-fetch-api/skills
const sourceDir = path.resolve(__dirname, '../skills');

// 定义所有需要安装的目标目录相对路径
// 兼容 .ai (Cursor), .agent, .agents (Trae 等)
const targetPaths = [
    '.ai/skills/es-fetch-api',
    '.agent/skills/es-fetch-api',
    '.agents/skills/es-fetch-api'
];

console.log(`Installing es-fetch-api skills...`);

let successCount = 0;

try {
    const files = fs.readdirSync(sourceDir);

    targetPaths.forEach(targetPath => {
        const targetDir = path.resolve(process.cwd(), targetPath);
        
        try {
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            files.forEach(file => {
                const sourceFile = path.join(sourceDir, file);
                const targetFile = path.join(targetDir, file);
                
                if (fs.lstatSync(sourceFile).isFile()) {
                    fs.copyFileSync(sourceFile, targetFile);
                }
            });
            
            console.log(`✅ Installed to: ${targetPath}`);
            successCount++;
        } catch (err) {
            console.warn(`⚠️ Skipped ${targetPath}: ${err.message}`);
        }
    });

    if (successCount > 0) {
        console.log('\n🎉 Skills installed successfully!');
        console.log(`You can now reference these skills in your AI configuration.`);
    } else {
        console.error('\n❌ Failed to install skills to any directory.');
        process.exit(1);
    }

} catch (error) {
    console.error('❌ Failed to read skills directory:', error.message);
    process.exit(1);
}
