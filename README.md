# 留学AI咨询机器人 | Study Abroad AI Assistant

一个专业的留学咨询对话机器人，基于Z.ai API开发，帮助学生规划留学之路。

## 功能特点

- 🎓 **专业留学咨询**：针对留学申请、院校选择、语言考试、签证办理等专业问题提供咨询
- 💬 **智能对话**：基于Z.ai GPT-4模型，提供流畅自然的对话体验
- 📚 **常见问题库**：预设留学常见问题，快速获取答案
- 📝 **对话历史**：自动保存对话历史，方便回顾
- 🌍 **多语言支持**：支持中英文切换
- 📱 **响应式设计**：完美适配桌面和移动设备
- 🚀 **一键部署**：支持Vercel免费部署

## 技术栈

- **前端**：HTML5, Vanilla JavaScript, CSS3
- **后端**：Node.js + Express
- **AI模型**：Z.ai GPT-4
- **部署平台**：Vercel

## 快速开始

### 本地开发

1. **克隆项目**
   ```bash
   cd study-abroad-ai
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置API密钥**
   ```bash
   # 复制环境变量模板
   cp .env.example .env

   # 编辑.env文件，填入你的Z.ai API密钥
   ZAI_API_KEY=your_actual_api_key_here
   ```

4. **启动服务**
   ```bash
   npm start
   ```

5. **访问应用**
   打开浏览器访问 `http://localhost:3000`

### 部署到Vercel

1. **准备部署**

   确保你已经：
   - 注册了Vercel账号 (https://vercel.com)
   - 安装了Vercel CLI：`npm i -g vercel`

2. **部署项目**

   ```bash
   # 在项目目录下
   vercel
   ```

3. **配置环境变量**

   部署过程中会提示配置环境变量，设置：
   ```
   ZAI_API_KEY = 你的z.ai API密钥
   ```

4. **访问应用**

   部署完成后，Vercel会提供一个公开URL，你可以直接访问和分享。

### 使用GitHub + Vercel自动部署

1. **上传到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/study-abroad-ai.git
   git push -u origin main
   ```

2. **连接Vercel**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 导入你的GitHub仓库
   - 配置环境变量 `ZAI_API_KEY`

3. **自动部署**
   - 每次推送到GitHub，Vercel会自动重新部署

## API使用说明

### 聊天接口

```
POST /api/chat
Content-Type: application/json

{
  "message": "申请美国大学需要准备什么材料？",
  "language": "zh",
  "history": []
}

Response:
{
  "reply": "申请美国大学通常需要准备以下材料...",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 常见问题接口

```
GET /api/questions/:language?

Response:
{
  "questions": [
    "申请美国大学需要准备什么材料？",
    "雅思和托福哪个更适合我？",
    ...
  ]
}
```

## 项目结构

```
study-abroad-ai/
├── server.js              # Node.js后端服务器
├── package.json           # 项目配置和依赖
├── vercel.json           # Vercel部署配置
├── .env.example          # 环境变量模板
├── public/               # 前端静态文件
│   ├── index.html       # 主页面
│   ├── style.css        # 样式文件
│   └── app.js           # 前端逻辑
└── README.md             # 项目说明
```

## 自定义配置

### 修改AI角色设定

编辑 `server.js` 中的 `systemPrompt` 来定制AI的回复风格：

```javascript
systemPrompt: `你是一位专业的留学咨询顾问...`
```

### 添加常见问题

在 `studyAbroadKnowledge` 对象中添加新的问题：

```javascript
commonQuestions: [
  "你的新问题1",
  "你的新问题2"
]
```

### 修改样式

编辑 `public/style.css` 来自定义界面外观。

## 注意事项

1. **API密钥安全**：不要将 `.env` 文件提交到Git仓库
2. **API费用**：注意监控Z.ai API的使用量和费用
3. **内容审核**：建议添加内容过滤机制
4. **访问限制**：生产环境建议添加访问控制和速率限制

## 常见问题

**Q: 如何获取Z.ai API密钥？**
A: 访问 z.ai 官网注册账号，在控制台创建API密钥。

**Q: 部署后无法访问？**
A: 检查Vercel环境变量是否正确配置，查看部署日志排查错误。

**Q: 如何添加更多语言？**
A: 在 `server.js` 的 `studyAbroadKnowledge` 和 `app.js` 的 `i18n` 对象中添加新语言配置。

**Q: 对话历史丢失？**
A: 对话历史存储在浏览器的localStorage中，清除浏览器数据会导致历史丢失。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至项目维护者

---

**祝你留学之路顺利！Good luck with your study abroad journey!** 🎓✨
