# Anime Navigation 🎮

二次元风格的导航网站，深色主题默认，支持主题切换与记忆功能

![预览图](assets/preview.jpg)

## 特性 ✨
- 🎨 二次元视觉风格
- 🌓 深色/浅色主题切换
- 💾 本地存储主题偏好
- 📱 响应式设计
- 🚀 快速加载（Cloudflare Pages部署）

## 使用方式 🛠️
1. 克隆仓库

```bash
git clone https://github.com/yourname/anim-nav.git
```

2. 添加你的链接
编辑 `index.html` 在 `grid-container` 中添加新的卡片：

```html
<a href="你的链接" class="card">
<img src="assets/icons/图标文件" alt="站点名称">
<span>显示名称</span>
</a>
```


## 部署到 Cloudflare 🚀
1. 登录 Cloudflare Dashboard
2. 选择 Pages → 创建项目
3. 连接你的 GitHub 仓库
4. 构建命令留空，输出目录选择 `/`

## 贡献指南 🤝
欢迎提交 PR！请遵循以下规范：
- 保持代码风格统一
- 新功能请添加对应说明
- 图标文件请使用 PNG 格式 (64x64)

## 许可证 📜
MIT License


