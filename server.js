const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 留学知识库
const studyAbroadKnowledge = {
  zh: {
    commonQuestions: [
      "申请美国大学需要准备什么材料？",
      "雅思和托福哪个更适合我？",
      "如何选择适合自己的留学国家？",
      "留学申请时间线是怎样的？",
      "留学费用大概需要多少？",
      "如何准备留学推荐信？",
      "留学签证申请流程是什么？",
      "留学期间如何适应新环境？"
    ],
    systemPrompt: `你是一位专业的留学咨询顾问，擅长帮助学生规划留学之路。请用专业、耐心的语气回答问题，提供实用且具体的建议。

你的专业领域包括：
- 美国、英国、加拿大、澳大利亚、新加坡等主要留学国家
- 大学申请流程和要求
- 语言考试准备（雅思、托福、GRE、GMAT等）
- 签证申请流程
- 留学费用和奖学金申请
- 文书写作（个人陈述、推荐信等）
- 留学生活适应建议

回答问题时请注意：
1. 提供准确、最新的信息
2. 根据学生具体情况给出个性化建议
3. 鼓励提问，帮助学生理清思路
4. 提醒重要的时间节点和注意事项`
  },
  en: {
    commonQuestions: [
      "What materials are needed for applying to US universities?",
      "Which is better for me: IELTS or TOEFL?",
      "How do I choose the right study abroad destination?",
      "What is the timeline for study abroad applications?",
      "How much does studying abroad cost?",
      "How to prepare recommendation letters for study abroad?",
      "What is the student visa application process?",
      "How to adapt to the new environment while studying abroad?"
    ],
    systemPrompt: `You are a professional study abroad consultant who excels at helping students plan their international education journey. Please answer questions with a professional and patient tone, providing practical and specific advice.

Your expertise includes:
- Major study destinations: USA, UK, Canada, Australia, Singapore
- University application processes and requirements
- Language test preparation (IELTS, TOEFL, GRE, GMAT)
- Visa application processes
- Study abroad costs and scholarship applications
- Document writing (personal statements, recommendation letters)
- Advice on adapting to study abroad life

When answering questions:
1. Provide accurate and up-to-date information
2. Give personalized advice based on individual circumstances
3. Encourage questions and help students clarify their thinking
4. Remind important deadlines and注意事项`
  }
};

// Z.ai API调用（Anthropic兼容格式）
async function callZaiAPI(messages, apiKey) {
  try {
    console.log('开始调用Z.ai API（Anthropic兼容格式）...');
    console.log('API密钥格式检查:', apiKey ? '存在' : '不存在');
    console.log('消息数量:', messages.length);

    // Z.ai的Anthropic兼容端点
    const base_url = 'https://api.z.ai/api/anthropic';

    const response = await fetch(`${base_url}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'glm-4.7', // GLM-4.7模型
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    console.log('API响应状态:', response.status);
    console.log('API响应头:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误响应内容:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API响应数据:', JSON.stringify(data, null, 2));

    // 检查是否是Anthropic格式响应
    if (data.content && Array.isArray(data.content) && data.content.length > 0) {
      return data.content[0].text;
    }
    // 检查是否是OpenAI格式响应
    else if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    else {
      throw new Error('API响应格式未知');
    }
  } catch (error) {
    console.error('Z.ai API调用失败 - 详细错误:', error);
    console.error('错误类型:', error.constructor.name);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    throw error;
  }
}

// API路由
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'zh', history = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: '消息不能为空' });
    }

    const apiKey = process.env.ZAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API密钥未配置' });
    }

    // 构建消息历史（Z.ai Anthropic兼容端点不支持system角色，将系统提示词作为第一条消息）
    const systemPrompt = studyAbroadKnowledge[language].systemPrompt;

    // 过滤有效的历史消息，确保有正确的格式
    const validHistory = history
      .slice(-10) // 保留最近10条历史
      .filter(msg => msg && msg.role && msg.content) // 确保消息有效
      .map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

    const messages = [
      { role: 'user', content: systemPrompt },
      ...validHistory,
      { role: 'user', content: message }
    ];

    // 调用Z.ai API
    const reply = await callZaiAPI(messages, apiKey);

    res.json({
      reply: reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('聊天错误:', error);
    res.status(500).json({ error: '处理请求时出错，请稍后重试' });
  }
});

// 获取常见问题
app.get('/api/questions/:language?', (req, res) => {
  const language = req.params.language || 'zh';
  res.json({
    questions: studyAbroadKnowledge[language]?.commonQuestions || []
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`留学AI咨询机器人运行在 http://localhost:${PORT}`);
});

// Vercel serverless function export
module.exports = app;
