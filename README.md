# 私人导航网站

## 功能特性

- 🔒 基于SHA-256的密码保护
- 🌓 亮/暗双主题模式
- 📱 响应式设计
- 🔍 即时搜索功能
- 🗂️ JSON数据驱动
- 📦 零依赖纯静态部署

## 部署指南

1. Fork本仓库
2. 登录Cloudflare控制台
3. 创建Pages项目并连接GitHub仓库
4. 设置构建命令（留空即可，因为是纯静态站点）
5. 生成访问密码：
   ```bash
   echo -n "你的密码" | shasum -a 256
   ```
6. 将生成的哈希值替换script.js中的PASSWORD_HASH

## 自定义配置

- 修改data.json添加导航项
- 在style.css中调整样式变量
- 添加CNAME文件设置自定义域名 