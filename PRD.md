# 自然拼读大冒险 (Phonics Adventure) - 产品需求文档

## 1. 项目概述

**项目名称：** 自然拼读大冒险 (Phonics Adventure)

**项目类型：** 儿童教育 Web 游戏

**核心技术栈：** React 18 + Vite + Tailwind CSS

**发音技术：** 原生 Web Speech API (window.speechSynthesis)

---

## 2. 设计风格

### UI 设计
- **整体风格：** 极简可爱风
- **配色方案：** 马卡龙色系（粉色、紫色、蓝色渐变）
- **圆角设计：** 大圆角 (rounded-3xl)
- **阴影效果：** 柔和阴影，营造立体感

### 背景设计
- 星空/宇宙主题 CSS 渐变背景
- 闪烁星星动画效果
- 预留"关卡主题"概念（如：森林、海洋、太空等）

---

## 3. 游戏模式

### 3.1 看词选图模式
- 显示一个单词（如：EA - "bean"）
- 展示多个图片选项
- 玩家选择正确的图片

### 3.2 听音选词模式
- 播放单词发音（使用 TTS）
- 显示多个单词选项
- 玩家选择正确的单词

### 3.3 拼读练习模式
- 显示发音规则（如：ea, ai, ou）
- 给出多个单词
- 玩家选择符合规则的单词

---

## 4. 发音功能

### 技术方案
- **暂时方案：** 使用原生 `window.speechSynthesis` API
- **语音引擎：** 浏览器内置 TTS 引擎
- **语言设置：** en-US（美式英语）
- **语速设置：** 0.8（适合儿童）

### 实现示例
```javascript
const speak = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
}
```

---

## 5. 数据结构

### 发音规则数据 (rules.js)
```javascript
{
  word: "bean",        // 英文单词
  rule: "ea",          // 发音规则
  options: ["bear", "bean", "bell", "ball"]  // 选项列表
}
```

---

## 6. 未来扩展

- [ ] 添加外部 MP3 音频支持
- [ ] 更多关卡主题
- [ ] 分数系统和成就系统
- [ ] 动画效果增强
- [ ] 响应式移动端适配
- [ ] 音效反馈
