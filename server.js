const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

app.use(express.json());

app.post('/api/update-config', async (req, res) => {
    try {
        const { defaultBgImage } = req.body;
        const configPath = path.join(__dirname, 'config.js');
        
        // 读取当前配置
        let configContent = await fs.readFile(configPath, 'utf8');
        
        // 更新defaultBgImage
        configContent = configContent.replace(
            /defaultBgImage:.*?,/,
            `defaultBgImage: "${defaultBgImage}",`
        );
        
        // 写入文件
        await fs.writeFile(configPath, configContent);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating config:', error);
        res.status(500).json({ error: 'Failed to update config' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
}); 