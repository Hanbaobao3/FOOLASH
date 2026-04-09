// 全局状态
let currentLanguage = 'zh';
let chatHistory = [];
let isProcessing = false;

// 多语言配置
const i18n = {
    zh: {
        title: '留学AI咨询机器人',
        subtitle: '专业的留学规划助手，助你实现留学梦想',
        placeholder: '请输入您的问题...',
        send: '发送',
        quickQuestionsTitle: '常见问题',
        historyTitle: '对话历史',
        noHistory: '暂无对话历史',
        clearHistory: '清空历史',
        welcome: '你好！我是你的留学咨询顾问。我可以帮你解答关于留学申请、院校选择、语言考试、签证办理等各种问题。请问有什么可以帮你的吗？',
        processing: '正在思考中...',
        error: '发生错误，请稍后重试',
        success: '已保存到历史记录'
    },
    en: {
        title: 'Study Abroad AI Assistant',
        subtitle: 'Professional study abroad consultant to help you achieve your dreams',
        placeholder: 'Please enter your question...',
        send: 'Send',
        quickQuestionsTitle: 'Common Questions',
        historyTitle: 'Chat History',
        noHistory: 'No chat history',
        clearHistory: 'Clear History',
        welcome: 'Hello! I am your study abroad consultant. I can help you with university applications, school selection, language tests, visa applications, and more. How can I help you today?',
        processing: 'Thinking...',
        error: 'An error occurred, please try again later',
        success: 'Saved to history'
    }
};

// DOM元素
const elements = {
    title: document.getElementById('title'),
    subtitle: document.getElementById('subtitle'),
    zhBtn: document.getElementById('zh-btn'),
    enBtn: document.getElementById('en-btn'),
    chatMessages: document.getElementById('chat-messages'),
    messageInput: document.getElementById('message-input'),
    sendBtn: document.getElementById('send-btn'),
    sendText: document.getElementById('send-text'),
    quickQuestions: document.getElementById('quick-questions'),
    chatHistory: document.getElementById('chat-history'),
    clearHistoryBtn: document.getElementById('clear-history'),
    clearText: document.getElementById('clear-text'),
    loading: document.getElementById('loading'),
    notification: document.getElementById('notification'),
    quickQuestionsTitle: document.getElementById('quick-questions-title'),
    historyTitle: document.getElementById('history-title'),
    noHistory: document.getElementById('no-history')
};

// 初始化
async function init() {
    loadChatHistory();
    loadQuickQuestions();
    updateLanguage();
    addWelcomeMessage();

    // 事件监听
    elements.zhBtn.addEventListener('click', () => switchLanguage('zh'));
    elements.enBtn.addEventListener('click', () => switchLanguage('en'));
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    elements.clearHistoryBtn.addEventListener('click', clearChatHistory);
}

// 切换语言
function switchLanguage(lang) {
    currentLanguage = lang;

    // 更新按钮状态
    elements.zhBtn.classList.toggle('active', lang === 'zh');
    elements.enBtn.classList.toggle('active', lang === 'en');

    updateLanguage();
    loadQuickQuestions();
}

// 更新界面语言
function updateLanguage() {
    const text = i18n[currentLanguage];
    elements.title.textContent = text.title;
    elements.subtitle.textContent = text.subtitle;
    elements.messageInput.placeholder = text.placeholder;
    elements.sendText.textContent = text.send;
    elements.quickQuestionsTitle.textContent = text.quickQuestionsTitle;
    elements.historyTitle.textContent = text.historyTitle;
    elements.noHistory.textContent = text.noHistory;
    elements.clearText.textContent = text.clearHistory;
}

// 加载常见问题
async function loadQuickQuestions() {
    try {
        const response = await fetch(`/api/questions/${currentLanguage}`);
        const data = await response.json();

        elements.quickQuestions.innerHTML = data.questions.map(question =>
            `<button class="quick-question-btn" onclick="sendQuickQuestion('${question.replace(/'/g, "\\'")}')">${question}</button>`
        ).join('');
    } catch (error) {
        console.error('加载常见问题失败:', error);
    }
}

// 发送快捷问题
function sendQuickQuestion(question) {
    elements.messageInput.value = question;
    sendMessage();
}

// 添加欢迎消息
function addWelcomeMessage() {
    const welcomeText = i18n[currentLanguage].welcome;
    addMessage('assistant', welcomeText);
}

// 添加消息到聊天界面
function addMessage(role, content, timestamp = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;

    const time = timestamp || new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    messageDiv.innerHTML = `
        ${content}
        <div class="message-time">${time}</div>
    `;

    elements.chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// 滚动到底部
function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// 发送消息
async function sendMessage() {
    const message = elements.messageInput.value.trim();

    if (!message || isProcessing) return;

    isProcessing = true;
    elements.sendBtn.disabled = true;
    showLoading(true);

    // 添加用户消息
    addMessage('user', message);
    elements.messageInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                language: currentLanguage,
                history: chatHistory
            })
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const data = await response.json();

        // 添加AI回复
        addMessage('assistant', data.reply);

        // 保存到历史记录
        saveToHistory(message, data.reply);
        showNotification(i18n[currentLanguage].success);

    } catch (error) {
        console.error('发送消息错误:', error);
        addMessage('assistant', i18n[currentLanguage].error);
        showNotification(i18n[currentLanguage].error, 'error');
    } finally {
        isProcessing = false;
        elements.sendBtn.disabled = false;
        showLoading(false);
    }
}

// 保存到历史记录
function saveToHistory(userMessage, assistantReply) {
    const historyItem = {
        userMessage,
        assistantReply,
        timestamp: new Date().toISOString(),
        language: currentLanguage
    };

    chatHistory.unshift(historyItem);
    updateHistoryDisplay();
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// 加载历史记录
function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        chatHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

// 更新历史记录显示
function updateHistoryDisplay() {
    if (chatHistory.length === 0) {
        elements.chatHistory.innerHTML = `<p class="no-history">${i18n[currentLanguage].noHistory}</p>`;
        elements.clearHistoryBtn.style.display = 'none';
        return;
    }

    elements.clearHistoryBtn.style.display = 'block';
    elements.chatHistory.innerHTML = chatHistory.map((item, index) => {
        const time = new Date(item.timestamp).toLocaleString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const displayMessage = item.userMessage.length > 50
            ? item.userMessage.substring(0, 50) + '...'
            : item.userMessage;

        return `
            <div class="history-item" onclick="loadHistoryItem(${index})">
                <div class="history-time">${time}</div>
                <div>${displayMessage}</div>
            </div>
        `;
    }).join('');
}

// 加载历史记录项
function loadHistoryItem(index) {
    const item = chatHistory[index];
    if (item) {
        addMessage('user', item.userMessage, new Date(item.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        }));
        addMessage('assistant', item.assistantReply, new Date(item.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        }));
    }
}

// 清空历史记录
function clearChatHistory() {
    if (confirm('确定要清空所有对话历史吗？')) {
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        updateHistoryDisplay();
        showNotification('已清空历史记录');
    }
}

// 显示/隐藏加载状态
function showLoading(show) {
    elements.loading.style.display = show ? 'flex' : 'none';
}

// 显示通知
function showNotification(message, type = 'success') {
    elements.notification.textContent = message;
    elements.notification.className = `notification ${type} show`;

    setTimeout(() => {
        elements.notification.className = 'notification';
    }, 3000);
}

// 自动调整输入框高度
elements.messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});

// 初始化应用
init();
