import { useState, useEffect } from 'react';
import { speak, stopSpeaking } from '../utils/tts';
import { phonicsData } from '../data/rules';

const GAME_MODES = {
  picture: {
    id: 'picture',
    name: '看词选图',
    emoji: '🖼️',
    objective: '看图片，听发音，选出对应的单词！',
    instruction: '仔细看图片，听发音，选出正确的单词'
  },
  listen: {
    id: 'listen',
    name: '听音选词',
    emoji: '🎧',
    objective: '听发音，选出单词对应的字母组合！',
    instruction: '仔细听发音，选出单词中的字母组合'
  },
  rule: {
    id: 'rule',
    name: '看词选规',
    emoji: '📖',
    objective: '看单词，选出正确的字母组合！',
    instruction: '根据提示的翻译和空格，选出正确的字母组合'
  },
  adventure: {
    id: 'adventure',
    name: '闯关挑战',
    emoji: '🚀',
    objective: '连续答对7道题即可过关，挑战全部6关！',
    instruction: '每关8道题，答对7道以上解锁下一关'
  }
};

const MINT_COLORS = [
  'from-pink-300 to-pink-400',
  'from-purple-300 to-purple-400',
  'from-cyan-300 to-cyan-400',
  'from-yellow-300 to-yellow-400',
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateRuleOptions(correctRule, level, allData) {
  const sameLevelRules = allData
    .filter(item => item.level === level && item.rule !== correctRule)
    .map(item => item.rule);

  const sameLevelUnique = [...new Set(sameLevelRules)];
  const shuffledSame = shuffleArray(sameLevelUnique).slice(0, 3);

  const options = [...shuffledSame, correctRule];
  return shuffleArray(options);
}

function PhonicsGame({ mode = 'rule', onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [options, setOptions] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    const levelData = phonicsData.filter(item => item.level === currentLevel);
    const shuffled = shuffleArray(levelData).slice(0, 8);
    setQuestions(shuffled);
  }, [currentLevel]);

  useEffect(() => {
    if (questions.length === 0 || gameOver) return;

    const q = questions[currentIndex];
    const ruleOptions = generateRuleOptions(q.rule, currentLevel, phonicsData);
    setOptions(ruleOptions);

    if (mode === 'picture' || mode === 'listen') {
      setTimeout(() => speak(q.word), 500);
    } else if (mode === 'rule') {
      setTimeout(() => speak(q.word), 500);
    }

    return () => stopSpeaking();
  }, [currentIndex, questions, gameOver, mode, currentLevel]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-2xl">加载中...</p>
      </div>
    );
  }

  if (gameOver) {
    const passed = score >= questions.length * 7;
    const nextLevel = passed && currentLevel < 6 ? currentLevel + 1 : currentLevel;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-2xl text-center max-w-md w-full">
          <p className="text-6xl mb-4">{passed ? '🎉' : '💪'}</p>
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
            {passed ? '恭喜过关！' : '继续加油！'}
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            {GAME_MODES[mode]?.emoji} {GAME_MODES[mode]?.name} · 第 {currentLevel} 关
          </p>
          <p className="text-2xl text-gray-600 mb-4">
            得分：<span className="text-pink-500 font-bold">{score}</span> / {questions.length * 10}
          </p>

          {passed && currentLevel < 6 && (
            <p className="text-green-500 font-bold mb-4">
              🌟 解锁第 {nextLevel} 关！
            </p>
          )}

          <div className="flex flex-col gap-3">
            {passed && currentLevel < 6 ? (
              <button
                onClick={() => {
                  setCurrentLevel(nextLevel);
                  setCurrentIndex(0);
                  setScore(0);
                  setGameOver(false);
                  setOptions([]);
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500
                           text-white text-xl font-bold rounded-3xl
                           shadow-lg hover:shadow-xl transition-all duration-300
                           hover:scale-105"
              >
                🚀 挑战第 {nextLevel} 关
              </button>
            ) : (
              <button
                onClick={() => {
                  const levelData = phonicsData.filter(item => item.level === currentLevel);
                  const shuffled = shuffleArray(levelData).slice(0, 8);
                  setQuestions(shuffled);
                  setCurrentIndex(0);
                  setScore(0);
                  setGameOver(false);
                  setOptions([]);
                }}
                className="px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-500
                           text-white text-xl font-bold rounded-3xl
                           shadow-lg hover:shadow-xl transition-all duration-300
                           hover:scale-105"
              >
                🔄 再玩一次
              </button>
            )}

            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-2xl
                         hover:bg-gray-300 transition-all duration-300"
            >
              ← 返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const getHintWord = () => {
    const word = currentQuestion.word.toLowerCase();
    const rule = currentQuestion.rule.toLowerCase();
    const index = word.indexOf(rule);

    if (index !== -1) {
      const before = word.substring(0, index);
      const after = word.substring(index + rule.length);
      return { before, after };
    }
    return { before: word.slice(0, 1), after: word.slice(1) };
  };

  const handleOptionClick = (option) => {
    if (showResult) return;

    const correct = option === currentQuestion.rule;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(prev => prev + 10);
    }

    setTimeout(() => {
      setShowResult(false);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 1200);
  };

  const replaySound = () => {
    speak(currentQuestion.word);
  };

  const { before, after } = getHintWord();
  const gameMode = GAME_MODES[mode];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6">
      <div className="absolute top-4 left-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl
                     hover:bg-white/30 transition-all duration-300 shadow-lg text-sm md:text-base"
        >
          ← 返回
        </button>
      </div>

      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
        <span className="text-white font-bold text-sm md:text-lg">得分: {score}</span>
      </div>

      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
        <span className="text-white text-sm md:text-base">
          {currentQuestion.category} · 第 {currentIndex + 1} / {questions.length} 题
        </span>
      </div>

      <div className="text-center mb-4 mt-8">
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-6 py-2 rounded-full inline-block">
          <span className="text-white text-lg md:text-xl font-bold">
            {gameMode?.emoji} {gameMode?.name} · 第 {currentLevel} 关
          </span>
        </div>
        <p className="text-white/90 text-base md:text-lg mt-3 font-medium">
          🎯 {gameMode?.objective}
        </p>
        <p className="text-white/60 text-sm mt-1">
          {gameMode?.instruction}
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl max-w-lg w-full mb-6">
        <div className="text-center mb-4">
          {mode === 'picture' && (
            <div>
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 mb-4">
                <p className="text-4xl md:text-5xl mb-2">{currentQuestion.emoji}</p>
                <p className="text-gray-600">这个图片代表哪个单词？</p>
              </div>
              <button
                onClick={replaySound}
                className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400
                           text-white font-bold rounded-xl shadow hover:scale-105 transition-all"
              >
                🔊 听发音
              </button>
            </div>
          )}

          {mode === 'listen' && (
            <div>
              <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-2xl p-4 mb-4">
                <p className="text-gray-600 mb-2">听音选词</p>
                <p className="text-gray-500 text-sm">意思：{currentQuestion.translation}</p>
              </div>
              <button
                onClick={replaySound}
                className="px-8 py-3 bg-gradient-to-r from-pink-400 to-purple-400
                           text-white text-lg font-bold rounded-xl shadow hover:scale-105 transition-all"
              >
                🔊 再听一次
              </button>
            </div>
          )}

          {mode === 'rule' && (
            <div>
              <p className="text-gray-500 mb-3">✨ 请为单词填上正确的字母组合！</p>
              <div className="inline-flex items-center justify-center mb-3">
                <span className="text-4xl md:text-5xl font-bold text-purple-700">{before}</span>
                <span className="w-12 md:w-16 h-2 bg-pink-400 rounded-full mx-1 animate-pulse"></span>
                <span className="text-4xl md:text-5xl font-bold text-purple-700">{after}</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                💡 提示：{currentQuestion.translation} {currentQuestion.emoji}
              </p>
              <button
                onClick={replaySound}
                className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400
                           text-white font-bold rounded-xl shadow hover:scale-105 transition-all"
              >
                🔊 发音
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {options.map((option, index) => {
            const isSelected = showResult && isCorrect && option === currentQuestion.rule;
            const isWrong = showResult && !isCorrect && option === currentQuestion.rule;

            return (
              <button
                key={`${currentIndex}-${option}`}
                onClick={() => handleOptionClick(option)}
                disabled={showResult}
                className={`
                  bg-gradient-to-br ${MINT_COLORS[index]}
                  p-4 md:p-5 rounded-2xl shadow-lg
                  text-white text-xl md:text-2xl font-bold
                  transition-all duration-300
                  ${!showResult ? 'hover:scale-105 hover:shadow-xl active:scale-95' : ''}
                  ${isSelected ? 'ring-4 ring-green-400 scale-110' : ''}
                  ${isWrong ? 'ring-4 ring-red-400 scale-95 opacity-70' : ''}
                `}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`mt-4 text-center p-3 rounded-xl ${isCorrect ? 'bg-green-400/80' : 'bg-red-400/80'}`}>
            <p className="text-white text-lg md:text-xl font-bold">
              {isCorrect ? '🎉 正确！太棒了！' : `😅 答错了，正确答案是 ${currentQuestion.rule}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhonicsGame;
