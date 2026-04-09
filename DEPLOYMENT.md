# 快速部署指南 | Quick Deployment Guide

## 本地测试 | Local Testing

1. **创建环境变量文件**
   ```bash
   # 复制模板
   cp .env.example .env
   ```

2. **编辑.env文件**
   用文本编辑器打开.env文件，将你的z.ai API密钥填入：
   ```
   ZAI_API_KEY=sk-你的实际API密钥
   ```

3. **启动服务**
   ```bash
   npm start
   ```

4. **访问应用**
   打开浏览器访问：http://localhost:3000

## Vercel部署 | Vercel Deployment

### 方法一：命令行部署（推荐）

1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```
   按照提示登录你的Vercel账号

3. **部署项目**
   ```bash
   cd study-abroad-ai
   vercel
   ```

4. **配置环境变量**
   部署过程中会提示输入环境变量：
   ```
   ? What's the value of ZAI_API_KEY? sk-你的实际API密钥
   ```

5. **完成部署**
   部署成功后会显示一个URL，例如：https://study-abroad-ai-xxx.vercel.app

### 方法二：GitHub + Vercel（推荐用于展示）

1. **初始化Git仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 留学AI咨询机器人"
   ```

2. **创建GitHub仓库并推送**
   - 访问 https://github.com/new 创建新仓库
   - 执行以下命令（替换为你的仓库地址）：
   ```bash
   git remote add origin https://github.com/你的用户名/study-abroad-ai.git
   git branch -M main
   git push -u origin main
   ```

3. **在Vercel中导入项目**
   - 访问 https://vercel.com/new
   - 选择 "Import Git Repository"
   - 选择你的GitHub仓库
   - 配置项目：
     - **Framework Preset**: Node.js
     - **Root Directory**: ./
     - **Build Command**: `npm install`
     - **Output Directory**: `public`
   - 添加环境变量：
     - Name: `ZAI_API_KEY`
     - Value: 你的z.ai API密钥
   - 点击 "Deploy"

4. **获取访问链接**
   部署完成后，Vercel会提供一个公开URL，你可以直接分享给老师。

## 环境变量配置 | Environment Variables

必须配置的环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| ZAI_API_KEY | Z.ai API密钥 | sk-xxxxxx |

## 测试清单 | Testing Checklist

部署完成后，请测试以下功能：

- [ ] 页面能正常加载
- [ ] 能发送消息并收到AI回复
- [ ] 常见问题按钮能正常工作
- [ ] 中英文切换功能正常
- [ ] 对话历史能正常保存和显示
- [ ] 移动端适配正常

## 常见问题 | FAQ

**Q: 部署后显示"API密钥未配置"？**
A: 检查Vercel项目设置中的Environment Variables是否正确配置了ZAI_API_KEY

**Q: 发送消息没有响应？**
A:
- 检查API密钥是否正确
- 查看Vercel部署日志（在项目Dashboard中）
- 确认z.ai API服务是否正常

**Q: 如何获取公开访问链接？**
A: Vercel部署成功后会自动提供公开URL，格式如：https://你的项目名.vercel.app

**Q: 部署后域名可以修改吗？**
A: 可以，在Vercel项目Settings → Domains中添加自定义域名

## 下一步优化 | Next Steps

1. 添加用户认证功能
2. 实现多用户对话历史（目前存储在浏览器本地）
3. 添加内容过滤和安全机制
4. 优化UI/UX设计
5. 添加数据分析功能

## 需要帮助？ | Need Help?

- 查看完整文档：[README.md](README.md)
- 查看Vercel文档：https://vercel.com/docs
- 联系项目维护者

---

**部署成功后，你可以将Vercel提供的URL分享给老师查看！**
