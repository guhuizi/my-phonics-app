import { useState, useEffect, useRef } from 'react';
import { speak, stopSpeaking } from '../utils/tts';
import { phonicsData } from '../data/rules';

const LEVELS = [
  { level: 1, name: '26字母音', emoji: '🔤', color: 'from-pink-400 to-pink-500' },
  { level: 2, name: '短元音组合', emoji: '📖', color: 'from-purple-400 to-purple-500' },
  { level: 3, name: '长元音组合', emoji: '✨', color: 'from-blue-400 to-blue-500' },
  { level: 4, name: '元音字母组合', emoji: '🌟', color: 'from-cyan-400 to-cyan-500' },
  { level: 5, name: '辅音字母组合', emoji: '🎯', color: 'from-green-400 to-green-500' },
  { level: 6, name: '特殊组合', emoji: '🏆', color: 'from-yellow-400 to-orange-500' },
];

function LearnMode({ onBack }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  const levelData = phonicsData.filter(item => item.level === currentLevel);
  const currentItem = levelData[currentIndex];
  const totalInLevel = levelData.length;

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const playRuleSound = () => {
    speak(currentItem.rule);
  };

  const playWordSound = () => {
    speak(currentItem.word);
  };

  const playBoth = () => {
    stopSpeaking();
    setTimeout(() => speak(currentItem.rule), 100);
    setTimeout(() => speak(currentItem.word), 1200);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedText(url);
        setShowResult(true);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      speak(currentItem.word);
    } catch (err) {
      alert('请允许麦克风权限才能使用跟读功能！');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (recordedText && audioRef.current) {
      audioRef.current.play();
    }
  };

  const nextCard = () => {
    setShowResult(false);
    setRecordedText('');
    if (currentIndex < totalInLevel - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (currentLevel < 6) {
      setCurrentLevel(prev => prev + 1);
      setCurrentIndex(0);
    } else {
      setCurrentIndex(0);
      setCurrentLevel(1);
    }
  };

  const prevCard = () => {
    setShowResult(false);
    setRecordedText('');
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (currentLevel > 1) {
      const prevLevelData = phonicsData.filter(item => item.level === currentLevel - 1);
      setCurrentLevel(prev => prev - 1);
      setCurrentIndex(prevLevelData.length - 1);
    }
  };

  const goToLevel = (level) => {
    setShowResult(false);
    setRecordedText('');
    setCurrentLevel(level);
    setCurrentIndex(0);
  };

  const currentLevelInfo = LEVELS[currentLevel - 1] || LEVELS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <audio ref={audioRef} src={recordedText} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl
                       hover:bg-white/30 transition-all duration-300"
          >
            ← 返回
          </button>
          <h1 className="text-white text-xl font-bold">📚 学习模式</h1>
          <div className="w-20"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {LEVELS.map(lv => (
            <button
              key={lv.level}
              onClick={() => goToLevel(lv.level)}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-300
                ${currentLevel === lv.level
                  ? `bg-gradient-to-r ${lv.color} text-white scale-110`
                  : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
            >
              {lv.emoji} {lv.level}
            </button>
          ))}
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
            <div className="text-center mb-4">
              <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${currentLevelInfo.color} text-white text-sm font-bold mb-3`}>
                {currentLevelInfo.emoji} {currentLevelInfo.name}
              </div>
              <p className="text-gray-500 text-sm">
                第 {currentIndex + 1} / {totalInLevel} 张卡片
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">发音规则</p>
                <p className="text-5xl font-bold text-purple-600 mb-2">{currentItem.rule}</p>
                <p className="text-2xl text-pink-500">{currentItem.phonetic}</p>
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  onClick={playRuleSound}
                  className="px-4 py-2 bg-purple-400 text-white rounded-xl font-bold hover:bg-purple-500 transition-all whitespace-nowrap"
                >
                  🔊 规则
                </button>
                <button
                  onClick={playWordSound}
                  className="px-4 py-2 bg-pink-400 text-white rounded-xl font-bold hover:bg-pink-500 transition-all whitespace-nowrap"
                >
                  🔤 单词
                </button>
                <button
                  onClick={playBoth}
                  className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl font-bold hover:scale-105 transition-all whitespace-nowrap"
                >
                  🎵 连续
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-4">
              <div className="text-center">
                <p className="text-4xl mb-2">{currentItem.emoji}</p>
                <p className="text-3xl font-bold text-blue-600">{currentItem.word}</p>
                <p className="text-gray-500 mt-1">{currentItem.translation}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 mb-4">
              <p className="text-center text-gray-600 font-medium mb-3">
                🎤 跟读练习（可选）
              </p>
              <div className="flex justify-center gap-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500
                               text-white font-bold rounded-xl shadow-lg
                               hover:scale-105 transition-all"
                  >
                    🎤 开始跟读
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-500
                               text-white font-bold rounded-xl shadow-lg animate-pulse"
                  >
                    ⏹️ 停止
                  </button>
                )}

                {recordedText && (
                  <button
                    onClick={playRecording}
                    className="px-4 py-3 bg-blue-400 text-white font-bold rounded-xl hover:bg-blue-500 transition-all"
                  >
                    ▶️ 播放录音
                  </button>
                )}
              </div>

              {showResult && (
                <div className="mt-4 p-3 bg-white/50 rounded-xl text-center">
                  <p className="text-green-600 font-bold">✅ 录音完成！可以点击播放听听自己的发音~</p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevCard}
                disabled={currentLevel === 1 && currentIndex === 0}
                className={`px-6 py-3 rounded-xl font-bold transition-all
                  ${currentLevel === 1 && currentIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
              >
                ← 上一张
              </button>
              <button
                onClick={nextCard}
                className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400
                           text-white font-bold rounded-xl shadow-lg
                           hover:scale-105 transition-all"
              >
                下一张 →
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-white/60 text-sm">
              💡 提示：先听发音，再跟读练习，最后去游戏模式检验学习成果！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnMode;
